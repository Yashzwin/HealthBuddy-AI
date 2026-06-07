import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart, Droplets, Moon, Activity, Eye, Clock, TrendingUp,
  Sparkles, AlertTriangle, CheckCircle, ArrowRight, ShieldCheck,
  Zap, Users, Target, PlayCircle, BarChart3, Flame, Brain, Award
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DayNightLandscape from '@/components/DayNightLandscape';
import CalmConstellation from '@/components/CalmConstellation';

/* Animated counter that counts up when visible */
const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) { setCount(target); return; }

    let start = 0;
    const step = num / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{typeof count === 'number' ? count : target}{suffix}
    </span>
  );
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-60px' },
};

const HomePage = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: "Today's Health Mission",
      description: 'Three clear, doable actions generated from your routine — no overwhelm, just today\'s next step.',
      color: 'from-primary to-primary/70',
      bg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: AlertTriangle,
      title: 'Routine Risk Detector',
      description: 'Highlights habit risks like low hydration, long sitting, high screen load, or weak recovery breaks.',
      color: 'from-accent to-accent/70',
      bg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      icon: CheckCircle,
      title: 'Working Streak Tracker',
      description: 'Build consistency by completing daily habits and protecting an active streak that grows with you.',
      color: 'from-secondary to-secondary/70',
      bg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: Brain,
      title: 'AI Wellness Coach',
      description: 'Get personalized tips and guidance from an intelligent coach that adapts to your routine patterns.',
      color: 'from-purple-500 to-purple-500/70',
      bg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Statistics & Trends',
      description: 'Visualize your progress over time with beautiful charts, heatmaps, and weekly performance reports.',
      color: 'from-blue-500 to-blue-500/70',
      bg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Unlock badges for milestones like streaks, perfect weeks, and wellness scores to stay motivated.',
      color: 'from-amber-500 to-amber-500/70',
      bg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
    },
  ];

  const metrics = [
    { icon: Heart, label: 'Wellness Score', value: '0–100', color: 'text-primary', span: 'md:col-span-2', featured: true },
    { icon: TrendingUp, label: "Today's Focus", value: 'Personalized', color: 'text-secondary' },
    { icon: Droplets, label: 'Hydration Goal', value: '8+ cups', color: 'text-blue-500' },
    { icon: Activity, label: 'Movement Goal', value: '30+ min', color: 'text-accent' },
    { icon: Moon, label: 'Sleep Balance', value: 'Age-aware', color: 'text-purple-500' },
    { icon: Eye, label: 'Screen/Rest', value: 'Tracked', color: 'text-orange-500' },
    { icon: Clock, label: 'Routine Consistency', value: 'Daily', color: 'text-green-500' },
  ];

  const stats = [
    { value: '7', numericTarget: 7, label: 'Wellness pillars', icon: Target },
    { value: '100', numericTarget: 100, suffix: '%', label: 'Age-aware plans', icon: Users },
    { value: '3', numericTarget: 3, label: 'Daily missions', icon: Zap },
    { value: '100', numericTarget: 100, suffix: '%', label: 'Privacy first', icon: ShieldCheck },
  ];

  const steps = [
    { n: '01', title: 'Take the assessment', desc: 'A short, friendly questionnaire about your daily routine, age, and goals.' },
    { n: '02', title: 'Get your plan', desc: 'Receive a personalized wellness score, missions, and habit recommendations.' },
    { n: '03', title: 'Build your streak', desc: 'Track habits, finish the day, and grow a streak that makes consistency effortless.' },
  ];

  return (
    <>
      <Helmet>
        <title>HealthBuddy AI - Supporting wellness for ages 1–100</title>
        <meta name="description" content="Personalized wellness routines and healthy habit tracking for all life stages. Build better habits with age-aware recommendations." />
      </Helmet>
      <Header />

      <main>
        {/* ============= HERO ============= */}
        <section className="relative overflow-hidden">
          <DayNightLandscape variant="full" />
          <CalmConstellation className="opacity-40" color="primary" dotCount={25} />

          <div className="container relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-center lg:col-span-7 lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Badge variant="outline" className="pill pill-primary mb-6 inline-flex border-primary/30 px-3 py-1.5 text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI-powered habit coaching
                  </Badge>
                </motion.div>

                <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="block"
                  >
                    Wellness that
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="block text-gradient-brand animate-gradient-shift bg-[length:300%_300%]"
                  >
                    grows with you.
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl lg:mx-0"
                >
                  Turn everyday routines into simple, safe wellness missions. Take a short assessment, get three doable actions for today, detect routine risks, and build consistency with a working streak tracker.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
                >
                  <Link to={currentUser ? '/assessment' : '/signup'}>
                    <Button size="lg" className="btn-glow h-12 gap-2 rounded-full px-7 text-base font-semibold shadow-glow">
                      Build My Plan
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="ghost" className="h-12 gap-2 rounded-full px-6 text-base">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      How it works
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Privacy-first
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-accent" /> All life stages
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-secondary" /> Built on habit science
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative lg:col-span-5"
              >
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 blur-2xl" />

                  <Card className="metric-card-primary relative overflow-hidden p-0">
                    <CardContent className="p-7">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow">
                          <Target className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Your wellness journey</p>
                          <p className="text-xs text-muted-foreground">Starts with a short assessment</p>
                        </div>
                      </div>

                      <ol className="space-y-3">
                        {[
                          { icon: Sparkles, label: 'Take a 2-minute assessment', color: 'text-primary' },
                          { icon: Zap, label: 'Get 3 daily missions', color: 'text-accent' },
                          { icon: TrendingUp, label: 'Build your streak', color: 'text-secondary' },
                        ].map((step, i) => (
                          <motion.li
                            key={step.label}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-3"
                          >
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-foreground">
                              {i + 1}
                            </span>
                            <step.icon className={`h-4 w-4 ${step.color}`} />
                            <span className="text-sm font-medium">{step.label}</span>
                          </motion.li>
                        ))}
                      </ol>

                      <div className="mt-6 rounded-xl border border-primary/20 bg-card/70 p-3 text-center">
                        <p className="text-xs text-muted-foreground">No score without an assessment — your plan is personal to you.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Floating icons around the card */}
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -right-6 -top-6 hidden md:block"
                  >
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-card shadow-elevated">
                      <Droplets className="h-7 w-7 text-blue-500" />
                    </div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -bottom-4 -left-6 hidden md:block"
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-card shadow-elevated">
                      <Moon className="h-6 w-6 text-purple-500" />
                    </div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -bottom-6 -right-4 hidden md:block"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card shadow-elevated">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Stats strip with animated counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group rounded-2xl border border-border/60 bg-card/70 p-5 text-center backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-soft"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <s.icon className="mx-auto mb-2 h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  </motion.div>
                  <div className="text-2xl font-bold tracking-tight md:text-3xl">
                    <AnimatedCounter target={s.value} suffix={s.suffix || ''} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============= FEATURE PILLARS ============= */}
        <section className="section-padding relative overflow-hidden">
          <CalmConstellation className="opacity-15" color="secondary" dotCount={20} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto mb-14 max-w-2xl text-center">
              <Badge variant="outline" className="pill pill-secondary mb-4 border-secondary/30">
                <Sparkles className="h-3.5 w-3.5" /> Why HealthBuddy
              </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Everything you need to build healthier habits
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Six powerful features designed with behavioral science to help you start small, stay consistent, and feel the difference.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="wellness-card h-full">
                    <CardContent className="p-7">
                      <motion.div
                        className={`mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl ${f.bg} ${f.iconColor}`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <f.icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="mb-2 text-xl font-semibold tracking-tight">{f.title}</h3>
                      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                        {f.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= LIVE PREVIEW ============= */}
        <section className="section-padding relative overflow-hidden">
          <CalmConstellation className="opacity-20" color="secondary" dotCount={18} />
          <div className="absolute inset-0 bg-muted/30" />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto mb-12 max-w-2xl text-center">
              <Badge variant="outline" className="pill pill-primary mb-4 border-primary/30">
                <Activity className="h-3.5 w-3.5" /> Live Preview
              </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                See it in action
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A glimpse of what your personalized dashboard looks like.
              </p>
            </motion.div>

            {/* Fake dashboard preview */}
            <motion.div {...scaleIn} transition={{ duration: 0.6 }}>
              <div className="relative mx-auto max-w-4xl">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 blur-2xl" />
                <div className="overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8">
                  {/* Mini header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        <Heart className="h-4 w-4" fill="currentColor" />
                      </div>
                      <span className="text-sm font-semibold">HealthBuddy AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>
                  </div>

                  {/* Score ring + metrics */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="flex flex-col items-center">
                      <div className="relative h-28 w-28">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                          <motion.circle
                            cx="50" cy="50" r="42"
                            stroke="hsl(var(--primary))"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="263.89"
                            initial={{ strokeDashoffset: 263.89 }}
                            whileInView={{ strokeDashoffset: 263.89 - (72 / 100) * 263.89 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span
                            className="text-2xl font-bold"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1 }}
                          >
                            72
                          </motion.span>
                          <span className="text-[9px] text-muted-foreground">Wellness</span>
                        </div>
                      </div>
                      <span className="mt-2 text-xs font-medium text-primary">Good</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: 'Hydration', value: 78, color: 'bg-blue-500' },
                        { label: 'Sleep', value: 65, color: 'bg-purple-500' },
                        { label: 'Movement', value: 72, color: 'bg-primary' },
                      ].map((m) => (
                        <div key={m.label}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span>{m.label}</span>
                            <span className="font-medium">{m.value}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className={`h-full rounded-full ${m.color}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${m.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: 'Recovery', value: 58, color: 'bg-green-500' },
                        { label: 'Focus', value: 70, color: 'bg-secondary' },
                        { label: 'Routine', value: 82, color: 'bg-orange-500' },
                      ].map((m) => (
                        <div key={m.label}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span>{m.label}</span>
                            <span className="font-medium">{m.value}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className={`h-full rounded-full ${m.color}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${m.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini progress chart — smooth line preview */}
                  <div className="mt-6">
                    <svg viewBox="0 0 320 70" className="w-full" style={{ height: 70 }}>
                      <defs>
                        <linearGradient id="previewLineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" />
                        </linearGradient>
                        <linearGradient id="previewAreaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Smooth catmull-rom path for demo data */}
                      <motion.path
                        d="M 0,48 C 24,48 36,32 53,28 C 70,24 80,36 106,34 C 132,32 144,18 160,16 C 176,14 192,24 213,22 C 234,20 248,10 266,12 C 284,14 304,8 320,10"
                        fill="none"
                        stroke="url(#previewLineGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.5 }}
                      />
                      {/* Area fill */}
                      <motion.path
                        d="M 0,48 C 24,48 36,32 53,28 C 70,24 80,36 106,34 C 132,32 144,18 160,16 C 176,14 192,24 213,22 C 234,20 248,10 266,12 C 284,14 304,8 320,10 L 320,70 L 0,70 Z"
                        fill="url(#previewAreaFill)"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 1.2 }}
                      />
                      {/* Dots */}
                      {[0, 53, 106, 160, 213, 266, 320].map((x, i) => (
                        <motion.circle
                          key={i}
                          cx={x}
                          cy={[48, 28, 34, 16, 22, 12, 10][i]}
                          r="3"
                          fill="white"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + i * 0.1, duration: 0.4, type: 'spring' }}
                        />
                      ))}
                    </svg>
                    <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============= METRICS ============= */}
        <section className="section-padding relative overflow-hidden">
          <CalmConstellation className="opacity-10" color="warm" dotCount={12} />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto mb-12 max-w-2xl text-center">
              <Badge variant="outline" className="pill pill-accent mb-4 border-accent/30">
                <TrendingUp className="h-3.5 w-3.5" /> What we track
              </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Track what matters
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Monitor key wellness metrics tailored to your age and lifestyle.
              </p>
            </motion.div>

            <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-3">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={metric.span || ''}
                >
                  <Card className={`wellness-card h-full ${index === 0 ? 'metric-card-primary' : ''}`}>
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="flex items-start gap-4">
                        <motion.span
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted ${metric.color}`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <metric.icon className="h-5 w-5" />
                        </motion.span>
                        <div>
                          <h3 className="text-base font-semibold">{metric.label}</h3>
                          <p className="mt-1 text-2xl font-bold tracking-tight">{metric.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= HOW IT WORKS ============= */}
        <section className="section-padding relative overflow-hidden">
          <CalmConstellation className="opacity-15" color="accent" dotCount={15} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto mb-12 max-w-2xl text-center">
              <Badge variant="outline" className="pill pill-accent mb-4 border-accent/30">
                <Target className="h-3.5 w-3.5" /> How it works
              </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                From signup to streak in minutes
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="relative"
                >
                  <div className="rounded-2xl border border-border/60 bg-card p-7 transition-all hover:border-primary/30 hover:shadow-soft">
                    <motion.div
                      className="mb-4 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 px-3 text-sm font-bold text-primary"
                      whileHover={{ scale: 1.1 }}
                    >
                      Step {s.n}
                    </motion.div>
                    <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                    >
                      <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-primary/40 md:block" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= SAFETY ============= */}
        <section className="section-padding relative overflow-hidden">
          <CalmConstellation className="opacity-10" color="primary" dotCount={10} />
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div {...scaleIn} transition={{ duration: 0.5 }}>
              <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5 p-0">
                <CardContent className="p-8 md:p-10">
                  <div className="mb-5 flex justify-center">
                    <motion.span
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"
                      whileHover={{ rotate: 10 }}
                    >
                      <ShieldCheck className="h-6 w-6" />
                    </motion.span>
                  </div>
                  <h3 className="text-balance text-center text-2xl font-semibold tracking-tight">
                    Important Safety Notice
                  </h3>
                  <p className="mt-3 text-pretty text-center leading-relaxed text-muted-foreground">
                    HealthBuddy AI supports healthy habits and daily routines. This app does not provide medical diagnosis, prescribe medication, or replace healthcare professionals. For medical concerns, breathing issues, chest pain, or severe distress, always consult qualified healthcare providers immediately.
                  </p>
                  <div className="mt-7 flex justify-center">
                    <Link to="/safety">
                      <Button variant="outline" className="rounded-full px-6">
                        Read Full Safety Policy
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ============= CTA ============= */}
        <section className="relative overflow-hidden pb-20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 text-center text-primary-foreground shadow-glow md:p-16"
            >
              {/* Animated CTA background orbs */}
              <motion.div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1], x: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                animate={{ scale: [1, 1.15, 1], y: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />

              <h2 className="relative text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Ready to feel the difference?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-pretty text-base opacity-90 md:text-lg">
                Start your free wellness plan in under 60 seconds. No credit card required.
              </p>
              <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to={currentUser ? '/assessment' : '/signup'}>
                  <Button size="lg" variant="secondary" className="btn-glow h-12 gap-2 rounded-full px-7 text-base font-semibold">
                    Build My Plan
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="ghost" className="h-12 rounded-full px-6 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                    Learn more
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
