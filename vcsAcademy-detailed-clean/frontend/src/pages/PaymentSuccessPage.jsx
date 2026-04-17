import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      navigate('/membership');
      return;
    }

    const pollPaymentStatus = async (attempts = 0) => {
      const maxAttempts = 10;
      const pollInterval = 2000;

      if (attempts >= maxAttempts) {
        setStatus('timeout');
        return;
      }

      try {
        const response = await axios.get(
          `${API}/payments/status/${sessionId}`,
          { withCredentials: true }
        );

        if (response.data.payment_status === 'paid') {
          setStatus('success');
          setPaymentData(response.data);
          await refreshUser();
          return;
        } else if (response.data.status === 'expired') {
          setStatus('expired');
          return;
        }

        // Continue polling
        setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
      } catch (error) {
        console.error('Payment status error:', error);
        setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
      }
    };

    pollPaymentStatus();
  }, [searchParams, navigate, refreshUser]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-lg">Processing your payment...</p>
          <p className="text-sm text-[#94A3B8] mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (status === 'expired' || status === 'timeout') {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center p-6">
        <div className="glass p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">!</span>
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Payment Issue</h1>
          <p className="text-[#94A3B8] mb-6">
            There was an issue processing your payment. Please try again or contact support.
          </p>
          <Button 
            onClick={() => navigate('/membership')}
            className="bg-[#D4AF37] text-black hover:bg-[#B4942D]"
          >
            Return to Membership
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020204] flex items-center justify-center p-6" data-testid="payment-success-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 text-center max-w-lg relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 gradient-gold" />
        <div className="absolute inset-0 vip-glow" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="relative"
        >
          <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          
          <h1 className="font-serif text-3xl font-bold mb-2">Welcome to VIP!</h1>
          <p className="text-[#94A3B8] text-lg mb-8">
            Your payment was successful. You now have full access to all premium content.
          </p>

          {paymentData && (
            <div className="glass p-4 mb-8 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-[#94A3B8]">Amount</span>
                <span className="font-mono">${paymentData.amount} {paymentData.currency?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Status</span>
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Paid
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="glass p-4 flex items-center gap-4">
              <Crown className="w-8 h-8 text-[#D4AF37]" />
              <div className="text-left">
                <p className="font-medium">VIP Badge Activated</p>
                <p className="text-sm text-[#94A3B8]">Your profile now shows VIP status</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full mt-8 bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider h-12"
            data-testid="go-to-dashboard"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
