const ACHIEVEMENTS = [
  { id: 'first-day', title: 'First Step', description: 'Complete your first day of habits', icon: '🌱', condition: (data) => data.totalDaysCompleted >= 1 },
  { id: 'streak-3', title: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', condition: (data) => data.maxStreak >= 3 },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', condition: (data) => data.maxStreak >= 7 },
  { id: 'streak-14', title: 'Fortnight Champion', description: 'Maintain a 14-day streak', icon: '🏆', condition: (data) => data.maxStreak >= 14 },
  { id: 'streak-30', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', condition: (data) => data.maxStreak >= 30 },
  { id: 'perfect-week', title: 'Perfect Week', description: 'Complete all habits for 7 days straight', icon: '💎', condition: (data) => data.perfectWeeks >= 1 },
  { id: 'water-champion', title: 'Hydration Hero', description: 'Track water intake for 5 days', icon: '💧', condition: (data) => data.waterDays >= 5 },
  { id: 'early-bird', title: 'Early Bird', description: 'Log habits before 9am', icon: '🌅', condition: (data) => data.earlyLogs >= 3 },
  { id: 'mood-tracker', title: 'Self-Aware', description: 'Log mood for 7 consecutive days', icon: '🧠', condition: (data) => data.moodStreak >= 7 },
  { id: 'wellness-90', title: 'Wellness Elite', description: 'Score above 90 on wellness', icon: '🌟', condition: (data) => data.highestScore >= 90 },
  { id: 'assessed', title: 'Self-Knowledge', description: 'Complete your assessment', icon: '📋', condition: (data) => data.hasAssessment },
  { id: 'coach-user', title: 'Coachable', description: 'Ask the AI coach 5 questions', icon: '🤖', condition: (data) => data.coachMessages >= 5 },
];

function getAchievementData(userId) {
  const streakState = JSON.parse(localStorage.getItem(`healthbuddy_streak_state_${userId}`) || '{"streak":0}');
  const dailyHabits = JSON.parse(localStorage.getItem('healthbuddy_daily_habits') || '[]');
  const userRecords = dailyHabits.filter(r => r.userId === userId);

  let totalDaysCompleted = 0;
  let perfectWeeks = 0;
  let earlyLogs = 0;
  let highestScore = 0;
  let waterDays = 0;

  userRecords.forEach(r => {
    if (r.completionPercentage === 100) totalDaysCompleted++;
    if (r.completionPercentage >= 80) highestScore = Math.max(highestScore, r.completionPercentage);
    if (r.completedAt) {
      const hour = new Date(r.completedAt).getHours();
      if (hour < 9) earlyLogs++;
    }
  });

  // Check for perfect weeks (consecutive 100% days)
  const sortedRecords = [...userRecords].sort((a, b) => new Date(a.habitDate) - new Date(b.habitDate));
  let consecutivePerfect = 0;
  sortedRecords.forEach(r => {
    if (r.completionPercentage === 100) {
      consecutivePerfect++;
      if (consecutivePerfect >= 7) perfectWeeks++;
    } else {
      consecutivePerfect = 0;
    }
  });

  // Water tracking days
  const waterRecords = JSON.parse(localStorage.getItem(`healthbuddy_water_history_${userId}`) || '[]');
  waterDays = waterRecords.length;

  // Mood streak
  const moodHistory = JSON.parse(localStorage.getItem(`healthbuddy_mood_history_${userId}`) || '[]');
  let moodStreak = 0;
  if (moodHistory.length > 0) {
    const sortedMoods = [...moodHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    for (const mood of sortedMoods) {
      const moodDate = new Date(mood.date).toISOString().split('T')[0];
      if (moodDate === checkDate.toISOString().split('T')[0]) {
        moodStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }
  }

  // Coach messages
  const coachHistory = JSON.parse(localStorage.getItem(`healthbuddy_coach_history_${userId}`) || '[]');
  const coachMessages = coachHistory.filter(m => m.role === 'user').length;

  // Assessment check
  const profiles = JSON.parse(localStorage.getItem('healthbuddy_local_profiles') || '[]');
  const hasAssessment = profiles.some(p => p.id === userId) ||
    JSON.parse(localStorage.getItem('healthbuddy_user_profiles') || '[]').some(p => p.userId === userId);

  return {
    totalDaysCompleted,
    maxStreak: streakState.streak || 0,
    perfectWeeks,
    waterDays,
    earlyLogs,
    moodStreak,
    highestScore,
    hasAssessment,
    coachMessages,
  };
}

export function getUnlockedAchievements(userId) {
  const data = getAchievementData(userId);
  const unlocked = JSON.parse(localStorage.getItem(`healthbuddy_achievements_${userId}`) || '[]');
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach(achievement => {
    if (!unlocked.includes(achievement.id) && achievement.condition(data)) {
      unlocked.push(achievement.id);
      newlyUnlocked.push(achievement);
    }
  });

  localStorage.setItem(`healthbuddy_achievements_${userId}`, JSON.stringify(unlocked));

  return { unlocked: ACHIEVEMENTS.filter(a => unlocked.includes(a.id)), newlyUnlocked };
}

export function getAllAchievements() {
  return ACHIEVEMENTS;
}

export function getUnlockedCount(userId) {
  const unlocked = JSON.parse(localStorage.getItem(`healthbuddy_achievements_${userId}`) || '[]');
  return unlocked.length;
}
