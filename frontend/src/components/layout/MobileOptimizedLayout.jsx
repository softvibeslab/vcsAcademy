import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Trophy, BookOpen, MessageCircle, User, Menu,
  X, Bell, Search, Plus, TrendingUp, Award, Settings,
  LogOut, ChevronRight, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

export const MobileOptimizedLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Touch gesture states
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      // Swiped left - close sidebar
      setSidebarOpen(false);
    }

    if (swipeDistance < -minSwipeDistance) {
      // Swiped right - open sidebar
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard',
      badge: null
    },
    {
      icon: Trophy,
      label: 'Development',
      path: '/development',
      badge: 'New'
    },
    {
      icon: BookOpen,
      label: 'Training',
      path: '/courses',
      badge: null
    },
    {
      icon: MessageCircle,
      label: 'AI Coach',
      path: '/dashboard?ai=open',
      badge: 'AI'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      badge: null
    }
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Trophy, label: 'Progress', path: '/development' },
    { icon: BookOpen, label: 'Learn', path: '/courses' },
    { icon: MessageCircle, label: 'AI', path: '/dashboard?ai=open' },
  ];

  const isActivePath = (path) => {
    if (path.includes('?')) {
      const [basePath] = path.split('?');
      return location.pathname === basePath;
    }
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex flex-col bg-[#020204] overflow-hidden">
      {/* Header - Mobile Optimized */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50"
      >
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-[#F1F5F9]" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B4942D] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#F1F5F9] leading-tight">VCSA</h1>
              <p className="text-[10px] text-[#94A3B8]">Sales Academy</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-[#94A3B8]" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#94A3B8]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full" />
          </button>

          {/* Quick Add */}
          <button
            onClick={() => navigate('/daily-performance')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Quick add"
          >
            <Plus className="w-5 h-5 text-[#D4AF37]" />
          </button>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden bg-gradient-to-t from-[#1E293B] to-[#0F172A] border-t border-white/10 px-2 py-2 flex items-center justify-around sticky bottom-0 z-50">
        {bottomNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-r border-white/10 z-50 lg:z-40"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B4942D] flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#F1F5F9]">VCSA</h2>
                    <p className="text-xs text-[#94A3B8]">Sales Academy</p>
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-[#94A3B8]" />
                </button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B4942D]/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#F1F5F9] truncate">{user?.name || 'User'}</h3>
                    <p className="text-xs text-[#94A3B8] truncate">{user?.email || ''}</p>
                  </div>
                  <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">
                    Level {user?.level || 1}
                  </Badge>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#B4942D]/10 text-[#D4AF37]'
                          : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-white/10 space-y-1">
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {notificationsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotificationsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-l border-white/10 z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#1E293B]/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#F1F5F9]">Notifications</h2>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#94A3B8]" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {/* Sample notifications */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#0F172A] border border-white/5 rounded-lg hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#F1F5F9] mb-1">New Training Available</h4>
                        <p className="text-sm text-[#94A3B8] mb-2">Advanced closing techniques module is ready for you to master.</p>
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <span>5 min ago</span>
                          <span>•</span>
                          <span className="text-[#D4AF37]">New</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-b border-white/10 z-50 px-4 py-4"
            >
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Search training, courses, tips..."
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]/50"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-5 h-5 text-[#94A3B8]" />
                  </button>
                </div>

                {/* Quick Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Quick Wins', 'Courses', 'AI Coach', 'Progress'].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="px-3 py-1.5 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#D4AF37]/30 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileOptimizedLayout;
