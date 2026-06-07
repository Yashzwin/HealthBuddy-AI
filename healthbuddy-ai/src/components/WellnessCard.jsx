import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Heart, Flame, Droplets, Moon, Activity, Brain, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const WellnessCard = ({ wellnessScore, profile, streak }) => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!wellnessScore) return null;

  const overall = wellnessScore.overallScore;
  const level = overall >= 80 ? 'Excellent' : overall >= 60 ? 'Good' : overall >= 40 ? 'Fair' : 'Needs Improvement';

  const shareText = `🏆 My HealthBuddy AI Wellness Score: ${overall}/100 (${level})
🔥 Streak: ${streak || 0} days
💧 Hydration: ${wellnessScore.hydrationScore}% | 😴 Sleep: ${wellnessScore.sleepScore}%
🏃 Movement: ${wellnessScore.movementScore}% | 🧠 Focus: ${wellnessScore.focusBalanceScore}%
💪 Recovery: ${wellnessScore.recoveryScore}% | ⏰ Routine: ${wellnessScore.routineStabilityScore}%

Build healthier habits with HealthBuddy AI 💚`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary">
              <Share2 className="h-5 w-5" />
            </span>
            Share Progress
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Preview Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${(overall / 100) * 263.89} 263.89`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{overall}</span>
                <span className="text-[8px] text-muted-foreground">/100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">{profile?.name || currentUser?.name || 'HealthBuddy User'}</p>
              <p className="text-xs text-muted-foreground">{level}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="font-medium">{streak || 0} day streak</span>
              </div>
            </div>
          </div>

          <div className="relative mt-3 grid grid-cols-3 gap-2 text-[10px]">
            {[
              { icon: Droplets, label: 'Hydration', value: wellnessScore.hydrationScore },
              { icon: Moon, label: 'Sleep', value: wellnessScore.sleepScore },
              { icon: Activity, label: 'Movement', value: wellnessScore.movementScore },
              { icon: Brain, label: 'Focus', value: wellnessScore.focusBalanceScore },
              { icon: Heart, label: 'Recovery', value: wellnessScore.recoveryScore },
              { icon: Clock, label: 'Routine', value: wellnessScore.routineStabilityScore },
            ].map(m => (
              <div key={m.label} className="rounded-lg bg-card/60 p-1.5 text-center">
                <m.icon className="mx-auto h-3 w-3 text-muted-foreground" />
                <div className="mt-0.5 font-semibold">{m.value}%</div>
                <div className="text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="relative mt-3 text-center text-[10px] text-muted-foreground">
            Built with HealthBuddy AI 💚
          </div>
        </div>

        <Button onClick={handleCopy} variant="outline" className="mt-4 w-full gap-2">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WellnessCard;
