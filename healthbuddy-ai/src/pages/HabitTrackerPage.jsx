import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Flame, RotateCcw, CalendarDays, Trophy, CheckCircle2, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUnlockedAchievements } from '@/lib/achievements';
import { motion } from 'framer-motion';

const habits = [
  { id: 'drankWaterRegularly', label: 'Drank water regularly' },
  { id: 'tookStretchBreaks', label: 'Took stretch breaks' },
  { id: 'correctedPosture', label: 'Corrected posture' },
  { id: 'reducedScreenSessions', label: 'Reduced long screen sessions' },
  { id: 'movedWalked', label: 'Moved/walked' },
  { id: 'followedSleepRoutine', label: 'Followed sleep routine' },
  { id: 'tookRestBreaks', label: 'Took rest breaks' },
  { id: 'didLightActivity', label: 'Did a light activity' },
  { id: 'spentTimeOutdoors', label: 'Spent time outdoors' },
  { id: 'practicedCalmBreathing', label: 'Practiced calm breathing' },
  { id: 'followedCaregiverGoals', label: 'Followed family/caregiver routine goals' },
];

const localDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const shiftDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateString(date);
};

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const emptyHabitData = () => {
  const data = {};
  habits.forEach((habit) => {
    data[habit.id] = false;
  });
  return data;
};

