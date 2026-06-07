import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { SmilePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MOODS = [
  { emoji: '😫', label: 'Terrible', value: 1 },
  { emoji: '😕', label: 'Bad', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😊', label: 'Great', value: 5 },
];

const MoodTracker = () => {
  const { currentUser } = useAuth();
  const [todayMood, setTodayMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!currentUser) return;
    const history = JSON.parse(localStorage.getItem(`healthbuddy_mood_history_${currentUser.id}`) || '[]');
    setMoodHistory(history);
    const todayRecord = history.find(m => m.date === today);
    if (todayRecord) setTodayMood(todayRecord.value);
  }, [currentUser, today]);

  const selectMood = (mood) => {
    setTodayMood(mood.value);
    if (!currentUser) return;

    const history = [...moodHistory];
    const existingIdx = history.findIndex(m => m.date === today);
    const record = { date: today, value: mood.value, label: mood.label, emoji: mood.emoji };

    if (existingIdx >= 0) {
      history[existingIdx] = record;
    } else {
      history.push(record);
    }

    // Keep last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = history.filter(m => new Date(m.date) >= thirtyDaysAgo);

    setMoodHistory(filtered);
    localStorage.setItem(`healthbuddy_mood_history_${currentUser.id}`, JSON.stringify(filtered));
  };

  // Prepare chart data (last 7 days)
  const chartData = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3);
      const record = moodHistory.find(m => m.date === dateStr);
      days.push({ day: i === 0 ? 'Today' : dayLabel, mood: record?.value || null });
    }
    return days;
  })();

  const hasData = chartData.some(d => d.mood !== null);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <SmilePlus className="h-5 w-5" />
          </span>
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.value}
              onClick={() => selectMood(mood)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl transition-all sm:h-16 sm:w-16 ${
                todayMood === mood.value
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-border/60 bg-card hover:border-primary/30'
              }`}
              title={mood.label}
            >
              {mood.emoji}
              {todayMood === mood.value && (
                <motion.div
                  layoutId="mood-indicator"
                  className="absolute -bottom-1 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
        {todayMood && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center text-sm text-muted-foreground"
          >
            Feeling {MOODS.find(m => m.value === todayMood)?.label.toLowerCase()} today
          </motion.p>
        )}

        {hasData && (
          <div className="mt-4 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
                <YAxis domain={[0, 5.5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].value) {
                      const mood = MOODS.find(m => m.value === payload[0].value);
                      return (
                        <div className="rounded-lg border border-border/60 bg-card/95 px-2 py-1 text-xs shadow-elevated">
                          {mood?.emoji} {mood?.label}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="mood" stroke="hsl(var(--primary))" fill="url(#moodGrad)" strokeWidth={2} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
