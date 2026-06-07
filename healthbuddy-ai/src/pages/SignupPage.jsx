import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Heart, UserRound, Mail, Lock, User as UserIcon, ArrowRight,
  ShieldCheck, Sparkles, Check, Eye, EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DayNightLandscape from '@/components/DayNightLandscape';

const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0–4
};

const strengthLabel = (s) => ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][s] || 'Too weak';
const strengthColor = (s) =>
  ['bg-destructive', 'bg-destructive', 'bg-accent', 'bg-secondary', 'bg-primary'][s] || 'bg-destructive';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, guestLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuest = async () => {
    await guestLogin();
    toast.success('Continuing as Guest');
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = formData.email.trim();
    const trimmedName = formData.name.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(trimmedEmail, formData.password, formData.passwordConfirm, trimmedName);
      toast.success('Account created successfully');
      navigate('/assessment');
    } catch (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pwdScore = passwordStrength(formData.password);
  const perks = [
    'Personalized wellness plan',
    'Daily missions & streak tracking',
    'AI coach guidance',
    'No credit card required',
  ];

  return (
    <>
      <Helmet>
        <title>Sign Up - HealthBuddy AI</title>
        <meta name="description" content="Create your HealthBuddy AI account and start building healthy habits today." />
      </Helmet>
      <Header />

      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <DayNightLandscape variant="subtle" className="opacity-30" />
        <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="container relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
          {/* Form panel - on left for signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-border/60 bg-card/80 p-7 shadow-elevated backdrop-blur sm:p-9">
              <div className="mb-7 text-center">
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow">
                  <Heart className="h-6 w-6" fill="currentColor" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create your account</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Start your wellness journey in under a minute
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">Name <span className="text-muted-foreground">(optional)</span></Label>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Toggle password visibility"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex h-1.5 gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-full flex-1 rounded-full transition-colors ${
                              i < pwdScore ? strengthColor(pwdScore) : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Strength: <span className="font-medium text-foreground">{strengthLabel(pwdScore)}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="passwordConfirm" className="text-sm">Confirm password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="btn-glow h-11 w-full gap-2 text-base font-semibold shadow-glow">
                  {loading ? 'Creating account…' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                  By signing up, you agree to our terms and safety policy. HealthBuddy AI supports habits, not medical diagnosis.
                </p>
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

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Brand panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-primary p-10 text-primary-foreground shadow-glow-secondary xl:p-14">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </span>
                HealthBuddy AI
              </Link>

              <h2 className="mt-10 text-balance text-4xl font-bold leading-tight xl:text-5xl">
                Start your <span className="underline decoration-accent decoration-4 underline-offset-4">healthiest streak</span> today.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-lg opacity-90">
                Join thousands building simple, safe wellness routines that actually stick.
              </p>

              <ul className="mt-8 space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="opacity-95">{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur">
                <Sparkles className="h-5 w-5 shrink-0" />
                <p className="opacity-95">Free forever. No credit card. Cancel anytime.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignupPage;
