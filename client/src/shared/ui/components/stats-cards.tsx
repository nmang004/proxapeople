import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    teamMembers: number;
    reviewsInProgress: number;
    activeGoals: number;
    upcomingOneOnOnes: number;
  };
  differences: {
    teamMembers: string;
    reviewsInProgress: string;
    activeGoals: string;
    upcomingOneOnOnes: string;
  };
  isLoading?: boolean;
}

export function StatsCards({ stats, differences, isLoading = false }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Team Members Card */}
      <Card className="p-4 sm:p-5 border-none shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Team Members</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl sm:text-3xl font-semibold">{isLoading ? "..." : stats.teamMembers}</span>
              <span className="ml-2 text-xs text-green-600 truncate">{differences.teamMembers}</span>
            </div>
          </div>
          <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary sm:w-6 sm:h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>
      </Card>
      
      {/* Reviews In Progress Card */}
      <Card className="p-4 sm:p-5 border-none shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Reviews In Progress</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl sm:text-3xl font-semibold">{isLoading ? "..." : stats.reviewsInProgress}</span>
              <span className="ml-2 text-xs text-muted-foreground truncate">{differences.reviewsInProgress}</span>
            </div>
          </div>
          <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary sm:w-6 sm:h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: '65%' }}
            />
          </div>
        </div>
      </Card>
      
      {/* Active Goals Card */}
      <Card className="p-4 sm:p-5 border-none shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Active Goals</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl sm:text-3xl font-semibold">{isLoading ? "..." : stats.activeGoals}</span>
              <span className="ml-2 text-xs text-amber-600 truncate">{differences.activeGoals}</span>
            </div>
          </div>
          <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary sm:w-6 sm:h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
        </div>
      </Card>
      
      {/* Upcoming 1:1s Card */}
      <Card className="p-4 sm:p-5 border-none shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Upcoming 1:1s</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl sm:text-3xl font-semibold">{isLoading ? "..." : stats.upcomingOneOnOnes}</span>
              <span className="ml-2 text-xs text-green-600 truncate">{differences.upcomingOneOnOnes}</span>
            </div>
          </div>
          <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary sm:w-6 sm:h-6"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 7v5l3 3"></path></svg>
          </div>
        </div>
      </Card>
    </div>
  );
}
