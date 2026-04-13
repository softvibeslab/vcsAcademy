import { useState, useEffect, createContext, useContext, useRef, useCallback } from "react";
import "@/App.css";
// VCSA V2 Design System
import "@/v2/styles/tokens.css";
import "@/v2/styles/typography.css";
import "@/v2/styles/animations.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { RoleGuard } from "@/components/auth/RoleGuard";

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
import CoachingPage from "@/pages/CoachingPage";
import MasterclassesPage from "@/pages/MasterclassesPage";
import TrainingLibraryPage from "@/pages/TrainingLibraryPage";
import ResourcesPage from "@/pages/ResourcesPage";
import MembershipPage from "@/pages/MembershipPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import AdminSimplePage from "@/pages/AdminSimplePage";
import AuthCallback from "@/pages/AuthCallback";
import ProposalPage from "@/pages/ProposalPage";
import MockupDashboardPage from "@/pages/MockupDashboardPage";
// Phase 1: Top Producer Development System
import TopProducerPath from "@/pages/TopProducerPath";
import TrackDetailPage from "@/pages/TrackDetailPage";
import DealBreakdownsPage from "@/pages/DealBreakdownsPage";
import QuickWinsPage from "@/pages/QuickWinsPage";
// Goal Sheets
import GoalSheetPage from "@/pages/GoalSheetPage";
// Financial Planning
import FinancialPlanningPage from "@/pages/FinancialPlanningPage";
import DailyPerformancePage from "@/pages/DailyPerformancePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import StrategyPlanningPage from "@/pages/StrategyPlanningPage";
// Dashboard Sub-pages (MVP Lite)
import StrategyPage from "@/pages/dashboard/StrategyPage";
import PerformancePage from "@/pages/dashboard/DailyPerformancePage";
// Training (MVP Lite)
import SessionDetailPage from "@/pages/training/SessionDetailPage";
// Coaching (MVP Lite)
import EventsPage from "@/pages/coaching/EventsPage";
import GroupCoachingPage from "@/pages/coaching/GroupCoachingPage";
import RoleplayPage from "@/pages/coaching/RoleplayPage";
import QASessionsPage from "@/pages/coaching/QASessionsPage";
// Organization Management
import OnboardingWizard from "@/pages/OnboardingWizard";
import OrganizationSettings from "@/pages/OrganizationSettings";
// Create School Flow
import CreateSchoolPage from "@/pages/CreateSchoolPage";
// Manager Dashboard
import ManagerDashboardPage from "@/pages/ManagerDashboardPage";
// Director Dashboard
import DirectorDashboardPage from "@/pages/DirectorDashboardPage";

// Role hierarchy for permission checks (higher = more permissions)
const ROLE_HIERARCHY = {
  rep: 1,
  manager: 2,
  director: 3,
  org_admin: 4,
  admin: 5,
};

const hasRolePermission = (userRole, requiredRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};
import InterviewPage from "@/pages/InterviewPage";
import GeneratePage from "@/pages/GeneratePage";
import ReviewPage from "@/pages/ReviewPage";
import SchoolDashboardPage from "@/pages/SchoolDashboardPage";
import CoursesManagePage from "@/pages/CoursesManagePage";
import LessonEditorPage from "@/pages/LessonEditorPage";
import ContentUploadPage from "@/pages/ContentUploadPage";
import CommunityFeedPage from "@/pages/CommunityFeedPage";
import VideoCreatorPage from "@/pages/VideoCreatorPage";
import BrandingCustomizationPage from "@/pages/BrandingCustomizationPage";
import BrandingConfigPage from "@/pages/BrandingConfigPage";
// Student Onboarding
import StudentOnboardingPage from "@/pages/StudentOnboardingPage";
// VCSA User Onboarding
import OnboardingPage from "@/pages/OnboardingPage";
// Navigation Dashboard
import NavigationDashboard from "@/pages/NavigationDashboard";
// VCSA V2 Pages
import Dashboard from "@/v2/pages/Dashboard";
import TrainingLibrary from "@/v2/pages/TrainingLibrary";
import TrainingSessionView from "@/v2/pages/TrainingSessionView";
import CoachingHub from "@/v2/pages/CoachingHub";
import ResourcesLibrary from "@/v2/pages/ResourcesLibrary";
import FinancialPlanner from "@/v2/pages/FinancialPlanner";
import AnalyticsDashboard from "@/v2/pages/AnalyticsDashboard";
import PreTourMode from "@/v2/pages/PreTourMode";
import PostTourDebrief from "@/v2/pages/PostTourDebrief";
import AICoachChat from "@/v2/pages/AICoachChat";

