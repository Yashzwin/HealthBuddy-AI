import React from 'react';
import { Route, Routes, HashRouter as Router, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageTransition from '@/components/PageTransition';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import RoutineAssessmentPage from '@/pages/RoutineAssessmentPage';
import DashboardPage from '@/pages/DashboardPage';
import DailyPlanPage from '@/pages/DailyPlanPage';
import HabitTrackerPage from '@/pages/HabitTrackerPage';
import AICoachPage from '@/pages/AICoachPage';
import PublicHealthImpactPage from '@/pages/PublicHealthImpactPage';
import SafetyPolicyPage from '@/pages/SafetyPolicyPage';
import AboutPage from '@/pages/AboutPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import StatisticsPage from '@/pages/StatisticsPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname + location.hash}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
        <Route path="/safety" element={<PageTransition><SafetyPolicyPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />

        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <PageTransition><RoutineAssessmentPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAssessment>
              <ErrorBoundary>
                <PageTransition><DashboardPage /></PageTransition>
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-plan"
          element={
            <ProtectedRoute requireAssessment>
              <PageTransition><DailyPlanPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute requireAssessment>
              <PageTransition><HabitTrackerPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach"
          element={
            <ProtectedRoute requireAssessment>
              <PageTransition><AICoachPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/impact"
          element={
            <ProtectedRoute requireAssessment>
              <PageTransition><PublicHealthImpactPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <ErrorBoundary>
                <PageTransition><AdminDashboardPage /></PageTransition>
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute requireAssessment>
              <PageTransition><StatisticsPage /></PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AnimatedRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
