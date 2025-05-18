import { StatsCards } from "@/components/dashboard/stats-cards";
import { TeamPerformance } from "@/components/dashboard/team-performance";
import { UpcomingReviews } from "@/components/dashboard/upcoming-reviews";
import { TeamGoals } from "@/components/dashboard/team-goals";
import { OneOnOneMeetings } from "@/components/dashboard/one-on-one-meetings";
import { EngagementScore } from "@/components/dashboard/engagement-score";
import { Helmet } from 'react-helmet';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard | Proxa People Management</title>
        <meta name="description" content="Proxa dashboard showing team performance, upcoming reviews, goals, and engagement metrics." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Welcome back, Ashley! Here's an overview of your team's progress.</p>
      </div>
      
      {/* Stats Cards Section */}
      <StatsCards />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Team Performance & Upcoming Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <TeamPerformance />
          <UpcomingReviews />
        </div>
        
        {/* Right Column - Team Goals & 1:1 Meetings */}
        <div className="space-y-6">
          <TeamGoals />
          <OneOnOneMeetings />
          <EngagementScore />
        </div>
      </div>
    </>
  );
}
