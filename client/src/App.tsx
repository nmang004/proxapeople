import { Switch, Route, Redirect } from "wouter";
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
  // Function to determine if we should show the dashboard layout
  const showDashboardLayout = (path: string) => {
    return path !== "/" && !path.startsWith("/?") && !path.startsWith("/404");
  };

  // Get current location
  const currentPath = window.location.pathname;
  
  return (
    <>
      {showDashboardLayout(currentPath) ? (
        <MainLayout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/employees" component={EmployeeDirectory} />
                <Route path="/reviews" component={PerformanceReviews} />
                <Route path="/goals" component={Goals} />
                <Route path="/one-on-one" component={OneOnOne} />
                <Route path="/surveys" component={Surveys} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/settings" component={Settings} />
                <Route path="/404" component={NotFound} />
                <Route path="/:rest*">
                  {(params) => <Redirect to="/404" />}
                </Route>
              </Switch>
            </PageTransition>
          </AnimatePresence>
        </MainLayout>
      ) : (
        <AnimatePresence mode="wait">
          <PageTransition>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/404" component={NotFound} />
            </Switch>
          </PageTransition>
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
