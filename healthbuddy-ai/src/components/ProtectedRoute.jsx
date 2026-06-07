import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ASSESSMENT_REQUIRED_MESSAGE, hasCompletedAssessment } from '@/lib/assessmentStatus';
import { ClipboardList, Lock } from 'lucide-react';

const CompleteAssessmentFirst = () => (
  <>
    <Header />
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <Card className="wellness-card border-primary/20 text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-3xl">{ASSESSMENT_REQUIRED_MESSAGE}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-muted-foreground">
              Dashboard, habits, coach, and plan pages open only after your routine assessment is completed.
            </p>
            <Link to="/assessment">
              <Button className="gap-2">
                <ClipboardList className="h-4 w-4" />
                Go to Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
    <Footer />
  </>
);

const AdminOnly = () => (
  <>
    <Header />
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <Card className="wellness-card border-amber-300/40 text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
              <Lock className="h-7 w-7 text-amber-600" />
            </div>
            <CardTitle className="text-3xl">Admin access required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-muted-foreground">
              The Admin Dashboard is only available to signed-in admin accounts. Sign in with an admin email to continue.
            </p>
            <Link to="/">
              <Button className="gap-2">Back to home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
    <Footer />
  </>
);

const ProtectedRoute = ({ children, requireAssessment = false, requireAdmin = false }) => {
  const { currentUser, initialLoading } = useAuth();
  const location = useLocation();

  if (initialLoading) return null;
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return <AdminOnly />;
  }

  if (requireAssessment && currentUser.role !== 'admin' && !hasCompletedAssessment(currentUser)) {
    return <CompleteAssessmentFirst />;
  }

  return children;
};

export default ProtectedRoute;
