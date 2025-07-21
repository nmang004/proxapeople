import { useState } from "react";
import { useAuth } from "@/app/store/auth0-store";
import { Helmet } from 'react-helmet';
import type { EngagementData } from "@/shared/types/types";
import { useDashboardData } from "@/shared/api/useDashboardData";
import { StatsCards } from "@/shared/ui/components/stats-cards";
import { TeamPerformance } from "@/shared/ui/components/team-performance";
import { UpcomingReviews } from "@/shared/ui/components/upcoming-reviews";
import { TeamGoals } from "@/shared/ui/components/team-goals";
import { OneOnOneMeetings } from "@/shared/ui/components/one-on-one-meetings";
import { EngagementScore } from "@/shared/ui/components/engagement-score";
import { PageTransition } from "@/shared/ui/components/page-transition";
import { Button } from "@/shared/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/components/tabs";
import { NewReviewDialog } from "@/shared/ui/components/new-review-dialog";
import { ScheduleMeetingDialog } from "@/shared/ui/components/schedule-meeting-dialog";
import { NewSurveyDialog } from "@/shared/ui/components/new-survey-dialog";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: dashboardData, isLoading, error } = useDashboardData();

  // Mock stats data
  const stats = {
    teamMembers: 156,
    reviewsInProgress: 23,
    activeGoals: 47,
    upcomingOneOnOnes: 12,
  };

  const differences = {
    teamMembers: "+12 from last month",
    reviewsInProgress: "+5 from last week",
    activeGoals: "+8 from last quarter",
    upcomingOneOnOnes: "+2 this week",
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Proxa People Management</title>
        <meta name="description" content="Get a comprehensive overview of your team's performance, goals, and upcoming activities." />
      </Helmet>

      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-heading font-semibold text-neutral-800">Dashboard</h1>
              <p className="text-neutral-500 mt-1">Welcome back! Here's what's happening with your team.</p>
            </div>
            
            <div className="flex gap-2">
              <NewReviewDialog />
              <ScheduleMeetingDialog />
              <NewSurveyDialog />
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards 
            stats={stats} 
            differences={differences} 
            isLoading={isLoading} 
          />

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EngagementScore 
                  data={dashboardData?.teamEngagement as EngagementData} 
                  isLoading={isLoading} 
                  error={error}
                />
                <TeamPerformance 
                  data={dashboardData?.teamPerformance as any} 
                  isLoading={isLoading} 
                  error={error}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingReviews 
                  data={dashboardData?.upcomingReviews as any[]} 
                  isLoading={isLoading} 
                  error={error}
                />
                <OneOnOneMeetings meetings={dashboardData?.upcomingOneOnOnes} isLoading={isLoading} error={error} />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <TeamPerformance 
                  data={dashboardData?.teamPerformance as any} 
                  isLoading={isLoading} 
                  error={error}
                />
                <EngagementScore 
                  data={dashboardData?.teamEngagement as EngagementData} 
                  isLoading={isLoading} 
                  error={error}
                />
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <TeamGoals goals={dashboardData?.teamGoals as any} isLoading={isLoading} error={error} />
            </TabsContent>

            <TabsContent value="meetings" className="space-y-6">
              <OneOnOneMeetings meetings={dashboardData?.upcomingOneOnOnes as any} isLoading={isLoading} error={error} />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </>
  );
}