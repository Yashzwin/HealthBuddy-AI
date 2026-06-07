import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUnlockedAchievements, getAllAchievements } from '@/lib/achievements';

const AchievementBadges = ({ onUnlock }) => {
  const { currentUser } = useAuth();
  const [unlocked, setUnlocked] = useState([]);
  const all = getAllAchievements();

  useEffect(() => {
    if (!currentUser) return;
    const { unlocked: unlockedList, newlyUnlocked } = getUnlockedAchievements(currentUser.id);
    setUnlocked(unlockedList);
    if (newlyUnlocked.length > 0 && onUnlock) {
      onUnlock(newlyUnlocked);
    }
  }, [currentUser, onUnlock]);

  const unlockedIds = unlocked.map(a => a.id);
  const progress = Math.round((unlockedIds.length / all.length) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <Trophy className="h-5 w-5" />
            </span>
            Achievements
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {unlockedIds.length}/{all.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <AnimatePresence>
            {all.map((achievement, i) => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all ${
                    isUnlocked
                      ? 'border-amber-300/50 bg-amber-500/5 shadow-sm shadow-amber-500/10'
                      : 'border-border/40 bg-muted/20 opacity-50 grayscale'
                  }`}
                  title={achievement.description}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="text-[10px] font-medium leading-tight text-foreground/80">{achievement.title}</span>
                  {!isUnlocked && (
                    <Lock className="absolute right-1 top-1 h-3 w-3 text-muted-foreground/50" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
