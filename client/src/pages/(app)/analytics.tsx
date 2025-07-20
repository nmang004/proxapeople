import { Helmet } from 'react-helmet';
import { AnalyticsDashboard } from '@/features/analytics';

export default function Analytics() {
  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | Proxa People Management</title>
        <meta name="description" content="Comprehensive analytics dashboard for tracking and understanding employee performance, engagement, and growth metrics." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-semibold text-neutral-800">Analytics Dashboard</h1>
          <p className="text-neutral-500 mt-1">Track team performance, engagement, and growth with key metrics</p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </>
  );
}