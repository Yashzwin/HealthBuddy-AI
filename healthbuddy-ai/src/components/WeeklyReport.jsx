import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateDemoWeeklyReportData } from '@/lib/demoData';

const HABIT_LABELS = ['💧 Water', '🧘 Breaks', '🏃 Movement', '😴 Sleep', '📱 Screen', '🍎 Meals', '🧘 Mind'];

const WeeklyReport = () => {
  const { currentUser } = useAuth();

  const report = useMemo(() => {
    if (!currentUser) return null;
    const dailyHabits = JSON.parse(localStorage.getItem('healthbuddy_daily_habits') || '[]');
    const userRecords = dailyHabits
      .filter(r => r.userId === currentUser.id)
      .sort((a, b) => new Date(b.habitDate) - new Date(a.habitDate))
      .slice(0, 7);

    if (userRecords.length === 0) return generateDemoWeeklyReportData();

    const avgCompletion = Math.round(userRecords.reduce((s, r) => s + (r.completionPercentage || 0), 0) / userRecords.length);
    const bestDay = userRecords.reduce((best, r) => (r.completionPercentage > (best.completionPercentage || 0)) ? r : best, userRecords[0]);
    const worstDay = userRecords.reduce((worst, r) => (r.completionPercentage < (worst.completionPercentage || 100)) ? r : worst, userRecords[0]);

    // Trend: compare first half vs second half
    const mid = Math.floor(userRecords.length / 2);
    const recent = userRecords.slice(0, mid || 1);
    const older = userRecords.slice(mid || 1);
    const recentAvg = recent.reduce((s, r) => s + (r.completionPercentage || 0), 0) / (recent.length || 1);
    const olderAvg = older.length > 0 ? older.reduce((s, r) => s + (r.completionPercentage || 0), 0) / older.length : recentAvg;
    const trend = recentAvg > olderAvg + 5 ? 'improving' : recentAvg < olderAvg - 5 ? 'declining' : 'stable';

    // Grade
    const grade = avgCompletion >= 90 ? 'A+' : avgCompletion >= 80 ? 'A' : avgCompletion >= 70 ? 'B+' :
      avgCompletion >= 60 ? 'B' : avgCompletion >= 50 ? 'C' : avgCompletion >= 40 ? 'D' : 'F';

    // Chart data
    const chartData = userRecords.reverse().map(r => ({
      day: new Date(r.habitDate).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3),
      completion: r.completionPercentage || 0,
      date: r.habitDate,
    }));

    return { avgCompletion, bestDay, worstDay, trend, grade, chartData, totalDays: userRecords.length };
  }, [currentUser]);

  if (!report) {
    return null;
  }

  const gradeColors = {
    'A+': 'text-green-500', 'A': 'text-green-500', 'B+': 'text-blue-500', 'B': 'text-blue-500',
    'C': 'text-amber-500', 'D': 'text-orange-500', 'F': 'text-red-500',
  };

  const trendConfig = {
    improving: { icon: TrendingUp, color: 'text-green-500', label: 'Improving' },
    declining: { icon: TrendingDown, color: 'text-red-500', label: 'Declining' },
    stable: { icon: Minus, color: 'text-muted-foreground', label: 'Stable' },
  };

  const trendInfo = trendConfig[report.trend];
  const TrendIcon = trendInfo.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </span>
            Weekly Wellness Report
          </span>
          <Badge variant="outline" className="text-xs">
            Last {report.totalDays} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Grade and Trend */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${gradeColors[report.grade]}`}>{report.grade}</div>
            <div className="text-xs text-muted-foreground">Grade</div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Average: {report.avgCompletion}%</div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${report.avgCompletion}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className={`flex items-center gap-1 text-sm font-semibold ${trendInfo.color}`}>
              <TrendIcon className="h-4 w-4" />
              {trendInfo.label}
            </div>
            <div className="text-xs text-muted-foreground">Trend</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border/60 bg-card/95 px-3 py-2 text-xs shadow-elevated">
                        <p className="font-semibold">{label}</p>
                        <p className="text-muted-foreground">Completion: <span className="font-bold text-foreground">{payload[0].value}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="completion" radius={[6, 6, 0, 0]}>
                {report.chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.completion >= 80 ? 'hsl(142 76% 46%)' : entry.completion >= 50 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Best/Worst */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Best Day</p>
            <p className="font-semibold">{new Date(report.bestDay.habitDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <p className="text-xs text-muted-foreground">{report.bestDay.completionPercentage}% completion</p>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Needs Work</p>
            <p className="font-semibold">{new Date(report.worstDay.habitDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <p className="text-xs text-muted-foreground">{report.worstDay.completionPercentage}% completion</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyReport;
