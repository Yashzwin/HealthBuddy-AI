import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, RotateCcw, Trash2, Users, Activity, Flame, BarChart3, UserPlus, CheckCircle2, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const habitKeys = [
  'drankWaterRegularly',
  'tookStretchBreaks',
  'correctedPosture',
  'reducedScreenSessions',
  'movedWalked',
  'followedSleepRoutine',
  'tookRestBreaks',
  'didLightActivity',
  'spentTimeOutdoors',
  'practicedCalmBreathing',
  'followedCaregiverGoals',
];

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function getAllDemoData() {
  const output = {};
  Object.keys(localStorage)
    .filter((key) => key.startsWith('healthbuddy_'))
    .forEach((key) => {
      try {
        output[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        output[key] = localStorage.getItem(key);
      }
    });
  return output;
}

const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const data = useMemo(() => {
    const profiles = readJson('healthbuddy_local_profiles', []);
    const habitRecords = readJson('healthbuddy_daily_habits', []);
    const currentUser = readJson('healthbuddy_session_user', null);
    const today = new Date().toISOString().slice(0, 10);
    const todayRecords = habitRecords.filter((record) => record.habitDate === today);
    const latestRecord = habitRecords[0] || null;
    const avgCompletion = habitRecords.length
      ? Math.round(habitRecords.reduce((sum, record) => sum + (record.completionPercentage || 0), 0) / habitRecords.length)
      : 0;
    const totalCompletedHabits = habitRecords.reduce(
      (sum, record) => sum + habitKeys.filter((key) => Boolean(record[key])).length,
      0
    );

    const users = profiles.length ? profiles : [currentUser].filter(Boolean);

    return {
      profiles: users,
      habitRecords,
      todayRecords,
      latestRecord,
      avgCompletion,
      totalCompletedHabits,
    };
  }, [refreshKey]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getAllDemoData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'healthbuddy-local-demo-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Local demo data exported');
  };

  const resetStreaks = () => {
    const records = readJson('healthbuddy_daily_habits', []);
    const reset = records.map((record) => ({ ...record, streak: 0 }));
    localStorage.setItem('healthbuddy_daily_habits', JSON.stringify(reset));
    localStorage.setItem('healthbuddy_streak_state', JSON.stringify({ streak: 0, lastCountedDate: null }));
    setRefreshKey((value) => value + 1);
    toast.success('All local streaks reset');
  };



  const seedDemoData = () => {
    const now = new Date().toISOString();
    const demoProfiles = [
      { id: 'guest-user', email: 'guest@healthbuddy.local', name: 'Guest User', role: 'guest', lastActiveDate: now },
      { id: 'user-demo-student', email: 'student@example.com', name: 'Student Demo', role: 'user', lastActiveDate: now },
      { id: 'user-demo-family', email: 'family@example.com', name: 'Family Demo', role: 'user', lastActiveDate: now },
    ];
    localStorage.setItem('healthbuddy_local_profiles', JSON.stringify(demoProfiles));
    const today = new Date().toISOString().slice(0, 10);
    const demoRecords = demoProfiles.map((profile, index) => {
      const data = Object.fromEntries(habitKeys.map((key, keyIndex) => [key, keyIndex < habitKeys.length - index]));
      const completed = habitKeys.filter((key) => data[key]).length;
      return {
        id: `${profile.id}-${today}`,
        userId: profile.id,
        userEmail: profile.email,
        userRole: profile.role,
        habitDate: today,
        ...data,
        completionPercentage: Math.round((completed / habitKeys.length) * 100),
        allCompleted: completed === habitKeys.length,
        streak: index === 0 ? 2 : index === 1 ? 4 : 1,
        updated: now,
      };
    });
    localStorage.setItem('healthbuddy_daily_habits', JSON.stringify(demoRecords));
    setRefreshKey((value) => value + 1);
    toast.success('Sample local admin data added');
  };

  const completeTodayForSession = () => {
    const currentUser = readJson('healthbuddy_session_user', null);
    if (!currentUser) {
      toast.error('Login or continue as guest before marking habits complete.');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const records = readJson('healthbuddy_daily_habits', []);
    const fullHabits = Object.fromEntries(habitKeys.map((key) => [key, true]));
    const record = {
      id: `${currentUser.id}-${today}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      habitDate: today,
      ...fullHabits,
      completionPercentage: 100,
      allCompleted: true,
      streak: readJson(`healthbuddy_streak_state_${currentUser.id}`, { streak: 0 }).streak || 0,
      updated: new Date().toISOString(),
    };
    const filtered = records.filter((item) => !(item.userId === currentUser.id && item.habitDate === today));
    localStorage.setItem('healthbuddy_daily_habits', JSON.stringify([record, ...filtered].slice(0, 60)));
    setRefreshKey((value) => value + 1);
    toast.success('Today marked complete for the current session user');
  };

  const clearProfilesOnly = () => {
    localStorage.removeItem('healthbuddy_local_profiles');
    setRefreshKey((value) => value + 1);
    toast.success('Local profiles cleared');
  };

  const clearDemoData = () => {
    if (!window.confirm('Clear all local HealthBuddy demo data on this browser?')) return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith('healthbuddy_'))
      .forEach((key) => localStorage.removeItem(key));
    setRefreshKey((value) => value + 1);
    toast.success('Local demo data cleared');
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - HealthBuddy AI</title>
        <meta name="description" content="Local prototype admin dashboard for HealthBuddy AI demo data." />
      </Helmet>
      <Header />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <Badge className="mb-4" variant="secondary">Prototype admin</Badge>
            <h1 className="text-4xl font-bold mb-3">Admin Dashboard</h1>
            <p className="text-muted-foreground max-w-3xl">
              This dashboard reads local browser demo data only. It is useful for presenting how HealthBuddy AI could track users, routines, habits, and streaks in a full product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="metric-card-primary"><CardContent className="p-6"><Users className="w-7 h-7 text-primary mb-3" /><div className="text-3xl font-bold">{data.profiles.length}</div><p className="text-sm text-muted-foreground">Local profiles</p></CardContent></Card>
            <Card><CardContent className="p-6"><Activity className="w-7 h-7 text-secondary mb-3" /><div className="text-3xl font-bold">{data.totalCompletedHabits}</div><p className="text-sm text-muted-foreground">Habits checked locally</p></CardContent></Card>
            <Card><CardContent className="p-6"><BarChart3 className="w-7 h-7 text-primary mb-3" /><div className="text-3xl font-bold">{data.avgCompletion}%</div><p className="text-sm text-muted-foreground">Average completion</p></CardContent></Card>
            <Card><CardContent className="p-6"><Flame className="w-7 h-7 text-accent mb-3" /><div className="text-3xl font-bold">{data.latestRecord?.streak || 0}</div><p className="text-sm text-muted-foreground">Latest streak</p></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>User and activity table</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-3 pr-4">User type</th>
                      <th className="py-3 pr-4">Email / profile</th>
                      <th className="py-3 pr-4">Current streak</th>
                      <th className="py-3 pr-4">Habits today</th>
                      <th className="py-3 pr-4">Last active</th>
                      <th className="py-3 pr-4">Main focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.profiles.map((profile) => {
                      const record = data.habitRecords.find((item) => item.userId === profile.id) || data.latestRecord;
                      const completed = record ? habitKeys.filter((key) => Boolean(record[key])).length : 0;
                      return (
                        <tr key={profile.id || profile.email} className="border-b last:border-b-0">
                          <td className="py-3 pr-4 capitalize">{profile.role || 'user'}</td>
                          <td className="py-3 pr-4">{profile.email || 'Guest'}</td>
                          <td className="py-3 pr-4">{record?.streak || 0}</td>
                          <td className="py-3 pr-4">{completed}/{habitKeys.length}</td>
                          <td className="py-3 pr-4">{profile.lastActiveDate ? new Date(profile.lastActiveDate).toLocaleDateString() : 'Today'}</td>
                          <td className="py-3 pr-4">Hydration, movement, screen balance</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Habit completion summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2"><span>Average habit completion</span><span>{data.avgCompletion}%</span></div>
                  <Progress value={data.avgCompletion} className="h-3" />
                </div>
                <p className="text-sm text-muted-foreground">
                  This panel uses only local browser storage. It does not show fake server users or public statistics.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-primary" />Admin controls</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button onClick={exportData} className="gap-2"><Download className="w-4 h-4" />Export local JSON</Button>
                <Button variant="outline" onClick={seedDemoData} className="gap-2"><UserPlus className="w-4 h-4" />Add sample data</Button>
                <Button variant="outline" onClick={completeTodayForSession} className="gap-2"><CheckCircle2 className="w-4 h-4" />Mark today complete</Button>
                <Button variant="outline" onClick={resetStreaks} className="gap-2"><RotateCcw className="w-4 h-4" />Reset all streaks</Button>
                <Button variant="outline" onClick={clearProfilesOnly} className="gap-2"><Trash2 className="w-4 h-4" />Clear profiles only</Button>
                <Button variant="destructive" onClick={clearDemoData} className="gap-2"><Trash2 className="w-4 h-4" />Clear all local data</Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>Return to main app</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                These controls are for the local prototype only. They do not edit a real database or claim real public usage.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboardPage;
