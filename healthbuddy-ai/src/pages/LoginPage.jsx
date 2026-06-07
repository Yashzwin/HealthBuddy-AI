import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Heart, UserRound, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DayNightLandscape from '@/components/DayNightLandscape';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      const isAdmin = result.record.role === 'admin';
      toast.success(isAdmin ? 'Admin dashboard unlocked' : 'Welcome back!');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    await guestLogin();
    toast.success('Continuing as Guest');
    navigate('/dashboard');
  };

  const benefits = [
    'Personalized wellness score',
    'Daily 3-action missions',
    'Streak tracking that works',
  ];

  return (
    <>
      <Helmet>
        <title>Login - HealthBuddy AI</title>
        <meta name="description" content="Login to HealthBuddy AI or continue as a guest to build a safe wellness routine." />
      </Helmet>
      <Header />

      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <DayNightLandscape variant="subtle" className="opacity-30" />
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

        <div className="container relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
          {/* Brand panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 text-primary-foreground shadow-glow xl:p-14">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </span>
                HealthBuddy AI
              </Link>

              <h2 className="mt-10 text-balance text-4xl font-bold leading-tight xl:text-5xl">
                Welcome back to your <span className="underline decoration-accent decoration-4 underline-offset-4">wellness journey</span>.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-lg opacity-90">
                Log in to continue tracking your routine, completing missions, and growing your streak.
              </p>

              <ul className="mt-8 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="opacity-95">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <p className="opacity-95">Your data is encrypted and never shared. You own your wellness journey.</p>
              </div>
            </div>
          </motion.div>

          {/* Form panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-border/60 bg-card/80 p-7 shadow-elevated backdrop-blur sm:p-9">
              <div className="mb-7 text-center">
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow">
                  <Heart className="h-6 w-6" fill="currentColor" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Login to continue your wellness routine
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <button type="button" className="text-xs font-medium text-primary hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10 pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="btn-glow h-11 w-full gap-2 text-base font-semibold shadow-glow">
                  {loading ? 'Logging in…' : 'Login'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button variant="outline" className="h-11 w-full gap-2" onClick={handleGuest}>
                <UserRound className="h-4 w-4 text-primary" />
                Continue as Guest
              </Button>

              <div className="mt-5 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>Guest access uses local browser storage. Real production access would require a secure backend.</span>
                </p>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;