// Use environment variable for backend URL
// Falls back to localhost:2345 for local development
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:2345';
export const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = createContext(null);

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
      // Don't set mock user - require real authentication
      console.log('No authenticated user found');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check authentication on mount
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
const ProtectedRoute = ({ children, adminOnly = false, requiredRole = null, allowedRoles = null }) => {
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

  // Check if user has completed onboarding (skip for onboarding pages themselves)
  const onboardingCompleted = localStorage.getItem('vcsa_onboarding_completed');
  const onboardingPages = ['/get-started', '/onboarding/user'];
  const isOnboardingPage = onboardingPages.some(path => location.pathname.startsWith(path));

  if (!onboardingCompleted && !isOnboardingPage) {
    // Redirect to onboarding for first-time users
    return <Navigate to="/get-started" replace />;
  }

  // Legacy adminOnly support
  if (adminOnly && !hasRolePermission(user.role, "admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  // New role-based access control
  if (requiredRole && !hasRolePermission(user.role, requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Multiple roles support
  if (allowedRoles && !allowedRoles.some(role => hasRolePermission(user.role, role))) {
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
      {/* Navigation Dashboard - No authentication required */}
      <Route path="/nav" element={<NavigationDashboard />} />
      <Route path="/library" element={<NavigationDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/proposal" element={<ProposalPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      {/* Mockup Dashboard with Onboarding */}
      <Route path="/mockup" element={<MockupDashboardPage />} />
      {/* Dashboard Sub-pages (MVP Lite) */}
      <Route path="/dashboard/strategy" element={<ProtectedRoute><StrategyPage /></ProtectedRoute>} />
      <Route path="/dashboard/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
      {/* Phase 1: Top Producer Development System */}
      <Route path="/path" element={<ProtectedRoute><TopProducerPath /></ProtectedRoute>} />
      <Route path="/path/track/:trackId" element={<ProtectedRoute><TrackDetailPage /></ProtectedRoute>} />
      <Route path="/path/breakdowns" element={<ProtectedRoute><DealBreakdownsPage /></ProtectedRoute>} />
      <Route path="/path/quickwins" element={<ProtectedRoute><QuickWinsPage /></ProtectedRoute>} />
      {/* Goal Sheets */}
      <Route path="/goals" element={<ProtectedRoute><GoalSheetPage /></ProtectedRoute>} />
      {/* Financial Planning */}
      <Route path="/financial" element={<ProtectedRoute><FinancialPlanningPage /></ProtectedRoute>} />
      {/* Daily Performance */}
      <Route path="/daily-performance" element={<ProtectedRoute><DailyPerformancePage /></ProtectedRoute>} />
      {/* Analytics */}
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      {/* Strategy Planning */}
      <Route path="/strategy" element={<ProtectedRoute><StrategyPlanningPage /></ProtectedRoute>} />
      {/* Training Library (Legacy) */}
      <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
      <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/coaching" element={<ProtectedRoute><CoachingPage /></ProtectedRoute>} />
      {/* Coaching Sub-pages (MVP Lite) */}
      <Route path="/coaching/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/coaching/group" element={<ProtectedRoute><GroupCoachingPage /></ProtectedRoute>} />
      <Route path="/coaching/roleplay" element={<ProtectedRoute><RoleplayPage /></ProtectedRoute>} />
      <Route path="/coaching/qa" element={<ProtectedRoute><QASessionsPage /></ProtectedRoute>} />
      {/* Training (MVP Lite) */}
      <Route path="/training" element={<ProtectedRoute><TrainingLibraryPage /></ProtectedRoute>} />
      <Route path="/training/session/:sessionId" element={<ProtectedRoute><SessionDetailPage /></ProtectedRoute>} />
      <Route path="/training-library" element={<ProtectedRoute><TrainingLibraryPage /></ProtectedRoute>} />
      <Route path="/masterclasses" element={<ProtectedRoute><MasterclassesPage /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
      <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminSimplePage />} />
      <Route path="/admin/enhanced" element={<AdminSimplePage />} />
      {/* Manager Dashboard - Manager role required */}
      <Route path="/manager" element={<ProtectedRoute requiredRole="manager"><ManagerDashboardPage /></ProtectedRoute>} />
      {/* Director Dashboard - Director role required */}
      <Route path="/director/dashboard" element={<ProtectedRoute allowedRoles={["director", "admin"]}><DirectorDashboardPage /></ProtectedRoute>} />
      {/* Organization Management - Onboarding is public */}
      <Route path="/onboarding" element={<OnboardingWizard />} />
      <Route path="/onboarding/:orgId" element={<OnboardingWizard />} />
      <Route path="/onboarding/student" element={<StudentOnboardingPage />} />
      {/* VCSA User Onboarding */}
      <Route path="/get-started" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/onboarding/user" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/onboarding/create-school" element={<CreateSchoolPage />} />
      <Route path="/onboarding/interview" element={<InterviewPage />} />
      <Route path="/onboarding/generate" element={<GeneratePage />} />
      <Route path="/onboarding/review" element={<ReviewPage />} />
      <Route path="/onboarding/branding" element={<BrandingCustomizationPage />} />
      <Route path="/admin/branding" element={<BrandingConfigPage />} />
      {/* School Dashboard */}
      <Route path="/dashboard/:schoolId" element={<SchoolDashboardPage />} />
      <Route path="/dashboard" element={<SchoolDashboardPage />} />
      {/* CMS - Courses Management */}
      <Route path="/courses/manage" element={<CoursesManagePage />} />
      <Route path="/courses/:courseId/edit" element={<CoursesManagePage />} />
      <Route path="/lessons/:lessonId/edit" element={<LessonEditorPage />} />
      <Route path="/lessons/:lessonId/video-creator" element={<VideoCreatorPage />} />
      <Route path="/lessons/new/edit" element={<LessonEditorPage />} />
      {/* AI Content Creation */}
      <Route path="/content/upload" element={<ContentUploadPage />} />
      {/* Community */}
      <Route path="/community/feed" element={<CommunityFeedPage />} />
      <Route path="/community" element={<CommunityFeedPage />} />
      <Route path="/settings/organization" element={<OrganizationSettings />} />
      <Route path="/settings/organization/:orgId" element={<ProtectedRoute><OrganizationSettings /></ProtectedRoute>} />
      {/* VCSA V2 Routes - New Design System */}
      <Route path="/v2/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/v2/training" element={<ProtectedRoute><TrainingLibrary /></ProtectedRoute>} />
      <Route path="/v2/training/session/:sessionId" element={<ProtectedRoute><TrainingSessionView /></ProtectedRoute>} />
      <Route path="/v2/training/track/:trackId" element={<ProtectedRoute><TrainingLibrary /></ProtectedRoute>} />
      <Route path="/v2/coaching" element={<ProtectedRoute><CoachingHub /></ProtectedRoute>} />
      <Route path="/v2/resources" element={<ProtectedRoute><ResourcesLibrary /></ProtectedRoute>} />
      <Route path="/v2/financial" element={<ProtectedRoute><FinancialPlanner /></ProtectedRoute>} />
      <Route path="/v2/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
      <Route path="/v2/pre-tour" element={<ProtectedRoute><PreTourMode /></ProtectedRoute>} />
      <Route path="/v2/debrief" element={<ProtectedRoute><PostTourDebrief /></ProtectedRoute>} />
      <Route path="/v2/ai-coach" element={<ProtectedRoute><AICoachChat /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <OrganizationProvider>
        <BrandingProvider>
          <AuthProvider>
            <RoleProvider>
              <AppRouter />
              <Toaster position="bottom-right" richColors />
            </RoleProvider>
          </AuthProvider>
        </BrandingProvider>
      </OrganizationProvider>
    </BrowserRouter>
  );
}

export default App;
