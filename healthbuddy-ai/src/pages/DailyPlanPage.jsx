import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Sun, Coffee, Utensils, Sunset, Moon, Target, Printer, Save, AlertTriangle, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DailyPlanPage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      const profiles = await pb.collection('user_profiles').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false,
      });

      if (profiles.length > 0) {
        const userProfile = profiles[0];
        setProfile(userProfile);
        
        const generatedPlan = generateDailyPlan(userProfile);
        setPlan(generatedPlan);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyPlan = (profile) => {
    const age = Number(profile.age || 0);
    const isChild = age < 13;
    const isTeen = age >= 13 && age < 18;
    const isOlderAdult = age >= 65;
    const hasCaregiver = profile.caregiverContext && profile.caregiverContext.length > 0;
    const water = Number(profile.dailyWaterIntake || 0);
    const screen = Number(profile.dailyScreenTime || 0);
    const sleep = Number(profile.dailySleepHours || 0);
    const sittingLoad = Number(profile.dailyStudyHours || 0) + Number(profile.dailyWorkSittingHours || 0);
    const posture = Number(profile.postureConcer || 0);
    const stress = Number(profile.stressLevel || 0);

    const wakeTime = isChild ? '7:00 AM' : isTeen ? '7:30 AM' : isOlderAdult ? '6:30 AM' : '7:00 AM';
    const bedTime = isChild ? '8:30 PM' : isTeen ? '10:00 PM' : isOlderAdult ? '9:30 PM' : '10:30 PM';

    const routineProblems = [];
    if (water < 6) routineProblems.push('low hydration');
    if (sittingLoad >= 4) routineProblems.push('long sitting blocks');
    if (screen >= 5) routineProblems.push('heavy screen load');
    if (sleep < 7) routineProblems.push('low sleep balance');
    if (posture >= 4) routineProblems.push('posture strain');
    if (stress >= 4) routineProblems.push('high stress load');

    const morningRoutine = `Wake up around ${wakeTime}. ${
      isOlderAdult 
        ? 'Begin with gentle stretching before standing, then drink water and move slowly into the day.'
        : isChild && hasCaregiver
        ? 'Caregiver helps with a calm morning routine, water, breakfast, and a short playful movement habit.'
        : 'Drink water, do a short stretch, and choose one simple mission before the day gets busy.'
    }`;

    const midDayRoutine = `${
      isOlderAdult
        ? 'Drink water with lunch, take a comfortable seated posture check, and rest if energy feels low.'
        : isChild
        ? 'Use breaks for water, movement, and outdoor play when safe. Keep screen sessions short and separated.'
        : 'Drink water every 2 hours, split long sitting into focused blocks, and take a 2-minute movement reset.'
    }`;

    const afternoonRoutine = `${
      isOlderAdult
        ? 'Choose gentle activity such as a comfortable walk, chair movement, or light household movement if appropriate.'
        : isTeen && Number(profile.dailyStudyHours || 0) > 2
        ? 'Use a study-rest rhythm: focus block, eye break, posture reset, then a short walk or stretch.'
        : isChild
        ? 'Add playful movement, fresh air, and water. Keep routines caregiver-guided and realistic.'
        : 'Protect one recovery break from screens and add a small movement habit after lunch or work.'
    }`;

    const eveningRoutine = `${
      isOlderAdult
        ? 'Keep dinner regular, reduce late screen load, and use a calm evening routine.'
        : isChild && hasCaregiver
        ? 'Use family dinner, low-screen calm time, and a repeated bedtime routine supported by a caregiver.'
        : 'Keep dinner consistent, lower screen intensity, and prepare for rest instead of stacking more tasks.'
    }`;

    const bedtimeRoutine = `${
      isOlderAdult
        ? `Prepare for bed around ${bedTime}. Use calm breathing, safe lighting, and a comfortable sleep environment.`
        : isChild
        ? `Aim for bedtime around ${bedTime}. Use quiet time, a story, or another predictable calm routine.`
        : `Aim for bed by ${bedTime}. Put away screens earlier and use one calming routine before sleep.`
    }`;

    const priorities = [];
    if (water < 6) priorities.push('Drink water 4 times before evening');
    if (profile.breakFrequency === 'rarely' || sittingLoad >= 4) priorities.push('Take 3 short movement breaks');
    if (screen > 5) priorities.push('Reduce continuous screen time with eye-rest breaks');
    if (posture >= 4) priorities.push('Practice 3 posture resets while sitting');
    if (stress >= 4) priorities.push('Add one calm breathing pause');
    if (profile.mealRegularity === 'irregular') priorities.push('Keep meals closer to regular times');
    if (sleep < 7) priorities.push('Start wind-down 30 minutes before sleep');

    const finalPriorities = (priorities.length ? priorities : [
      'Keep water within reach',
      'Take 3 short movement breaks',
      'Protect a consistent bedtime window',
    ]).slice(0, 3);

    const microHabits = [];
    if (water < 6) microHabits.push('Drink one glass after waking up');
    if (sittingLoad >= 4 || profile.breakFrequency !== 'regularly') microHabits.push('Stand or walk for 60 seconds after each long sitting block');
    if (screen >= 4) microHabits.push('Look away from the screen for 20 seconds between tasks');
    if (posture >= 3) microHabits.push('Relax shoulders and reset screen height once per hour');
    if (stress >= 3) microHabits.push('Take one slow breathing minute before the hardest task');

    return {
      morningRoutine,
      midDayRoutine,
      afternoonRoutine,
      eveningRoutine,
      bedtimeRoutine,
      topThreePriorities: finalPriorities.join(', '),
      routineProblem: routineProblems.length ? routineProblems.join(' + ') : 'routine is mostly balanced',
      rescuePlan: `${finalPriorities[0]}. ${finalPriorities[1]}. ${finalPriorities[2]}.`,
      microHabits: microHabits.length ? microHabits : ['Repeat your strongest habit tomorrow', 'Keep a water cue visible', 'Use one short recovery break'],
    };
  };

  const handleSavePlan = async () => {
    if (!plan) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const planData = {
        userId: currentUser.id,
        planDate: today,
        ...plan,
      };

      const existingPlans = await pb.collection('daily_plans').getFullList({
        filter: `userId = "${currentUser.id}" && planDate >= "${today}"`,
        $autoCancel: false,
      });

      if (existingPlans.length > 0) {
        await pb.collection('daily_plans').update(existingPlans[0].id, planData, { $autoCancel: false });
      } else {
        await pb.collection('daily_plans').create(planData, { $autoCancel: false });
      }

      toast.success('Daily plan saved');
    } catch (error) {
      toast.error('Failed to save plan');
    }
  };

  const handlePrintPlan = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-12 w-64" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile || !plan) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-muted-foreground">Complete your assessment to generate a daily plan.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const sections = [
    { icon: Sun, title: 'Morning Routine', content: plan.morningRoutine, color: 'text-yellow-500' },
    { icon: Coffee, title: 'Mid-Day', content: plan.midDayRoutine, color: 'text-orange-500' },
    { icon: Utensils, title: 'Afternoon', content: plan.afternoonRoutine, color: 'text-blue-500' },
    { icon: Sunset, title: 'Evening', content: plan.eveningRoutine, color: 'text-purple-500' },
    { icon: Moon, title: 'Bedtime', content: plan.bedtimeRoutine, color: 'text-indigo-500' },
  ];

  return (
    <>
      <Helmet>
        <title>Daily Plan - HealthBuddy AI</title>
        <meta name="description" content="Your personalized daily wellness plan with age-aware recommendations." />
      </Helmet>
      <Header />
      
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Daily Plan</h1>
              <p className="text-muted-foreground">
                Personalized for {profile.name || 'you'} - {profile.lifeStage || 'Age ' + profile.age}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSavePlan}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrintPlan}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          <Card className="mb-8 metric-card-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                HealthBuddy Daily Rescue Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl bg-background/70 p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  <p className="font-semibold">Your Routine Problem</p>
                </div>
                <p className="text-muted-foreground">{plan.routineProblem}</p>
              </div>
              <div className="rounded-xl bg-background/70 p-4 border">
                <p className="font-semibold mb-2">Your Safe Rescue Plan</p>
                <p className="text-muted-foreground">{plan.rescuePlan}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plan.microHabits.map((habit, index) => (
                  <div key={habit} className="rounded-xl bg-background/70 p-4 border">
                    <div className="text-sm text-muted-foreground mb-1">Micro habit {index + 1}</div>
                    <p className="font-medium">{habit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 metric-card-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Today's Top 3 Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.topThreePriorities.split(', ').map((priority, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <p className="text-lg pt-1">{priority}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.title} className="wellness-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DailyPlanPage;