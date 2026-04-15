"""
VCSA Payments Webhook Implementation
Complete Stripe webhook integration for handling subscription events
"""

from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import stripe
import logging
import hmac
import hashlib
import json
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════
# WEBHOOK MODELS
# ═══════════════════════════════════════════════════════════════

class WebhookEvent(BaseModel):
    """Stripe webhook event model"""
    id: str
    object: str = "event"
    api_version: str
    created: int
    data: Dict[str, Any]
    livemode: bool
    pending_webhooks: Optional[list] = None
    request: Optional[Dict[str, Any]] = None
    type: str


class SubscriptionCreated(BaseModel):
    """Subscription created event data"""
    customer_id: str
    subscription_id: str
    status: str
    current_period_start: int
    current_period_end: int
    items: list
    metadata: Dict[str, Any] = {}


class PaymentSucceeded(BaseModel):
    """Payment succeeded event data"""
    customer_id: str
    subscription_id: str
    amount_paid: int
    currency: str
    status: str
    metadata: Dict[str, Any] = {}


# ═══════════════════════════════════════════════════════════════
# WEBHOOK HANDLERS
# ═══════════════════════════════════════════════════════════════

class PaymentWebhookHandler:
    """Handler for Stripe payment webhooks"""

    def __init__(self, db, stripe_api_key: str, webhook_secret: str):
        self.db = db
        self.stripe_api_key = stripe_api_key
        self.webhook_secret = webhook_secret
        stripe.api_key = stripe_api_key

    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """
        Verify Stripe webhook signature

        Args:
            payload: Raw request payload
            signature: Stripe signature header

        Returns:
            True if signature is valid, False otherwise
        """
        try:
            webhook_secret = self.webhook_secret
            if not webhook_secret:
                logger.warning("Webhook secret not configured")
                return False

            # Extract timestamp and signature
            timestamp = signature.split(',')[0].split('=')[1].strip()
            signatures = signature.split(',')[-1].split('=')[1].strip()

            # Construct signed payload
            signed_payload = f"{timestamp}.{payload.decode('utf-8')}"

            # Compute expected signature
            expected_signature = hmac.compute_sha256(
                webhook_secret.encode(),
                signed_payload.encode(),
                hashlib.sha256
            ).hexdigest()

            # Secure comparison
            if not hmac.compare_digest(expected_signature, signatures):
                logger.warning("Webhook signature verification failed")
                return False

            logger.info("Webhook signature verified successfully")
            return True

        except Exception as e:
            logger.error(f"Error verifying webhook signature: {e}")
            return False

    async def handle_checkout_session_completed(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle checkout.session.completed event

        This is triggered when a user completes the Stripe Checkout flow
        """
        try:
            session = event_data['data']['object']
            customer_id = session.get('customer')
            metadata = session.get('metadata', {})
            user_id = metadata.get('user_id')

            if not user_id:
                logger.warning(f"Checkout session completed without user_id: {session['id']}")
                return {"status": "ignored", "reason": "no user_id in metadata"}

            # Get subscription details
            subscription_id = session.get('subscription')
            if subscription_id:
                subscription = stripe.Subscription.retrieve(subscription_id)
                await self._process_subscription_created(subscription, user_id)

            logger.info(f"Checkout session completed for user: {user_id}")
            return {"status": "success", "user_id": user_id}

        except Exception as e:
            logger.error(f"Error handling checkout.session.completed: {e}")
            raise

    async def handle_subscription_created(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle customer.subscription.created event

        This is triggered when a new subscription is created
        """
        try:
            subscription = event_data['data']['object']
            customer_id = subscription.get('customer')
            subscription_id = subscription.get('id')
            status = subscription.get('status')

            # Get user_id from customer metadata
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.metadata.get('user_id')

            if not user_id:
                logger.warning(f"Subscription created without user_id: {subscription_id}")
                return {"status": "ignored", "reason": "no user_id in customer metadata"}

            # Update user membership based on subscription status
            await self._update_user_membership(user_id, subscription)

            logger.info(f"Subscription created for user: {user_id}, status: {status}")
            return {"status": "success", "user_id": user_id, "subscription_status": status}

        except Exception as e:
            logger.error(f"Error handling subscription.created: {e}")
            raise

    async def handle_subscription_updated(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle customer.subscription.updated event

        This is triggered when a subscription is updated
        """
        try:
            subscription = event_data['data']['object']
            customer_id = subscription.get('customer')
            subscription_id = subscription.get('id')
            status = subscription.get('status')

            # Get user_id from customer metadata
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.metadata.get('user_id')

            if not user_id:
                logger.warning(f"Subscription updated without user_id: {subscription_id}")
                return {"status": "ignored", "reason": "no user_id in customer metadata"}

            # Update user membership
            await self._update_user_membership(user_id, subscription)

            logger.info(f"Subscription updated for user: {user_id}, status: {status}")
            return {"status": "success", "user_id": user_id, "subscription_status": status}

        except Exception as e:
            logger.error(f"Error handling subscription.updated: {e}")
            raise

    async def handle_subscription_deleted(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle customer.subscription.deleted event

        This is triggered when a subscription is canceled/deleted
        """
        try:
            subscription = event_data['data']['object']
            customer_id = subscription.get('customer')
            subscription_id = subscription.get('id')

            # Get user_id from customer metadata
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.metadata.get('user_id')

            if not user_id:
                logger.warning(f"Subscription deleted without user_id: {subscription_id}")
                return {"status": "ignored", "reason": "no user_id in customer metadata"}

            # Downgrade user to free membership
            await self.db.users.update_one(
                {"user_id": user_id},
                {"$set": {"membership": "free"}}
            )

            # Log subscription cancellation
            await self._log_subscription_event(user_id, 'subscription_cancelled', {
                'subscription_id': subscription_id,
                'canceled_at': datetime.now(timezone.utc).isoformat()
            })

            logger.info(f"Subscription canceled for user: {user_id}")
            return {"status": "success", "user_id": user_id, "membership": "free"}

        except Exception as e:
            logger.error(f"Error handling subscription.deleted: {e}")
            raise

    async def handle_payment_succeeded(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle invoice.payment_succeeded event

        This is triggered when a payment succeeds
        """
        try:
            invoice = event_data['data']['object']
            customer_id = invoice.get('customer')
            subscription_id = invoice.get('subscription')

            # Get user_id from customer metadata
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.metadata.get('user_id')

            if not user_id:
                return {"status": "ignored", "reason": "no user_id in customer metadata"}

            # Log successful payment
            await self._log_subscription_event(user_id, 'payment_succeeded', {
                'subscription_id': subscription_id,
                'invoice_id': invoice.get('id'),
                'amount_paid': invoice.get('amount_paid'),
                'currency': invoice.get('currency'),
                'paid_at': datetime.fromtimestamp(invoice.get('created'), tz=timezone.utc).isoformat()
            })

            logger.info(f"Payment succeeded for user: {user_id}")
            return {"status": "success", "user_id": user_id}

        except Exception as e:
            logger.error(f"Error handling invoice.payment_succeeded: {e}")
            raise

    async def handle_payment_failed(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle invoice.payment_failed event

        This is triggered when a payment fails
        """
        try:
            invoice = event_data['data']['object']
            customer_id = invoice.get('customer')

            # Get user_id from customer metadata
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.metadata.get('user_id')

            if not user_id:
                return {"status": "ignored", "reason": "no user_id in customer metadata"}

            # Log failed payment
            await self._log_subscription_event(user_id, 'payment_failed', {
                'invoice_id': invoice.get('id'),
                'amount_due': invoice.get('amount_due'),
                'currency': invoice.get('currency'),
                'attempt_count': invoice.get('attempt_count'),
                'failed_at': datetime.fromtimestamp(invoice.get('created'), tz=timezone.utc).isoformat()
            })

            logger.warning(f"Payment failed for user: {user_id}")
            return {"status": "success", "user_id": user_id}

        except Exception as e:
            logger.error(f"Error handling invoice.payment_failed: {e}")
            raise

    # ═══════════════════════════════════════════════════════════════
    # HELPER METHODS
    # ═══════════════════════════════════════════════════════════════

    async def _process_subscription_created(self, subscription: stripe.Subscription, user_id: str):
        """Process newly created subscription"""
        try:
            status = subscription.status
            items = subscription['items']['data']

            if len(items) > 0:
                price_id = items[0].price.id
                price = stripe.Price.retrieve(price_id)
                product = stripe.Product.retrieve(price.product)

                # Determine membership level based on price
                if product.metadata.get('membership') == 'vip':
                    membership = 'vip'
                elif product.metadata.get('membership') == 'elite':
                    membership = 'elite'
                else:
                    membership = 'vip'  # Default to VIP

                # Update user membership
                await self.db.users.update_one(
                    {"user_id": user_id},
                    {
                        "$set": {
                            "membership": membership,
                            "subscription_id": subscription.id,
                            "customer_id": subscription.customer,
                            "membership_updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )

                logger.info(f"Updated user {user_id} to {membership} membership")

        except Exception as e:
            logger.error(f"Error processing subscription: {e}")
            raise

    async def _update_user_membership(self, user_id: str, subscription: stripe.Subscription):
        """Update user membership based on subscription status"""
        try:
            status = subscription.status
            items = subscription['items']['data']

            if status in ['active', 'trialing']:
                # Determine membership level
                if len(items) > 0:
                    price_id = items[0].price.id
                    price = stripe.Price.retrieve(price_id)
                    product = stripe.Product.retrieve(price.product)

                    membership = product.metadata.get('membership', 'vip')
                else:
                    membership = 'vip'

                await self.db.users.update_one(
                    {"user_id": user_id},
                    {"$set": {"membership": membership}}
                )

            elif status in ['canceled', 'unpaid', 'incomplete_expired']:
                # Downgrade to free membership
                await self.db.users.update_one(
                    {"user_id": user_id},
                    {"$set": {"membership": "free"}}
                )

            logger.info(f"Updated user {user_id} membership to {status}")

        except Exception as e:
            logger.error(f"Error updating user membership: {e}")
            raise

    async def _log_subscription_event(self, user_id: str, event_type: str, event_data: Dict[str, Any]):
        """Log subscription event for analytics and support"""
        try:
            await self.db.subscription_events.insert_one({
                "event_id": f"evt_{user_id}_{event_type}_{datetime.now(timezone.utc).timestamp()}",
                "user_id": user_id,
                "event_type": event_type,
                "event_data": event_data,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        except Exception as e:
            logger.error(f"Error logging subscription event: {e}")
            # Don't raise - logging failures shouldn't block webhooks


# ═══════════════════════════════════════════════════════════════
# WEBHOOK ENDPOINT
# ═══════════════════════════════════════════════════════════════

async def process_stripe_webhook(request: Request, db, webhook_handler: PaymentWebhookHandler):
    """
    Process incoming Stripe webhook

    Args:
        request: FastAPI request object
        db: Database connection
        webhook_handler: Payment webhook handler instance

    Returns:
        JSON response indicating success/failure
    """
    try:
        # Get raw payload
        payload = await request.body()
        if not payload:
            raise HTTPException(status_code=400, detail="No payload received")

        # Get Stripe signature
        sig_header = request.headers.get('stripe-signature')
        if not sig_header:
            raise HTTPException(status_code=400, detail="No Stripe signature header")

        # Verify webhook signature
        if not webhook_handler.verify_webhook_signature(payload, sig_header):
            raise HTTPException(status_code=400, detail="Invalid signature")

        # Parse event
        event = json.loads(payload.decode('utf-8'))
        event_type = event.get('type')
        event_data = event.get('data', {})

        logger.info(f"Received webhook event: {event_type}")

        # Process event based on type
        event_handlers = {
            'checkout.session.completed': webhook_handler.handle_checkout_session_completed,
            'customer.subscription.created': webhook_handler.handle_subscription_created,
            'customer.subscription.updated': webhook_handler.handle_subscription_updated,
            'customer.subscription.deleted': webhook_handler.handle_subscription_deleted,
            'invoice.payment_succeeded': webhook_handler.handle_payment_succeeded,
            'invoice.payment_failed': webhook_handler.handle_payment_failed,
        }

        handler = event_handlers.get(event_type)
        if handler:
            result = await handler(event_data)
            logger.info(f"Webhook event {event_type} processed: {result}")
        else:
            logger.warning(f"Unhandled webhook event type: {event_type}")

        return {"status": "success", "event_type": event_type}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")


# ═══════════════════════════════════════════════════════════════
# EXPORTED FUNCTION FOR SERVER INTEGRATION
# ═══════════════════════════════════════════════════════════════

def setup_payments_webhook(app, db, stripe_api_key: str, webhook_secret: str):
    """
    Setup payments webhook endpoint

    Args:
        app: FastAPI application
        db: Database connection
        stripe_api_key: Stripe API key
        webhook_secret: Stripe webhook secret

    Returns:
        Configured webhook handler instance
    """
    webhook_handler = PaymentWebhookHandler(db, stripe_api_key, webhook_secret)

    @app.post("/api/payments/webhook")
    async def stripe_webhook(request: Request):
        """
        Stripe webhook endpoint

        Processes incoming webhook events from Stripe for:
        - Subscription creation/update/deletion
        - Payment success/failure
        - Checkout completion

        Events handled:
        - checkout.session.completed
        - customer.subscription.created
        - customer.subscription.updated
        - customer.subscription.deleted
        - invoice.payment_succeeded
        - invoice.payment_failed

        Returns:
            JSON response with processing status
        """
        return await process_stripe_webhook(request, db, webhook_handler)

    return webhook_handler
