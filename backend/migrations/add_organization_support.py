"""
Migration Script: Add Multi-Tenant Organization Support

This script migrates VCSA from a single-tenant to multi-tenant architecture:
1. Creates default organization for existing data
2. Migrates all users to default organization
3. Migrates all user_progress, bookmarks, and activity data
4. Creates compound indexes for performance
5. Backs up data before migration

USAGE:
    python -m migrations.add_organization_support

WARNING:
    - This will modify your database
    - BACKUP YOUR DATABASE BEFORE RUNNING
    - Test on staging environment first
"""

import sys
import os
from datetime import datetime
from pathlib import Path

# Add parent directory to path to import server modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from bson import ObjectId
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Database configuration
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')


class OrganizationMigration:
    """Handle migration to multi-tenant architecture"""

    def __init__(self, mongo_url: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]

    async def create_backup_collections(self):
        """Backup existing collections before migration"""
        logger.info("Creating backup collections...")

        collections_to_backup = [
            'users',
            'user_progress',
            'user_activity',
            'bookmarks',
            'posts',
            'events',
            'resources'
        ]

        for collection_name in collections_to_backup:
            backup_collection_name = f"{collection_name}_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

            try:
                # Count documents
                count = await self.db[collection_name].count_documents({})

                if count > 0:
                    logger.info(f"Backing up {collection_name} ({count} documents)...")

                    # Copy collection
                    pipeline = [{"$match": {}}]
                    cursor = self.db[collection_name].aggregate(pipeline)

                    docs = await cursor.to_list(length=None)

                    if docs:
                        await self.db[backup_collection_name].insert_many(docs)
                        logger.info(f"✓ Backed up {collection_name} → {backup_collection_name}")
                else:
                    logger.info(f"Collection {collection_name} is empty, skipping backup")

            except Exception as e:
                logger.error(f"Error backing up {collection_name}: {e}")

        logger.info("Backup completed")

    async def create_default_organization(self):
        """Create the default organization for existing data"""
        logger.info("Creating default organization...")

        # Check if default org already exists
        existing = await self.db.organizations.find_one({"slug": "vcsa"})

        if existing:
            logger.info(f"Default organization already exists: {existing['organization_id']}")
            return existing["organization_id"]

        # Create default organization
        from organization_models import Organization, OrganizationBranding, OrganizationSettings

        default_org = {
            "organization_id": "org_default_vcsa",
            "name": "VCSA - Vacation Club Sales Academy",
            "slug": "vcsa",
            "branding": {
                "logo_url": "/logo.png",
                "logo_dark_url": None,
                "favicon_url": "/favicon.ico",
                "primary_color": "#D4AF37",
                "secondary_color": "#1E3A8A",
                "background_color": "#020204",
                "text_primary": "#F1F5F9",
                "text_secondary": "#94A3B8",
                "font_heading": "Playfair Display",
                "font_body": "DM Sans",
                "site_name": "Vacation Club Sales Academy",
                "tagline": "Transform Your Sales Team",
                "hero_title": "Become a Top Producer",
                "hero_subtitle": "Master the art of vacation club sales",
                "email_from_name": "VCSA",
                "email_from_address": "noreply@vcsa.com",
                "email_footer_text": "Powered by VCSA"
            },
            "domains": [],
            "custom_domain": None,
            "settings": {
                "timezone": "UTC",
                "language": "en",
                "currency": "USD",
                "custom_tracks": False,
                "custom_modules": False,
                "enable_ai_assistant": True,
                "enable_gamification": True,
                "enable_badges": True,
                "enable_leaderboard": False,
                "enable_streaks": True,
                "enable_deal_breakdowns": True,
                "enable_quick_wins": True,
                "stripe_enabled": False,
                "google_oauth_enabled": False,
                "sentry_dsn": None,
                "email_notifications_enabled": True,
                "push_notifications_enabled": False,
                "enable_community": True,
                "enable_events": True,
                "moderate_posts": True,
                "allow_custom_domains": True,
                "api_access_enabled": False
            },
            "feature_flags": {},
            "status": "active",
            "plan": "enterprise",
            "limits": {
                "max_users": -1,  # Unlimited
                "max_admins": 10,
                "max_managers": 50,
                "max_custom_tracks": 6,
                "max_custom_modules_per_track": 10,
                "max_storage_mb": 10240,
                "api_calls_per_month": -1,
                "ai_assistant_calls_per_month": 1000,
                "max_custom_domains": 1,
                "max_webhooks": 5
            },
            "created_at": datetime.utcnow(),
            "created_by": "system",
            "updated_at": datetime.utcnow(),
            "onboarding_completed": True,
            "onboarding_step": 5,
            "industry": "Sales Training",
            "company_size": "Enterprise",
            "target_audience": "Vacation Club Sales Professionals",
            "admin_users": []
        }

        try:
            result = await self.db.organizations.insert_one(default_org)
            logger.info(f"✓ Created default organization: {default_org['organization_id']}")
            return default_org["organization_id"]

        except Exception as e:
            logger.error(f"Error creating default organization: {e}")
            raise

    async def migrate_users(self, organization_id: str):
        """Migrate all users to default organization"""
        logger.info("Migrating users...")

        try:
            # Get all users without organization_id
            cursor = self.db.users.find({"organization_id": {"$exists": False}})
            users = await cursor.to_list(length=None)

            logger.info(f"Found {len(users)} users to migrate")

            if users:
                # Update all users
                result = await self.db.users.update_many(
                    {"organization_id": {"$exists": False}},
                    {"$set": {"organization_id": organization_id}}
                )

                logger.info(f"✓ Migrated {result.modified_count} users to organization {organization_id}")

                # Make admin users org admins
                admin_result = await self.db.users.update_many(
                    {
                        "organization_id": organization_id,
                        "role": "admin"
                    },
                    {"$set": {"role": "org_admin"}}
                )

                logger.info(f"✓ Updated {admin_result.modified_count} admin users to org_admin role")

            else:
                logger.info("No users to migrate")

        except Exception as e:
            logger.error(f"Error migrating users: {e}")
            raise

    async def migrate_user_progress(self, organization_id: str):
        """Migrate user_progress collection"""
        logger.info("Migrating user_progress...")

        try:
            result = await self.db.user_progress.update_many(
                {"organization_id": {"$exists": False}},
                {"$set": {"organization_id": organization_id}}
            )

            logger.info(f"✓ Migrated {result.modified_count} user_progress documents")

        except Exception as e:
            logger.error(f"Error migrating user_progress: {e}")
            raise

    async def migrate_user_activity(self, organization_id: str):
        """Migrate user_activity collection"""
        logger.info("Migrating user_activity...")

        try:
            result = await self.db.user_activity.update_many(
                {"organization_id": {"$exists": False}},
                {"$set": {"organization_id": organization_id}}
            )

            logger.info(f"✓ Migrated {result.modified_count} user_activity documents")

        except Exception as e:
            logger.error(f"Error migrating user_activity: {e}")
            raise

    async def migrate_bookmarks(self, organization_id: str):
        """Migrate bookmarks collection"""
        logger.info("Migrating bookmarks...")

        try:
            result = await self.db.bookmarks.update_many(
                {"organization_id": {"$exists": False}},
                {"$set": {"organization_id": organization_id}}
            )

            logger.info(f"✓ Migrated {result.modified_count} bookmark documents")

        except Exception as e:
            logger.error(f"Error migrating bookmarks: {e}")
            raise

    async def migrate_posts(self, organization_id: str):
        """Migrate posts collection"""
        logger.info("Migrating posts...")

        try:
            result = await self.db.posts.update_many(
                {"organization_id": {"$exists": False}},
                {"$set": {"organization_id": organization_id}}
            )

            logger.info(f"✓ Migrated {result.modified_count} post documents")

        except Exception as e:
            logger.error(f"Error migrating posts: {e}")
            raise

    async def migrate_events(self, organization_id: str):
        """Migrate events collection"""
        logger.info("Migrating events...")

        try:
            result = await self.db.events.update_many(
                {"organization_id": {"$exists": False}},
                {"$set": {"organization_id": organization_id}}
            )

            logger.info(f"✓ Migrated {result.modified_count} event documents")

        except Exception as e:
            logger.error(f"Error migrating events: {e}")
            raise

    async def migrate_resources(self, organization_id: str):
        """Migrate resources collection"""
        logger.info("Migrating resources...")

        try:
            result = await self.db.resources.update_many(
                {"organization_id": {"$exists": False}},
                {"$set": {"organization_id": organization_id}}
            )

            logger.info(f"✓ Migrated {result.modified_count} resource documents")

        except Exception as e:
            logger.error(f"Error migrating resources: {e}")
            raise

    async def create_indexes(self):
        """Create compound indexes for multi-tenant queries"""
        logger.info("Creating indexes...")

        indexes = [
            # Users
            {
                "collection": "users",
                "index": [("organization_id", 1), ("email", 1)],
                "options": {"unique": True, "name": "org_email_unique"}
            },
            {
                "collection": "users",
                "index": [("organization_id", 1), ("role", 1)],
                "options": {"name": "org_role_index"}
            },

            # User Progress
            {
                "collection": "user_progress",
                "index": [("organization_id", 1), ("user_id", 1)],
                "options": {"name": "org_user_progress_index"}
            },

            # User Activity
            {
                "collection": "user_activity",
                "index": [("organization_id", 1), ("user_id", 1), ("timestamp", -1)],
                "options": {"name": "org_user_activity_index"}
            },

            # Bookmarks
            {
                "collection": "bookmarks",
                "index": [("organization_id", 1), ("user_id", 1)],
                "options": {"name": "org_user_bookmarks_index"}
            },

            # Posts
            {
                "collection": "posts",
                "index": [("organization_id", 1), ("created_at", -1)],
                "options": {"name": "org_posts_index"}
            },

            # Events
            {
                "collection": "events",
                "index": [("organization_id", 1), ("start_time", 1)],
                "options": {"name": "org_events_index"}
            },

            # Resources
            {
                "collection": "resources",
                "index": [("organization_id", 1), ("category", 1)],
                "options": {"name": "org_resources_category_index"}
            },

            # Organizations
            {
                "collection": "organizations",
                "index": [("slug", 1)],
                "options": {"unique": True, "name": "slug_unique"}
            },
            {
                "collection": "organizations",
                "index": [("custom_domain", 1)],
                "options": {"sparse": True, "name": "custom_domain_index"}
            },
            {
                "collection": "organizations",
                "index": [("status", 1), ("plan", 1)],
                "options": {"name": "status_plan_index"}
            }
        ]

        for index_def in indexes:
            try:
                collection = self.db[index_def["collection"]]
                await collection.create_index(
                    index_def["index"],
                    **index_def["options"]
                )
                logger.info(f"✓ Created index: {index_def['options']['name']} on {index_def['collection']}")

            except Exception as e:
                logger.warning(f"Index already exists or error: {e}")

        logger.info("Index creation completed")

    async def verify_migration(self, organization_id: str):
        """Verify that migration was successful"""
        logger.info("Verifying migration...")

        verification_checks = [
            ("Users without org_id", "users", {"organization_id": {"$exists": False}}),
            ("User Progress without org_id", "user_progress", {"organization_id": {"$exists": False}}),
            ("Bookmarks without org_id", "bookmarks", {"organization_id": {"$exists": False}}),
            ("Posts without org_id", "posts", {"organization_id": {"$exists": False}}),
            ("Events without org_id", "events", {"organization_id": {"$exists": False}}),
            ("Resources without org_id", "resources", {"organization_id": {"$exists": False}}),
        ]

        all_good = True

        for check_name, collection, query in verification_checks:
            count = await self.db[collection].count_documents(query)

            if count > 0:
                logger.error(f"✗ FAILED: {count} documents in {collection} still without organization_id")
                all_good = False
            else:
                logger.info(f"✓ PASSED: All documents in {collection} have organization_id")

        # Check default organization exists
        org = await self.db.organizations.find_one({"organization_id": organization_id})

        if org:
            logger.info(f"✓ PASSED: Default organization exists")
        else:
            logger.error(f"✗ FAILED: Default organization not found")
            all_good = False

        if all_good:
            logger.info("✓ All verification checks passed!")
        else:
            logger.error("✗ Some verification checks failed. Please review the errors above.")

        return all_good

    async def run_migration(self):
        """Run the complete migration process"""
        logger.info("=" * 60)
        logger.info("Starting Multi-Tenant Migration")
        logger.info("=" * 60)

        try:
            # Step 1: Create backups
            await self.create_backup_collections()

            # Step 2: Create default organization
            organization_id = await self.create_default_organization()

            # Step 3: Migrate collections
            await self.migrate_users(organization_id)
            await self.migrate_user_progress(organization_id)
            await self.migrate_user_activity(organization_id)
            await self.migrate_bookmarks(organization_id)
            await self.migrate_posts(organization_id)
            await self.migrate_events(organization_id)
            await self.migrate_resources(organization_id)

            # Step 4: Create indexes
            await self.create_indexes()

            # Step 5: Verify migration
            success = await self.verify_migration(organization_id)

            if success:
                logger.info("=" * 60)
                logger.info("✓ MIGRATION COMPLETED SUCCESSFULLY")
                logger.info("=" * 60)
                logger.info(f"Default Organization ID: {organization_id}")
                logger.info("You can now restart the server with multi-tenancy enabled")
            else:
                logger.error("=" * 60)
                logger.error("✗ MIGRATION COMPLETED WITH ERRORS")
                logger.error("=" * 60)
                logger.error("Please review the errors above and fix manually")

            return success

        except Exception as e:
            logger.error(f"Migration failed: {e}")
            raise
        finally:
            self.client.close()


async def main():
    """Main entry point"""
    logger.warning("=" * 60)
    logger.warning("MULTI-TENANT MIGRATION")
    logger.warning("=" * 60)
    logger.warning("This will modify your database!")
    logger.warning("Make sure you have a backup before proceeding")
    logger.warning("")
    logger.warning(f"Database: {DB_NAME}")
    logger.warning(f"MongoDB URL: {MONGO_URL}")
    logger.warning("=" * 60)

    # Confirm migration
    response = input("\nDo you want to proceed? (type 'yes' to confirm): ")

    if response.lower() != 'yes':
        logger.info("Migration cancelled")
        return

    # Run migration
    migration = OrganizationMigration(MONGO_URL, DB_NAME)
    success = await migration.run_migration()

    if not success:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
