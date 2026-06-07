export const ASSESSMENT_REQUIRED_MESSAGE = 'Complete assessment first';

export function hasCompletedAssessment(user) {
  if (!user?.id) return false;

  try {
    const profiles = JSON.parse(localStorage.getItem('healthbuddy_user_profiles') || '[]');
    return profiles.some((profile) => {
      if (!profile || profile.userId !== user.id) return false;
      const age = Number(profile.age);
      return Number.isFinite(age) && age > 0;
    });
  } catch {
    return false;
  }
}
