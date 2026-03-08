import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, Calendar, 
  Download, Crown, User, Settings, LogOut, 
  Trophy, Menu, X, Shield
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Training', path: '/courses' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Download, label: 'Resources', path: '/resources' },
  { icon: Crown, label: 'Membership', path: '/membership' },
];

export const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const levelColors = {
    1: 'bg-slate-500',
    2: 'bg-blue-500',
    3: 'bg-purple-500',
    4: 'bg-orange-500',
    5: 'bg-[#D4AF37]',
  };

  return (
    <div className="min-h-screen bg-[#020204]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-[#0A0A0B] border-r border-white/5">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-gold flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <span className="font-serif text-lg font-semibold">VCSA</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-4 glass rounded-sm">
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                <span className="font-medium">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", levelColors[user?.level || 1])} />
                <span className="text-xs text-[#94A3B8]">Level {user?.level || 1}</span>
              </div>
            </div>
          </div>
          {user?.membership === 'vip' && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#D4AF37]">
              <Crown className="w-3 h-3" />
              <span className="uppercase tracking-wider font-medium">VIP Member</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors",
                  isActive 
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]" 
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors",
                location.pathname === '/admin'
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]" 
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              )}
              data-testid="nav-admin"
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </Link>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors",
              location.pathname === '/profile'
                ? "bg-[#D4AF37]/10 text-[#D4AF37]" 
                : "text-[#94A3B8] hover:text-white hover:bg-white/5"
            )}
            data-testid="nav-profile"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-[#94A3B8] hover:text-white hover:bg-white/5 w-full transition-colors"
            data-testid="nav-logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-gold flex items-center justify-center">
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <span className="font-serif font-semibold">VCSA</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#020204] pt-16">
          <div className="p-4">
            {/* User Card */}
            <div className="glass p-4 rounded-sm mb-4">
              <div className="flex items-center gap-3">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                    <span className="font-medium">{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-[#94A3B8]">Level {user?.level || 1} • {user?.points || 0} pts</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors",
                      isActive ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "text-[#94A3B8]"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-sm text-[#94A3B8]"
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-sm text-[#94A3B8]"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-sm text-[#94A3B8] w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
