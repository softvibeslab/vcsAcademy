import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login, checkAuth } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      const hash = window.location.hash;
      const sessionIdMatch = hash.match(/session_id=([^&]+)/);
      
      if (!sessionIdMatch) {
        navigate('/login');
        return;
      }

      const sessionId = sessionIdMatch[1];

      try {
        const response = await axios.post(
          `${API}/auth/session`,
          { session_id: sessionId },
          { withCredentials: true }
        );
        
        login(response.data);
        
        // Clear hash and navigate
        window.history.replaceState(null, '', window.location.pathname);
        navigate('/dashboard', { state: { user: response.data } });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    processSession();
  }, [navigate, login, checkAuth]);

  return (
    <div className="min-h-screen bg-[#020204] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#94A3B8]">Completing sign in...</p>
      </div>
    </div>
  );
}