const HabitTrackerPage = () => {
  const { currentUser } = useAuth();
  const [habitData, setHabitData] = useState(emptyHabitData());
  const [streak, setStreak] = useState(0);
  const [lastCountedDate, setLastCountedDate] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('Complete all habits, then finish the day to update your streak.');

  const userId = currentUser?.id || 'guest-user';
  const habitsKey = `healthbuddy_today_habits_${userId}`;
  const streakKey = `healthbuddy_streak_state_${userId}`;

  const buildHistory = (records) => {
    return Array.from({ length: 7 }).map((_, index) => {
      const offset = index - 6;
      const date = shiftDate(offset);
      const record = records.find((item) => item.userId === userId && item.habitDate === date);
      return {
        date,
        label: offset === 0 ? 'Today' : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' }),
        completion: record?.completionPercentage || 0,
        completed: Boolean(record?.allCompleted),
      };
    });
  };

  useEffect(() => {
    const today = localDateString();
    const storedHabits = readJson(habitsKey, { date: today, data: emptyHabitData() });
    setHabitData(storedHabits.date === today ? storedHabits.data : emptyHabitData());

    const streakState = readJson(streakKey, { streak: 0, lastCountedDate: null });
    setStreak(streakState.streak || 0);
    setLastCountedDate(streakState.lastCountedDate || null);
    const records = readJson('healthbuddy_daily_habits', []);
    setHistory(buildHistory(records));
    if (streakState.lastCountedDate === today) {
      setMessage('Today’s streak has already been counted. Your next update is tomorrow.');
    }
  }, [userId]);

  const saveTodayHabits = (newData) => {
    writeJson(habitsKey, { date: localDateString(), data: newData });
  };

  const handleToggle = (habitId) => {
    const newData = { ...habitData, [habitId]: !habitData[habitId] };
    setHabitData(newData);
    saveTodayHabits(newData);
  };

  const completedCount = Object.values(habitData).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / habits.length) * 100);
  const allCompleted = completedCount === habits.length;

  const saveDailyRecord = (newStreak, resetData, allCompletedForDay) => {
    const today = localDateString();
    const records = readJson('healthbuddy_daily_habits', []);
    const filtered = records.filter((record) => !(record.userId === userId && record.habitDate === today));
    const record = {
      id: `${userId}-${today}`,
      userId,
      userEmail: currentUser?.email || 'guest@healthbuddy.local',
      userRole: currentUser?.role || 'guest',
      habitDate: today,
      ...habitData,
      completionPercentage,
      allCompleted: allCompletedForDay,
      streak: newStreak,
      updated: new Date().toISOString(),
    };
    writeJson('healthbuddy_daily_habits', [record, ...filtered].slice(0, 60));
    setHistory(buildHistory([record, ...filtered]));
    writeJson(habitsKey, { date: today, data: resetData });
  };

  const handleFinishDay = () => {
    const today = localDateString();
    if (lastCountedDate === today) {
      setMessage('Today’s streak has already been counted. Come back tomorrow to continue your streak.');
      toast.info('Today’s streak has already been counted.');
      return;
    }

    const resetData = emptyHabitData();
    if (allCompleted) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLastCountedDate(today);
      writeJson(streakKey, { streak: newStreak, lastCountedDate: today });
      saveDailyRecord(newStreak, resetData, true);
      setHabitData(resetData);
      setMessage('Great job. Your streak increased by 1. Habits reset for the next day.');
      toast.success('Great job. Your streak increased by 1.');
      // Check for new achievements
      try {
        const { newlyUnlocked } = getUnlockedAchievements(userId);
        newlyUnlocked.forEach(a => {
          toast.success(`🏅 Achievement unlocked: ${a.title}!`, { description: a.description, duration: 5000 });
        });
      } catch {}
      return;
    }

    setStreak(0);
    setLastCountedDate(today);
    writeJson(streakKey, { streak: 0, lastCountedDate: today });
    saveDailyRecord(0, resetData, false);
    setHabitData(resetData);
    setMessage('Streak reset because not all habits were completed today. Habits reset for the next day.');
    toast.error('Streak reset because not all habits were completed today.');
  };

  return (
    <>
      <Helmet>
        <title>Habit Tracker - HealthBuddy AI</title>
        <meta name="description" content="Track your daily wellness habits and build consistency." />
      </Helmet>
      <Header />
      
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Daily Habit Tracker</h1>
              <p className="text-muted-foreground">Complete every habit to protect your streak.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleFinishDay}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Finish Day & Update Streak
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="metric-card-primary">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">{completionPercentage}%</div>
                <p className="text-sm text-muted-foreground">Completion</p>
              </CardContent>
            </Card>
            <Card className="metric-card-secondary">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-6 h-6 text-accent" />
                  <div className="text-4xl font-bold">{streak}</div>
                </div>
                <p className="text-sm text-muted-foreground">Current Streak: {streak} days</p>
              </CardContent>
            </Card>
            <Card className="metric-card-secondary">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">{completedCount}/{habits.length}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Streak Rule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercentage} className="h-3" />
              <div className={`mt-4 rounded-xl p-4 border ${allCompleted ? 'bg-primary/10 border-primary/30' : 'bg-muted/60'}`}>
                <div className="flex items-start gap-3">
                  {allCompleted ? <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-secondary mt-0.5" />}
                  <div>
                    <p className="font-semibold">{allCompleted ? 'All habits completed' : 'Finish all habits before ending the day'}</p>
                    <p className="text-sm text-muted-foreground mt-1">{message}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                A day counts only when 100% of habits are completed, and the streak updates only when you press Finish Day.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-secondary" />
                7-Day Consistency View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {history.map((day) => (
                  <div key={day.date} className={`rounded-xl p-3 text-center border ${day.completed ? 'bg-primary/10 border-primary/30' : 'bg-muted/50'}`}>
                    <div className="text-xs text-muted-foreground mb-1">{day.label}</div>
                    <div className="font-bold">{day.completion}%</div>
                    <div className="text-xs mt-1">{day.completed ? 'Streak' : 'Open'}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {habits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    className="habit-checkbox-item"
                  >
                    <Checkbox id={habit.id} checked={habitData[habit.id] || false} onCheckedChange={() => handleToggle(habit.id)} />
                    <label htmlFor={habit.id} className="text-sm font-medium leading-none cursor-pointer flex-1">
                      {habit.label}
                    </label>
                  </motion.div>
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

export default HabitTrackerPage;
