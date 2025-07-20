import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
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
import { useAuthStore } from "@/app/store/auth";

function App() {
  console.log("🚀 App.tsx: Component starting to render");
  
  const { initializeAuth } = useAuthStore();
  const [, setLocation] = useLocation();
  
  // Initialize auth after component mounts and router is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("🚀 App.tsx: Initializing auth with delay");
      initializeAuth().catch((error) => {
        console.error("🚀 App.tsx: Failed to initialize auth:", error);
      });
    }, 100); // Small delay to ensure router is ready
    
    return () => clearTimeout(timer);
  }, [initializeAuth]);
  
  console.log("🚀 App.tsx: About to render Switch component");
  
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
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/employees">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <EmployeeDirectory />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/org-chart">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <OrgChart />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/reviews">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <PerformanceReviews />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/goals">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Goals />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/one-on-one">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <OneOnOne />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/surveys">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Surveys />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/analytics">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute onNavigate={setLocation}>
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
