import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/store/auth0-store";

interface DashboardData {
  teamEngagement?: any;
  teamPerformance?: any;
  upcomingReviews?: any[];
  upcomingOneOnOnes?: any[];
  teamGoals?: any[];
}

interface UseDashboardDataReturn {
  data: DashboardData | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export function useDashboardData(): UseDashboardDataReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const query = useQuery<DashboardData>({
    queryKey: ['/api/v2/dashboard/summary'],
    enabled: isAuthenticated && !authLoading,
    retry: 1,
    retryDelay: 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    isError: query.isError,
  };
}