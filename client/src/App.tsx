import { Switch, Route } from "wouter";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/(auth)/login";
import ResetPasswordPage from "@/pages/(auth)/reset-password";
import Dashboard from "@/pages/(app)/dashboard";
import EmployeeDirectory from "@/pages/(app)/employee-directory";
import OrgChart from "@/pages/(app)/org-chart";
import PerformanceReviews from "@/pages/(app)/performance-reviews";
import Goals from "@/pages/(app)/goals";
import OneOnOne from "@/pages/(app)/one-on-one";
import Surveys from "@/pages/(app)/surveys";
import Analytics from "@/pages/(app)/analytics";
import Profile from "@/pages/(app)/profile";
import Settings from "@/pages/(app)/settings";
import NotFound from "@/pages/not-found";
import MainLayout from "@/shared/ui/components/main-layout";
import { ProtectedRoute } from "@/features/auth/components/route-guard";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Switch>
        {/* Public Routes */}
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/reset-password">
          <ResetPasswordPage />
        </Route>

        {/* Protected Routes with MainLayout */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/employees">
          <ProtectedRoute>
            <MainLayout>
              <EmployeeDirectory />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/org-chart">
          <ProtectedRoute>
            <MainLayout>
              <OrgChart />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/reviews">
          <ProtectedRoute>
            <MainLayout>
              <PerformanceReviews />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/goals">
          <ProtectedRoute>
            <MainLayout>
              <Goals />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/one-on-one">
          <ProtectedRoute>
            <MainLayout>
              <OneOnOne />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/surveys">
          <ProtectedRoute>
            <MainLayout>
              <Surveys />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/analytics">
          <ProtectedRoute>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        </Route>

        {/* 404 Not Found - Must be last */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
