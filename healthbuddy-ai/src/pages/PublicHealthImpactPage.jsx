import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CalendarCheck, Droplets, Eye, Globe, Heart, Moon, Sparkles, Target, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const challengeSteps = [
  {
    icon: Droplets,
    title: 'Hydration moments',
    text: 'Choose 3–5 normal parts of the day when a person can drink water, such as after waking up, lunch, and evening routine.',
  },
  {
    icon: Activity,
    title: 'Movement breaks',
    text: 'Add short, gentle movement breaks during long sitting or screen sessions instead of expecting a full workout.',
  },
  {
    icon: Eye,
    title: 'Screen recovery',
    text: 'Use simple eye-rest and posture resets to reduce continuous screen strain during school, work, gaming, or study time.',
  },
  {
    icon: Moon,
    title: 'Wind-down routine',
    text: 'Create a calm end-of-day routine that makes consistent sleep habits easier without being strict or unrealistic.',
  },
];

const useCases = [
  {
    label: 'Families',
    title: 'Caregiver-supported habits',
    text: 'Parents and caregivers can use the plan to build safe routines for children without turning wellness into pressure.',
  },
  {
    label: 'Schools',
    title: 'Classroom wellness breaks',
    text: 'Teachers or clubs can turn the daily missions into quick hydration, posture, and movement reminders for a class.',
  },
  {
    label: 'Workplaces',
    title: 'Desk routine support',
    text: 'Adults can reduce long sitting and screen fatigue with small routine changes that fit inside a normal workday.',
  },
  {
    label: 'Teams',
    title: 'Recovery-friendly habits',
    text: 'Athletes can use light recovery reminders, hydration prompts, and rest balance without unsafe training claims.',
  },
];

const PublicHealthImpactPage = () => {
  return (
    <>
      <Helmet>
        <title>Community Wellness - HealthBuddy AI</title>
        <meta
          name="description"
          content="HealthBuddy AI turns individual wellness routines into simple family, school, team, and community habit challenges."
        />
      </Helmet>
      <Header />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Community wellness</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ textWrap: 'balance' }}>
              Turn small habits into a healthier routine culture
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              HealthBuddy is designed for more than one-time advice. It helps people create simple, repeatable routines that can be used by individuals, families, classrooms, teams, and workplaces.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card className="metric-card-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="w-6 h-6 text-primary" />
                  Community Health Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The app can turn a personal routine plan into a 7-day family, class, team, or workplace challenge. The goal is not competition or pressure; the goal is making healthy actions easier to remember.
                </p>
                <div className="rounded-xl bg-background/70 border p-4">
                  <p className="font-semibold mb-2">7-Day Hydration + Movement Challenge</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Drink water at regular daily moments</li>
                    <li>• Take 3 short movement breaks</li>
                    <li>• Reset posture during long sitting</li>
                    <li>• Reduce long continuous screen sessions</li>
                    <li>• Keep one consistent wind-down habit</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-secondary" />
                  Why People Would Use It
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Most wellness apps give long advice lists. HealthBuddy turns a messy routine into a small daily mission, making the next action obvious.
                </p>
                <div className="grid gap-3">
                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="font-semibold">Fast</p>
                    <p className="text-sm text-muted-foreground">Build a safe plan in about 30 seconds without creating an account.</p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="font-semibold">Practical</p>
                    <p className="text-sm text-muted-foreground">Focuses on tiny habits, not overwhelming lifestyle changes.</p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="font-semibold">Safe</p>
                    <p className="text-sm text-muted-foreground">Avoids diagnosis, medication advice, and extreme fitness or diet claims.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">The habit areas HealthBuddy improves</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Instead of showing empty user counters, this section explains the real habit areas the product is built to support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {challengeSteps.map((item) => (
                <Card key={item.title} className="wellness-card h-full">
                  <CardContent className="p-6">
                    <item.icon className="w-9 h-9 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  From personal plan to shared routine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="font-semibold mb-1">1. Assess the routine</p>
                  <p className="text-sm text-muted-foreground">The user enters sleep, hydration, screen time, movement, sitting, and stress patterns.</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="font-semibold mb-1">2. Convert risk signals into missions</p>
                  <p className="text-sm text-muted-foreground">The app turns weak areas into 3 simple actions for today.</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="font-semibold mb-1">3. Repeat as a small group challenge</p>
                  <p className="text-sm text-muted-foreground">The same actions can be used by families, classes, teams, or workplaces.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="metric-card-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Public health value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Public health does not only mean hospitals and medical treatment. Many preventable wellness problems start with daily routines: sitting too long, not drinking enough water, ignoring posture, poor sleep consistency, and long screen sessions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  HealthBuddy focuses on safe, simple habits that can be repeated by many people. That makes it useful for everyday health awareness without pretending to diagnose or treat medical conditions.
                </p>
              </CardContent>
            </Card>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  What makes HealthBuddy different?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>HealthBuddy does not just give random health tips. It turns routines into daily missions that are easy to act on.</p>
                <p>It detects non-medical habit risks, gives micro habits instead of overwhelming plans, and tracks consistency with a strict streak system.</p>
                <p>The same mission system can be used by individuals, families, classrooms, teams, and community groups.</p>
              </CardContent>
            </Card>

            <Card className="metric-card-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-secondary" />
                  Built for public health impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>HealthBuddy supports public health by helping people build small daily habits around hydration, movement, posture, screen balance, rest, and consistency.</p>
                <p>It keeps the guidance safe by focusing on wellness routines, not diagnosis, medication, extreme diets, or unsafe training plans.</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-secondary" />
                Who can use the same idea?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {useCases.map((item) => (
                  <div key={item.title} className="rounded-xl border bg-background/70 p-5">
                    <Badge variant="outline" className="mb-3">{item.label}</Badge>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PublicHealthImpactPage;
