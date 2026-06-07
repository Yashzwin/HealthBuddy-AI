import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WaterTracker = ({ targetCups = 8 }) => {
  const { currentUser } = useAuth();
  const [cups, setCups] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!currentUser) return;
    const key = `healthbuddy_water_${currentUser.id}_${today}`;
    const stored = parseInt(localStorage.getItem(key) || '0', 10);
    setCups(stored);
  }, [currentUser, today]);

  const updateCups = (newCups) => {
    const clamped = Math.max(0, Math.min(targetCups + 2, newCups));
    setCups(clamped);
    if (currentUser) {
      const key = `healthbuddy_water_${currentUser.id}_${today}`;
      localStorage.setItem(key, clamped.toString());
    }
  };

  const percentage = Math.min(100, Math.round((cups / targetCups) * 100));
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
            <Droplets className="h-5 w-5" />
          </span>
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative h-28 w-28 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50" cy="50" r="42"
                stroke="hsl(210 100% 60%)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={cups}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-blue-500"
              >
                {cups}
              </motion.span>
              <span className="text-[10px] text-muted-foreground">/ {targetCups}</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              {[...Array(targetCups)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-6 w-6 rounded-lg border-2 transition-colors ${
                    i < cups
                      ? 'border-blue-400 bg-blue-400 shadow-sm shadow-blue-400/50'
                      : 'border-muted-foreground/20 bg-transparent'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateCups(i < cups ? i : i + 1)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {percentage >= 100 ? '🎉 Great job! You hit your goal!' : `${targetCups - cups} more cups to reach your goal`}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateCups(cups - 1)}
                disabled={cups === 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateCups(cups + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterTracker;
