import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/store/auth0-store";
import { TokenManager } from "../auth/token-manager";
import { analytics } from "./endpoints";

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
  const [hasToken, setHasToken] = useState(false);

  // Monitor token availability
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const checkToken = () => {
        const token = TokenManager.getToken();
        const tokenAvailable = !!token;
        console.log('🔍 useDashboardData: Token check -', tokenAvailable ? 'Available' : 'Not available');
        setHasToken(tokenAvailable);
        return tokenAvailable;
      };

      // Check immediately
      if (checkToken()) {
        return; // Token is available, no need for polling
      }

      // Poll for token availability every 100ms for up to 5 seconds
      const interval = setInterval(() => {
        if (checkToken()) {
          clearInterval(interval);
        }
      }, 100);

      // Cleanup after 5 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        console.warn('⚠️ useDashboardData: Token not available after 5 seconds');
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setHasToken(false);
    }
  }, [isAuthenticated, authLoading]);

  const query = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      console.log('📊 useDashboardData: Making API call for dashboard data');
      const response = await analytics.dashboardData.execute();
      // Backend returns the data directly, not wrapped in another object
      return response;
    },
    // Only enable the query when authenticated AND we have a token
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: 1,
    retryDelay: 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading || (isAuthenticated && !authLoading && !hasToken),
    error: query.error as Error | null,
    isError: query.isError,
  };
}