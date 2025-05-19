import { Switch, Route } from "wouter";
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
import MainLayout from "@/components/layout/main-layout";
import PageTransition from "@/components/ui/page-transition";

function App() {
  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <PageTransition>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/employees" component={EmployeeDirectory} />
            <Route path="/reviews" component={PerformanceReviews} />
            <Route path="/goals" component={Goals} />
            <Route path="/one-on-one" component={OneOnOne} />
            <Route path="/surveys" component={Surveys} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;
