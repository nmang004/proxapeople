import { Helmet } from 'react-helmet';
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default function Analytics() {
  return (
    <>
      <Helmet>
        <title>Analytics | Proxa People Management</title>
        <meta name="description" content="Gain insights from comprehensive analytics on employee engagement, performance trends, and goal progress." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Analytics</h1>
        <p className="text-neutral-500 mt-1">Track and analyze people data across your organization</p>
      </div>
      
      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </>
  );
}