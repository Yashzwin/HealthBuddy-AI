import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, LogIn, LogOut, Menu, X, Sparkles, Crown, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ASSESSMENT_REQUIRED_MESSAGE, hasCompletedAssessment } from '@/lib/assessmentStatus';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const isLoggedIn = Boolean(currentUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Signed out: only Home + About
  // Signed in:  all pages (Home, Assessment, Dashboard, Habits, AI Coach, About)
  // Signed in as admin: adds Admin Dashboard tab
  const navItems = isLoggedIn
    ? [
        { path: '/', label: 'Home' },
        { path: '/assessment', label: 'Assessment' },
        { path: '/dashboard', label: 'Dashboard', requiresAssessment: true },
        { path: '/habits', label: 'Habits', requiresAssessment: true },
        { path: '/coach', label: 'AI Coach', requiresAssessment: true },
        { path: '/statistics', label: 'Statistics', requiresAssessment: true },
        { path: '/about', label: 'About' },
        ...(currentUser?.role === 'admin'
          ? [{ path: '/admin', label: 'Admin Dashboard', adminOnly: true }]
          : []),
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
      ];

  const displayName = currentUser?.role === 'guest'
    ? 'Guest User'
    : currentUser?.name || currentUser?.email || 'User';

  // Account summary shown in header:
  //  - admin:   email + "Admin" badge
  //  - user:    email (or name)
  //  - guest:   "Guest User"
  const accountSummary = (() => {
    if (!currentUser) return null;
    if (currentUser.role === 'admin') {
      return { primary: currentUser.email, secondary: 'Admin', tone: 'admin' };
    }
    if (currentUser.role === 'guest') {
      return { primary: 'Guest User', secondary: 'Signed in as guest', tone: 'guest' };
    }
    return { primary: currentUser.email, secondary: currentUser.name || 'Member', tone: 'user' };
  })();

  const accountInitial = currentUser?.email?.charAt(0)?.toUpperCase()
    || (currentUser?.role === 'guest' ? 'G' : 'U');

  const assessmentComplete = !isLoggedIn || currentUser?.role === 'admin' || hasCompletedAssessment(currentUser);

  const handleNavClick = (event, item) => {
    if (item.requiresAssessment && !assessmentComplete) {
      event.preventDefault();
      toast.error(ASSESSMENT_REQUIRED_MESSAGE);
      navigate('/assessment');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabClass = ({ isActive }, item) =>
    [
      'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
      isActive
        ? item?.adminOnly
          ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-glow'
          : 'bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow'
        : item?.adminOnly
        ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
        : 'text-foreground/70 hover:bg-muted hover:text-foreground',
    ].join(' ');

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-background/70 backdrop-blur-md',
      ].join(' ')}
    >
      <div className="container mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Heart className="h-5 w-5" fill="currentColor" />
            <span className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </span>
          <span className="hidden sm:inline">HealthBuddy <span className="text-gradient-primary">AI</span></span>
          <span className="sm:hidden">HealthBuddy</span>
        </Link>

        {/* Desktop / tablet nav tabs - visible on md+ */}
        <nav
          className="ml-2 hidden flex-1 items-center justify-center gap-1.5 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={(state) => tabClass(state, item)}
              onClick={(event) => handleNavClick(event, item)}
            >
              {item.adminOnly && <Shield className="h-3.5 w-3.5" />}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              {/* Account info pill — visible from sm+ (was lg+) */}
              <div
                className={[
                  'hidden items-center gap-2 rounded-full border border-border/60 bg-card/80 py-1 pl-1 pr-3 text-sm font-medium shadow-sm sm:flex',
                  accountSummary?.tone === 'admin' ? 'border-amber-300/60 bg-amber-50/80' : '',
                  accountSummary?.tone === 'guest' ? 'border-secondary/40 bg-secondary/5' : '',
                ].join(' ')}
                title={accountSummary?.primary}
              >
                <span
                  className={[
                    'grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-primary-foreground',
                    accountSummary?.tone === 'admin'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                      : accountSummary?.tone === 'guest'
                      ? 'bg-gradient-to-br from-secondary to-primary'
                      : 'bg-gradient-to-br from-primary to-secondary',
                  ].join(' ')}
                >
                  {accountSummary?.tone === 'admin' ? <Crown className="h-3.5 w-3.5" /> : accountInitial}
                </span>
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="max-w-[180px] truncate text-foreground">
                    {accountSummary?.primary}
                  </span>
                  {accountSummary?.tone === 'admin' && (
                    <span className="rounded-full bg-gradient-to-br from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Logout button — visible from sm+ (was lg+) */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-2 text-sm font-medium text-foreground/80 hover:text-destructive sm:inline-flex"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login + Get Started — visible from sm+ */}
              <Link to="/login" className="hidden sm:inline-flex">
                <Button size="sm" variant="ghost" className="gap-2 text-sm font-medium">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="hidden sm:inline-flex">
                <Button size="sm" className="btn-glow gap-2 px-4 text-sm font-semibold shadow-glow">
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {isLoggedIn && (
                <div
                  className={[
                    'mb-2 flex items-center gap-3 rounded-xl border p-3',
                    accountSummary?.tone === 'admin'
                      ? 'border-amber-300/60 bg-amber-50/80'
                      : accountSummary?.tone === 'guest'
                      ? 'border-secondary/40 bg-secondary/5'
                      : 'border-border/60 bg-muted/40',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-primary-foreground',
                      accountSummary?.tone === 'admin'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                        : accountSummary?.tone === 'guest'
                        ? 'bg-gradient-to-br from-secondary to-primary'
                        : 'bg-gradient-to-br from-primary to-secondary',
                    ].join(' ')}
                  >
                    {accountSummary?.tone === 'admin' ? <Crown className="h-4 w-4" /> : accountInitial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{accountSummary?.primary}</p>
                      {accountSummary?.tone === 'admin' && (
                        <span className="shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {accountSummary?.secondary}
                    </p>
                  </div>
                </div>
              )}
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? item.adminOnly
                          ? 'bg-gradient-to-br from-amber-500/15 to-orange-500/15 text-amber-700'
                          : 'bg-gradient-to-br from-primary/15 to-secondary/15 text-primary'
                        : item.adminOnly
                        ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                    ].join(' ')
                  }
                  onClick={(event) => handleNavClick(event, item)}
                >
                  {item.adminOnly && <Shield className="h-4 w-4" />}
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
                {isLoggedIn ? (
                  <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full gap-2">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <Button className="btn-glow w-full gap-2">
                        <Sparkles className="h-4 w-4" />
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
