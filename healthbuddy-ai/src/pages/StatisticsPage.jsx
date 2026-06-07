import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Calendar, Flame, Target, Activity, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CalmConstellation from '@/components/CalmConstellation';
import DayNightLandscape from '@/components/DayNightLandscape';
import {
  generateDemo30DayData, generateDemoWeeklyAverages,
  generateDemoDayOfWeekPerf, generateDemoHeatmapData
} from '@/lib/demoData';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

/* ── Smooth SVG Line Chart (for 30-day trend) ── */
const SmoothLineChart = ({ data, dataKey, color = 'primary', height = 250, label = 'Score' }) => {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const W = 800, H = height;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const iW = W - pad.left - pad.right;
  const iH = H - pad.top - pad.bottom;

  if (!data || data.length === 0) return null;

  const max = 100;
  const stepX = iW / Math.max(1, data.length - 1);

  const pts = data.map((d, i) => ({
    x: pad.left + i * stepX,
    y: pad.top + iH - ((d[dataKey] ?? 0) / max) * iH,
    raw: d,
  }));

  const smoothPath = (p) => {
    if (p.length < 2) return '';
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += ` C ${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${pad.top + iH} L ${pts[0].x} ${pad.top + iH} Z`;
  const gradId = `slg-${color}-${label.replace(/\s/g, '')}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`hsl(var(--${color}))`} />
            <stop offset="100%" stopColor={`hsl(var(--secondary))`} />
          </linearGradient>
          <linearGradient id={`${gradId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(var(--${color}))`} stopOpacity="0.3" />
            <stop offset="100%" stopColor={`hsl(var(--${color}))`} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(t => {
          const y = pad.top + iH - (t / 100) * iH;
          return (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + iW} y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="3 4" opacity={t === 0 ? 0.5 : 0.3} />
              <text x={pad.left - 8} y={y + 3} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))">{t}</text>
            </g>
          );
        })}

        {/* X labels — show every 5th for 30-day */}
        {pts.map((p, i) => (
          data.length <= 14 || i % 5 === 0 || i === data.length - 1 ? (
            <text key={i} x={p.x} y={H - pad.bottom + 18} fontSize="9" textAnchor="middle" fill="hsl(var(--muted-foreground))">
              {p.raw.day}
            </text>
          ) : null
        ))}

        {/* Area fill */}
        <motion.path
          d={area}
          fill={`url(#${gradId}-area)`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        {/* Smooth line */}
        <motion.path
          d={line}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 4px 8px hsl(var(--${color}) / 0.3))` }}
        />

        {/* Dots (show every few to avoid clutter on 30-day) */}
        {pts.map((p, i) => {
          const showDot = data.length <= 14 || i === 0 || i === pts.length - 1 || i % 5 === 0;
          if (!showDot) return null;
          const isHov = hoverIdx === i;
          return (
            <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.y} r={isHov ? 6 : 3.5} fill="hsl(var(--card))" stroke={`hsl(var(--${color}))`} strokeWidth="2.5"
                style={{ transition: 'r 200ms ease', filter: isHov ? `drop-shadow(0 0 6px hsl(var(--${color}) / 0.5))` : undefined }} />
              {isHov && (
                <g>
                  <rect x={p.x - 30} y={p.y - 38} width="60" height="30" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1"
                    style={{ filter: 'drop-shadow(0 4px 12px rgb(0 0 0 / 0.12))' }} />
                  <text x={p.x} y={p.y - 22} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontWeight="600">{p.raw.day}</text>
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="12" fill="hsl(var(--foreground))" fontWeight="700">{p.raw[dataKey]}%</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Hit areas */}
        {pts.map((p, i) => (
          <rect key={`hit-${i}`} x={p.x - stepX / 2} y={pad.top} width={stepX} height={iH} fill="transparent"
            onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)} />
        ))}
      </svg>
    </div>
  );
};

/* ── Animated SVG Bar Chart ── */
const AnimatedBarChart = ({ data, dataKey, labelKey, colors, height = 200 }) => {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const W = 400, H = height;
  const pad = { top: 15, right: 15, bottom: 30, left: 40 };
  const iW = W - pad.left - pad.right;
  const iH = H - pad.top - pad.bottom;

  if (!data || data.length === 0) return null;

  const max = 100;
  const barW = (iW / data.length) * 0.6;
  const gap = (iW / data.length) * 0.4;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          {data.map((d, i) => {
            const cid = `bar-${i}-${labelKey}`;
            const colorVal = typeof colors === 'function' ? colors(d, i) : (colors || `hsl(var(--primary))`);
            return (
              <linearGradient key={cid} id={cid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorVal} />
                <stop offset="100%" stopColor={colorVal} stopOpacity="0.6" />
              </linearGradient>
            );
          })}
        </defs>

        {/* Grid */}
        {[0, 25, 50, 75, 100].map(t => {
          const y = pad.top + iH - (t / 100) * iH;
          return (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + iW} y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="3 4" opacity={0.3} />
              <text x={pad.left - 6} y={y + 3} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))">{t}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = ((d[dataKey] || 0) / max) * iH;
          const x = pad.left + i * (barW + gap) + gap / 2;
          const y = pad.top + iH - barH;
          const isHov = hoverIdx === i;
          return (
            <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)} style={{ cursor: 'pointer' }}>
              <motion.rect
                x={x} y={y} width={barW} height={barH}
                rx="6" fill={`url(#bar-${i}-${labelKey})`}
                initial={{ height: 0, y: pad.top + iH }}
                whileInView={{ height: barH, y }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                opacity={isHov ? 1 : 0.85}
                style={{ filter: isHov ? `drop-shadow(0 4px 8px hsl(var(--primary) / 0.3))` : undefined }}
              />
              <text x={x + barW / 2} y={H - pad.bottom + 16} fontSize="10" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontWeight="500">
                {d[labelKey]}
              </text>
              {isHov && (
                <g>
                  <rect x={x + barW / 2 - 24} y={y - 28} width="48" height="22" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1"
                    style={{ filter: 'drop-shadow(0 4px 8px rgb(0 0 0 / 0.1))' }} />
                  <text x={x + barW / 2} y={y - 12} textAnchor="middle" fontSize="10" fill="hsl(var(--foreground))" fontWeight="700">{d[dataKey]}%</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ── Animated Heatmap ── */
const AnimatedHeatmap = ({ data }) => (
  <div className="grid grid-cols-7 gap-1.5">
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
      <div key={d} className="text-center text-[10px] font-medium text-muted-foreground">{d}</div>
    ))}
    {data.map((day, i) => {
      const val = day.completion;
      const bg = val === null ? 'bg-muted/30' :
        val >= 80 ? 'bg-green-500/80' :
        val >= 60 ? 'bg-green-500/50' :
        val >= 40 ? 'bg-amber-500/50' :
        val >= 20 ? 'bg-orange-500/50' :
        val > 0 ? 'bg-red-500/50' : 'bg-muted/30';
      return (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.015, duration: 0.3, type: 'spring' }}
          whileHover={{ scale: 1.2, zIndex: 10 }}
          className={`aspect-square rounded-md ${bg} flex items-center justify-center text-[9px] font-medium transition-all`}
          title={`${day.date}: ${val !== null ? val + '%' : 'No data'}`}
        >
          {val !== null ? val : ''}
        </motion.div>
      );
    })}
  </div>
);

/* ── Stat Card with count-up ── */
const StatCard = ({ icon: Icon, label, value, color, bg, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="wellness-card">
      <CardContent className="p-4">
        <div className={`mb-2 grid h-8 w-8 place-items-center rounded-lg ${bg} ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const StatisticsPage = () => {
  const { currentUser } = useAuth();
  const [dailyHabits, setDailyHabits] = useState([]);
  const [streakState, setStreakState] = useState({ streak: 0, lastCountedDate: null });

  useEffect(() => {
    if (!currentUser) return;
    const records = JSON.parse(localStorage.getItem('healthbuddy_daily_habits') || '[]');
    setDailyHabits(records.filter(r => r.userId === currentUser.id));
    const streak = JSON.parse(localStorage.getItem(`healthbuddy_streak_state_${currentUser.id}`) || '{"streak":0}');
    setStreakState(streak);
  }, [currentUser]);

  const last30Days = useMemo(() => {
    if (dailyHabits.length === 0) return generateDemo30DayData();
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
      const record = dailyHabits.find(r => r.habitDate === dateStr);
      days.push({ date: dateStr, day: i === 0 ? 'Today' : dayLabel, completion: record?.completionPercentage ?? null, dayOfWeek: d.getDay() });
    }
    return days;
  }, [dailyHabits]);

  const weeklyData = useMemo(() => {
    if (dailyHabits.length === 0) return generateDemoWeeklyAverages();
    return Array.from({ length: 4 }, (_, w) => {
      const weekDays = last30Days.slice(w * 7, (w + 1) * 7);
      const withData = weekDays.filter(d => d.completion !== null);
      const avg = withData.length > 0 ? Math.round(withData.reduce((s, d) => s + d.completion, 0) / withData.length) : 0;
      return { week: `Week ${w + 1}`, avg, days: withData.length };
    });
  }, [last30Days, dailyHabits.length]);

  const dayOfWeekPerf = useMemo(() => {
    if (dailyHabits.length === 0) return generateDemoDayOfWeekPerf();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayData = Array.from({ length: 7 }, (_, i) => ({ day: dayNames[i], scores: [], avg: 0 }));
    dailyHabits.forEach(r => { dayData[new Date(r.habitDate).getDay()].scores.push(r.completionPercentage || 0); });
    return dayData.map(d => ({ day: d.day, avg: d.scores.length > 0 ? Math.round(d.scores.reduce((s, v) => s + v, 0) / d.scores.length) : 0 }));
  }, [dailyHabits]);

  const stats = useMemo(() => {
    if (dailyHabits.length === 0) return { totalDays: 24, avgScore: 72, bestScore: 95, worstScore: 38, currentStreak: streakState.streak || 5, perfectDays: 8 };
    const completions = dailyHabits.map(r => r.completionPercentage || 0);
    const total = completions.reduce((s, v) => s + v, 0);
    return {
      totalDays: dailyHabits.length,
      avgScore: Math.round(total / completions.length),
      bestScore: Math.max(...completions),
      worstScore: Math.min(...completions),
      currentStreak: streakState.streak || 0,
      perfectDays: completions.filter(c => c === 100).length,
    };
  }, [dailyHabits, streakState]);

  const hasData = dailyHabits.length > 0;

  const weeklyBarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
  const dowBarColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <>
      <Helmet>
        <title>Statistics - HealthBuddy AI</title>
        <meta name="description" content="View your wellness statistics, trends, and historical data." />
      </Helmet>
      <Header />

      <div className="relative min-h-screen overflow-hidden bg-background">
        <DayNightLandscape variant="subtle" />

        <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Badge variant="outline" className="pill pill-primary mb-3">
              <BarChart3 className="h-3.5 w-3.5" />
              Analytics
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Statistics</h1>
            <p className="mt-2 text-muted-foreground">
              {hasData ? 'Historical trends and performance insights' : 'Preview with sample data — start tracking to see your real stats'}
            </p>
          </motion.div>

          {!hasData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center text-sm text-muted-foreground"
            >
              📊 Showing sample data — complete habits daily to see your real statistics
            </motion.div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <StatCard icon={Calendar} label="Total Days" value={stats.totalDays} color="text-blue-500" bg="bg-blue-500/10" delay={0} />
            <StatCard icon={Target} label="Average Score" value={`${stats.avgScore}%`} color="text-primary" bg="bg-primary/10" delay={0.05} />
            <StatCard icon={TrendingUp} label="Best Score" value={`${stats.bestScore}%`} color="text-green-500" bg="bg-green-500/10" delay={0.1} />
            <StatCard icon={Activity} label="Worst Score" value={`${stats.worstScore}%`} color="text-orange-500" bg="bg-orange-500/10" delay={0.15} />
            <StatCard icon={Flame} label="Current Streak" value={`${stats.currentStreak}d`} color="text-accent" bg="bg-accent/10" delay={0.2} />
            <StatCard icon={Zap} label="Perfect Days" value={stats.perfectDays} color="text-secondary" bg="bg-secondary/10" delay={0.25} />
          </div>

          {/* 30-Day Trend — Smooth Line */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="mt-6 overflow-hidden border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      30-Day Wellness Trend
                    </CardTitle>
                    <CardDescription>Your daily completion score over the past month</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <ArrowUp className="h-3 w-3" />
                    Improving
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <SmoothLineChart
                    data={last30Days.filter(d => d.completion !== null).map((d, i) => ({ ...d, day: d.day, score: d.completion }))}
                    dataKey="score"
                    color="primary"
                    height={256}
                    label="30day"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Averages + Day of Week — Bar Charts */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }}>
              <Card className="overflow-hidden border-border/60">
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Averages</CardTitle>
                  <CardDescription>How each week compared</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <AnimatedBarChart
                      data={weeklyData}
                      dataKey="avg"
                      labelKey="week"
                      colors={(d, i) => weeklyBarColors[i % weeklyBarColors.length]}
                      height={208}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="overflow-hidden border-border/60">
                <CardHeader>
                  <CardTitle className="text-lg">Performance by Day</CardTitle>
                  <CardDescription>Average score for each day of the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <AnimatedBarChart
                      data={dayOfWeekPerf}
                      dataKey="avg"
                      labelKey="day"
                      colors={(d, i) => dowBarColors[i % dowBarColors.length]}
                      height={208}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Daily Heatmap */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.25 }}>
            <Card className="mt-6 overflow-hidden border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Daily Completion Heatmap</CardTitle>
                <CardDescription>Each day's completion percentage over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedHeatmap data={last30Days} />
                <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                  <span>No data</span>
                  <div className="h-3 w-3 rounded-sm bg-muted/30" />
                  <span>0%</span>
                  <div className="h-3 w-3 rounded-sm bg-red-500/50" />
                  <span>50%</span>
                  <div className="h-3 w-3 rounded-sm bg-amber-500/50" />
                  <span>80%</span>
                  <div className="h-3 w-3 rounded-sm bg-green-500/80" />
                  <span>100%</span>
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

export default StatisticsPage;
