import { useQuery } from "@tanstack/react-query";
import { DataCard } from "@/components/ui/data-card";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
  teamCount: number;
  reviewsInProgress: number;
  activeGoals: number;
  engagementScore: number;
}

export function StatsCards() {
  const { data, isLoading, error } = useQuery<{ stats: DashboardStats }>({
    queryKey: ['/api/dashboard'],
    select: (data) => ({ 
      stats: {
        teamCount: data.stats?.teamCount || 0,
        reviewsInProgress: data.stats?.reviewsInProgress || 0,
        activeGoals: data.stats?.activeGoals || 0,
        engagementScore: data.stats?.engagementScore || 0
      } 
    }),
  });

  const stats = data?.stats;
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Team Members Card */}
      <DataCard
        title="Team Members"
        value={isLoading ? "..." : stats?.teamCount || 0}
        icon={<i className="ri-team-line text-xl"></i>}
        footer={
          <span className="text-sm text-success flex items-center">
            <i className="ri-arrow-up-line mr-1"></i>
            +2 since last month
          </span>
        }
      />
      
      {/* Reviews In Progress Card */}
      <DataCard
        title="Reviews In Progress"
        value={isLoading ? "..." : stats?.reviewsInProgress || 0}
        icon={<i className="ri-file-list-3-line text-xl"></i>}
        footer={
          <div>
            <Progress value={65} className="h-2 mb-1" />
            <span className="text-sm text-neutral-500 mt-1 block">65% completion rate</span>
          </div>
        }
      />
      
      {/* Active Goals Card */}
      <DataCard
        title="Active Goals"
        value={isLoading ? "..." : stats?.activeGoals || 0}
        icon={<i className="ri-flag-line text-xl"></i>}
        footer={
          <span className="text-sm text-warning flex items-center">
            <i className="ri-time-line mr-1"></i>
            4 due this week
          </span>
        }
      />
      
      {/* Engagement Score Card */}
      <DataCard
        title="Engagement Score"
        value={isLoading ? "..." : stats?.engagementScore?.toFixed(1) || 0}
        icon={<i className="ri-heart-pulse-line text-xl"></i>}
        footer={
          <span className="text-sm text-success flex items-center">
            <i className="ri-arrow-up-line mr-1"></i>
            +0.4 since last survey
          </span>
        }
      />
    </div>
  );
}
