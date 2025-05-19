import { Switch, Route, Redirect, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import EmployeeDirectory from "@/pages/employee-directory";
import PerformanceReviews from "@/pages/performance-reviews";
import Goals from "@/pages/goals";
import OneOnOne from "@/pages/one-on-one";
import Surveys from "@/pages/surveys";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import HomePage from "@/pages/home";
import MainLayout from "@/components/layout/main-layout";
import PageTransition from "@/components/ui/page-transition";

function App() {
  return (
    <Switch>
      {/* Home Page Route */}
      <Route path="/" exact>
        <AnimatePresence mode="wait">
          <PageTransition>
            <HomePage />
          </PageTransition>
        </AnimatePresence>
      </Route>
      
      {/* Dashboard Routes */}
      <Route path="/dashboard">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Dashboard />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      <Route path="/employees">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <EmployeeDirectory />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      <Route path="/reviews">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <PerformanceReviews />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      <Route path="/goals">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Goals />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      <Route path="/one-on-one">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <OneOnOne />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      <Route path="/surveys">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Surveys />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      <Route path="/analytics">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Analytics />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      <Route path="/settings">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Settings />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      {/* Not Found Route */}
      <Route path="/404">
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <NotFound />
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      </Route>
      
      {/* Fallback Route */}
      <Route>
        <Redirect to="/404" />
      </Route>
    </Switch>
  );
}

export default App;
