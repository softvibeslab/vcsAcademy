import { useState, useEffect, createContext, useContext, useRef, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationProvider } from "@/contexts/OrganizationContext";

// ============== SENTRY MONITORING ==============
try {
  const { initSentry } = require('./sentry');
  const sentryEnabled = initSentry();

  if (sentryEnabled) {
    console.info("Sentry error tracking enabled");
  } else {
    console.info("Sentry not configured - Running without error tracking");
  }
} catch (error) {
  console.error("Failed to initialize Sentry:", error);
}

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import CommunityPage from "@/pages/CommunityPage";
import EventsPage from "@/pages/EventsPage";
import CoachingPage from "@/pages/CoachingPage";
import MasterclassesPage from "@/pages/MasterclassesPage";
import ResourcesPage from "@/pages/ResourcesPage";
import MembershipPage from "@/pages/MembershipPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import AuthCallback from "@/pages/AuthCallback";
import ProposalPage from "@/pages/ProposalPage";
// Phase 1: Top Producer Development System
import TopProducerPath from "@/pages/TopProducerPath";
import TrackDetailPage from "@/pages/TrackDetailPage";
import DealBreakdownsPage from "@/pages/DealBreakdownsPage";
import QuickWinsPage from "@/pages/QuickWinsPage";
// Organization Management
import OnboardingWizard from "@/pages/OnboardingWizard";
import OrganizationSettings from "@/pages/OrganizationSettings";
// Create School Flow
import CreateSchoolPage from "@/pages/CreateSchoolPage";
import InterviewPage from "@/pages/InterviewPage";
import BrandingCustomizationPage from "@/pages/BrandingCustomizationPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Router
function AppRouter() {
  const location = useLocation();

  // Check URL fragment for session_id (sync check before routes)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/proposal" element={<ProposalPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      {/* Phase 1: Top Producer Development System */}
      <Route path="/path" element={<ProtectedRoute><TopProducerPath /></ProtectedRoute>} />
      <Route path="/path/track/:trackId" element={<ProtectedRoute><TrackDetailPage /></ProtectedRoute>} />
      <Route path="/path/breakdowns" element={<ProtectedRoute><DealBreakdownsPage /></ProtectedRoute>} />
      <Route path="/path/quickwins" element={<ProtectedRoute><QuickWinsPage /></ProtectedRoute>} />
      {/* Training Library (Legacy) */}
      <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
      <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/coaching" element={<ProtectedRoute><CoachingPage /></ProtectedRoute>} />
      <Route path="/masterclasses" element={<ProtectedRoute><MasterclassesPage /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
      <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      {/* Organization Management - Onboarding is public */}
      <Route path="/onboarding" element={<OnboardingWizard />} />
      <Route path="/onboarding/:orgId" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
      <Route path="/onboarding/create-school" element={<CreateSchoolPage />} />
      <Route path="/onboarding/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
      <Route path="/onboarding/branding" element={<ProtectedRoute><BrandingCustomizationPage /></ProtectedRoute>} />
      <Route path="/settings/organization" element={<ProtectedRoute><OrganizationSettings /></ProtectedRoute>} />
      <Route path="/settings/organization/:orgId" element={<ProtectedRoute><OrganizationSettings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <OrganizationProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </OrganizationProvider>
    </BrowserRouter>
  );
}

export default App;
