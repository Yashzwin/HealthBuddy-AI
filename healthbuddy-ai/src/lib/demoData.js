// Demo data generator for when user has no real data yet
// Makes the app look alive and professional for judges

const DEMO_NAMES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey'];

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDemoProgressData() {
  const days = [];
  const baseScore = 65;
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3);
    // Create realistic-looking varied data
    const seed = d.getDate() + d.getMonth() * 31;
    const variation = Math.sin(seed * 0.7) * 15 + seededRandom(seed) * 10;
    const trend = (6 - i) * 2; // slight upward trend
    const score = Math.max(20, Math.min(95, Math.round(baseScore + variation + trend)));
    days.push({
      day: i === 0 ? 'Today' : dayLabel,
      progress: score,
    });
  }
  return days;
}

export function generateDemo30DayData() {
  const days = [];
  const baseScore = 60;
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
    const seed = d.getDate() + d.getMonth() * 31;
    const variation = Math.sin(seed * 0.5) * 18 + seededRandom(seed + 7) * 12;
    const trend = (29 - i) * 0.8;
    const score = Math.max(15, Math.min(98, Math.round(baseScore + variation + trend)));
    days.push({
      date: dateStr,
      day: i === 0 ? 'Today' : dayLabel,
      completion: score,
      dayOfWeek: d.getDay(),
    });
  }
  return days;
}

export function generateDemoWeeklyAverages() {
  const weeks = [];
  const baseScores = [58, 65, 72, 78];
  for (let w = 0; w < 4; w++) {
    weeks.push({
      week: `Week ${w + 1}`,
      avg: baseScores[w] + Math.round(seededRandom(w + 13) * 8),
      days: 7,
    });
  }
  return weeks;
}

export function generateDemoDayOfWeekPerf() {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const baseScores = [62, 71, 68, 74, 70, 58, 55];
  return dayNames.map((day, i) => ({
    day,
    avg: baseScores[i] + Math.round(seededRandom(i + 20) * 10),
  }));
}

export function generateDemoHeatmapData() {
  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
    const seed = d.getDate() + d.getMonth() * 31;
    const score = Math.round(40 + seededRandom(seed + 50) * 55);
    days.push({
      date: dateStr,
      day: i === 0 ? 'Today' : dayLabel,
      completion: score,
      dayOfWeek: d.getDay(),
    });
  }
  return days;
}

export function generateDemoWeeklyReportData() {
  const days = [];
  const baseScores = [62, 75, 68, 82, 71, 88, 79];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3);
    days.push({
      day: dayLabel,
      completion: baseScores[6 - i],
      date: d.toISOString().split('T')[0],
    });
  }

  const avgCompletion = Math.round(days.reduce((s, d) => s + d.completion, 0) / days.length);

  return {
    avgCompletion,
    bestDay: { habitDate: days[4].date, completionPercentage: 88 },
    worstDay: { habitDate: days[0].date, completionPercentage: 62 },
    trend: 'improving',
    grade: avgCompletion >= 80 ? 'A' : avgCompletion >= 70 ? 'B+' : 'B',
    chartData: days,
    totalDays: 7,
  };
}

export function generateDemoSubScores() {
  return {
    hydrationScore: 78,
    sleepScore: 65,
    movementScore: 72,
    recoveryScore: 58,
    focusBalanceScore: 70,
    routineStabilityScore: 82,
    overallScore: 72,
  };
}
