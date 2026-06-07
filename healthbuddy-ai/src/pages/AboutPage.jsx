import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Target, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import DayNightLandscape from '@/components/DayNightLandscape';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

const AboutPage = () => {
  const ageGroups = [
    { title: 'Children (Ages 1-12)', desc: 'Caregiver-guided routines that help children build healthy habits early. Focus on hydration, outdoor time, movement, and consistent sleep schedules.', icon: '🧒' },
    { title: 'Teens (Ages 13-17)', desc: 'Balance study demands with wellness. Screen time management, posture awareness during homework, movement breaks, and stress reduction techniques.', icon: '🧑' },
    { title: 'Young Adults & Adults (Ages 18-64)', desc: 'Workplace wellness, desk posture, regular breaks, hydration tracking, and work-life balance. Support for busy schedules and sedentary work environments.', icon: '💼' },
    { title: 'Older Adults (Ages 65+)', desc: 'Gentle routines, mobility-aware recommendations, consistent meal times, adequate hydration, and safe movement practices.', icon: '🧓' },
  ];

  const steps = [
    { n: '1', title: 'Complete Your Assessment', desc: 'Tell us about your age, daily habits, activity level, and wellness goals.' },
    { n: '2', title: 'View Your Wellness Dashboard', desc: 'See your overall wellness score and sub-scores for hydration, sleep, movement, and more.' },
    { n: '3', title: 'Get Your Daily Plan', desc: 'Receive personalized morning, mid-day, afternoon, evening, and bedtime recommendations.' },
    { n: '4', title: 'Track Your Habits', desc: 'Check off daily habits, monitor completion percentage, and build streaks.' },
    { n: '5', title: 'Ask Your AI Coach', desc: 'Get answers to wellness questions with safe, supportive guidance within clear boundaries.' },
  ];

  return (
    <>
      <Helmet>
        <title>About - HealthBuddy AI</title>
        <meta name="description" content="Learn about HealthBuddy AI and how we support wellness for all life stages." />
      </Helmet>
      <Header />

      <div className="relative min-h-screen overflow-hidden bg-background">
        <DayNightLandscape variant="subtle" />

        <div className="relative container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow"
            >
              <Heart className="h-10 w-10" fill="currentColor" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ textWrap: 'balance' }}>
              About HealthBuddy AI
            </h1>
            <p className="text-lg text-muted-foreground">
              Supporting wellness for ages 1–100
            </p>
          </motion.div>

          {/* What is HealthBuddy AI */}
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-10">
            <Card className="metric-card-primary overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold tracking-tight mb-4">What is HealthBuddy AI?</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    HealthBuddy AI is a wellness habit tracking and daily routine planning application designed to support healthy behaviors across all life stages. From young children to older adults, we provide age-aware recommendations that help build consistency in essential wellness habits.
                  </p>
                  <p>
                    Our platform focuses on foundational wellness practices: hydration, movement, posture awareness, sleep routines, screen time balance, and recovery breaks. These simple, evidence-based habits form the foundation of long-term health and well-being.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Who is it for */}
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/10 text-secondary">
                    <Users className="h-4 w-4" />
                  </span>
                  Who is it for?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ageGroups.map((group, i) => (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      whileHover={{ x: 4 }}
                      className="rounded-xl border border-border/60 p-4 transition-all hover:border-primary/30 hover:shadow-soft"
                    >
                      <h3 className="font-semibold mb-1 flex items-center gap-2">
                        <span className="text-xl">{group.icon}</span>
                        {group.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {group.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How it works */}
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-4 w-4" />
                  </span>
                  How it works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.n}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-sm"
                      >
                        {s.n}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold mb-1">{s.title}</h3>
                        <p className="text-sm text-muted-foreground">{s.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why it matters */}
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  Why it matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/60 p-4">
                  <h3 className="font-semibold mb-1">Public Health Impact</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Small daily habits, when practiced consistently across populations, reduce preventable health issues related to dehydration, sedentary behavior, poor posture, and irregular sleep.
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <h3 className="font-semibold mb-1">Habit Formation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Building healthy habits early in life creates a foundation for long-term wellness. When children learn to drink water regularly, take movement breaks, and maintain consistent sleep routines, these behaviors become automatic.
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <h3 className="font-semibold mb-1">Age-Aware Recommendations</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Wellness needs change across life stages. Children need more sleep than adults. Older adults benefit from gentler movement. Teens face unique screen time challenges. Our age-aware approach ensures recommendations are safe and appropriate.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Commitment */}
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Shield className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold tracking-tight">Our Commitment</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    HealthBuddy AI is committed to providing safe, evidence-based wellness guidance within clear boundaries. We do not provide medical diagnosis, prescribe medication, or replace healthcare professionals. Our focus is on supporting healthy daily habits that complement professional medical care.
                  </p>
                  <p>
                    We believe that wellness is accessible to everyone, regardless of age or life stage. By making habit tracking simple, personalized, and supportive, we help individuals and families build healthier routines that last.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Built with care for everyone, everywhere.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutPage;
