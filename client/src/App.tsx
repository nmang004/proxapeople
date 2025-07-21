import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import HomePage from "@/pages/home";
import FeaturesPage from "@/pages/features";
import PricingPage from "@/pages/pricing";
import IntegrationsPage from "@/pages/integrations";
import UpdatesPage from "@/pages/updates";
import AboutPage from "@/pages/about";
import BlogPage from "@/pages/blog";
import CareersPage from "@/pages/careers";
import ContactPage from "@/pages/contact";
import HelpPage from "@/pages/help";
import SecurityPage from "@/pages/security";
import StatusPage from "@/pages/status";
import PrivacyPage from "@/pages/privacy";
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
import { Auth0ProtectedRoute } from "@/features/auth/components/auth0-route-guard";
import { Auth0LoginPage } from "@/features/auth/components/auth0-login";
import { Auth0Callback } from "@/features/auth/components/auth0-callback";

function App() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-white">
      <Switch>
        {/* Public Routes */}
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/features">
          <FeaturesPage />
        </Route>
        <Route path="/pricing">
          <PricingPage />
        </Route>
        <Route path="/integrations">
          <IntegrationsPage />
        </Route>
        <Route path="/updates">
          <UpdatesPage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/blog">
          <BlogPage />
        </Route>
        <Route path="/careers">
          <CareersPage />
        </Route>
        <Route path="/contact">
          <ContactPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/security">
          <SecurityPage />
        </Route>
        <Route path="/status">
          <StatusPage />
        </Route>
        <Route path="/privacy">
          <PrivacyPage />
        </Route>
        <Route path="/login">
          <Auth0LoginPage />
        </Route>
        <Route path="/callback">
          <Auth0Callback />
        </Route>

        {/* Protected Routes with MainLayout */}
        <Route path="/dashboard">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/employees">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <EmployeeDirectory />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/org-chart">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <OrgChart />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/reviews">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <PerformanceReviews />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/goals">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Goals />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/one-on-one">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <OneOnOne />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/surveys">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Surveys />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/analytics">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/profile">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Profile />
            </MainLayout>
          </Auth0ProtectedRoute>
        </Route>
        <Route path="/settings">
          <Auth0ProtectedRoute onNavigate={setLocation}>
            <MainLayout>
              <Settings />
            </MainLayout>
          </Auth0ProtectedRoute>
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
