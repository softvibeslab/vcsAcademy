import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';

const AUTH_BG = "https://images.unsplash.com/photo-1758778689622-b756560264ef?w=1920";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, { name, email, password }, { withCredentials: true });
      login(response.data);

      // Store user data for onboarding
      sessionStorage.setItem('userData', JSON.stringify(response.data));

      toast.success('¡Cuenta creada exitosamente! 🎉', {
        description: 'Completa tu perfil para personalizar tu experiencia',
        duration: 3000
      });

      // Redirect to student onboarding instead of dashboard
      navigate('/onboarding/student', {
        state: {
          userData: response.data
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth - To be implemented with your own OAuth provider
    toast.info('Google OAuth coming soon!');
    // For now, use email/password registration
  };

  return (
    <div className="min-h-screen bg-[#020204] flex">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={AUTH_BG} alt="Resort" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#020204] to-transparent" />
        <div className="absolute inset-0 bg-[#020204]/40" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-serif text-3xl font-semibold leading-tight">
            "Join the elite community of vacation club professionals who are serious about success."
          </p>
          <p className="mt-4 text-[#D4AF37]">— VCSA Community</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 gradient-gold flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold leading-tight">Vacation Club</span>
              <span className="text-xs text-[#D4AF37] uppercase tracking-widest">Sales Academy</span>
            </div>
          </Link>

          <h1 className="font-serif text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-[#94A3B8] mb-8">Start your journey to becoming a top producer</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="pl-12 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#D4AF37]/50"
                  required
                  data-testid="register-name-input"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-12 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#D4AF37]/50"
                  required
                  data-testid="register-email-input"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="pl-12 pr-12 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#D4AF37]/50"
                  required
                  minLength={6}
                  data-testid="register-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider"
              disabled={loading}
              data-testid="register-submit-btn"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#020204] px-4 text-sm text-[#94A3B8]">or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline"
            className="w-full h-12 border-white/10 hover:border-[#D4AF37]/50 bg-transparent"
            onClick={handleGoogleLogin}
            data-testid="register-google-btn"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-[#94A3B8] mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D4AF37] hover:underline" data-testid="register-login-link">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
