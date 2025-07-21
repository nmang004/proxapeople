import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/shared/ui/components/empty-state";
import { Spinner } from "@/shared/ui/components/spinner";
import { ErrorMessage } from "@/shared/ui/components/error-message";
import { TrendingUp } from "lucide-react";

type TimeRange = 'monthly' | 'quarterly';

interface PerformanceData {
  quarterly: {
    quarter: string;
    overallScore: number;
    growthScore: number;
  }[];
  monthly: {
    month: string;
    overallScore: number;
    growthScore: number;
  }[];
  summary?: {
    currentScore: number;
    previousScore: number;
    trend: 'positive' | 'negative' | 'stable';
    improvement: number;
    topPerformingArea: string;
    focusArea: string;
  };
}

// Mock performance data for visual presentation
const mockPerformanceData = {
  quarterly: [
    { quarter: "Q1", overallScore: 7.2, growthScore: 6.8 },
    { quarter: "Q2", overallScore: 7.8, growthScore: 7.2 },
    { quarter: "Q3", overallScore: 8.5, growthScore: 8.2 },
    { quarter: "Q4", overallScore: 9.1, growthScore: 8.8 }
  ],
  monthly: [
    { month: "Jan", overallScore: 7.0, growthScore: 6.5 },
    { month: "Feb", overallScore: 7.3, growthScore: 6.8 },
    { month: "Mar", overallScore: 7.5, growthScore: 7.0 },
    { month: "Apr", overallScore: 7.6, growthScore: 7.2 },
    { month: "May", overallScore: 7.9, growthScore: 7.5 },
    { month: "Jun", overallScore: 8.2, growthScore: 7.8 }
  ]
};

interface TeamPerformanceProps {
  data?: PerformanceData;
  isLoading?: boolean;
  error?: Error | null;
}

export function TeamPerformance({ data, isLoading = false, error = null }: TeamPerformanceProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('quarterly');

  // Use actual data if available, otherwise fall back to mock data
  const performanceData = data?.[timeRange] || (timeRange === 'quarterly' 
    ? mockPerformanceData.quarterly 
    : mockPerformanceData.monthly.slice(0, 6));

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full p-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "px-3 py-1 text-sm rounded-md border", 
                timeRange === 'monthly' ? "border-primary bg-secondary text-primary" : "border-neutral-200 bg-white"
              )}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "px-3 py-1 text-sm rounded-md border", 
                timeRange === 'quarterly' ? "border-primary bg-secondary text-primary" : "border-neutral-200 bg-white"
              )}
              onClick={() => setTimeRange('quarterly')}
            >
              Quarterly
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage 
            title="Failed to load performance data"
            message={error.message || "Unable to fetch team performance trends. Please try again later."}
          />
        ) : performanceData.length === 0 ? (
          <EmptyState
            icon={<TrendingUp className="h-12 w-12" />}
            title="No performance data available"
            description="Performance trends will appear here once data is collected."
          />
        ) : (
          <div className="space-y-6">
            {/* Performance Summary Cards */}
            {data?.summary && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Current Score</p>
                      <p className="text-2xl font-semibold text-neutral-900">{data.summary.currentScore}</p>
                    </div>
                    <div className={cn(
                      "text-sm px-2 py-1 rounded-full",
                      data.summary.trend === 'positive' ? "bg-green-100 text-green-700" :
                      data.summary.trend === 'negative' ? "bg-red-100 text-red-700" : 
                      "bg-neutral-100 text-neutral-700"
                    )}>
                      {data.summary.trend === 'positive' ? '+' : data.summary.trend === 'negative' ? '-' : '±'}
                      {Math.abs(data.summary.improvement)}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                  <div>
                    <p className="text-sm text-neutral-600">Focus Area</p>
                    <p className="text-lg font-medium text-neutral-900">{data.summary.focusArea}</p>
                    <p className="text-xs text-neutral-500 mt-1">Needs improvement</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Chart */}
            <div className="relative bg-white rounded-lg border border-neutral-200 p-4">
              <div className="h-64 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-500 pr-2">
                  <span>10</span>
                  <span>8</span>
                  <span>6</span>
                  <span>4</span>
                  <span>2</span>
                  <span>0</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-8 h-full flex items-end justify-between gap-2">
                  {performanceData.map((item, index) => {
                    const maxHeight = 240; // Height of chart area
                    const overallHeight = (item.overallScore / 10) * maxHeight;
                    const growthHeight = (item.growthScore / 10) * maxHeight;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full flex justify-center gap-1 mb-2">
                          {/* Overall Score Bar */}
                          <div className="relative">
                            <div 
                              className={cn(
                                "w-4 rounded-t-sm transition-all duration-500 ease-out",
                                "bg-gradient-to-t from-blue-500 to-blue-400",
                                "hover:from-blue-600 hover:to-blue-500",
                                index === performanceData.length - 1 && timeRange === 'quarterly' && "ring-2 ring-blue-300"
                              )}
                              style={{ height: `${overallHeight}px` }}
                            />
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Overall: {item.overallScore}
                            </div>
                          </div>
                          
                          {/* Growth Score Bar */}
                          <div className="relative">
                            <div 
                              className={cn(
                                "w-4 rounded-t-sm transition-all duration-500 ease-out",
                                "bg-gradient-to-t from-purple-500 to-purple-400",
                                "hover:from-purple-600 hover:to-purple-500",
                                index === performanceData.length - 1 && timeRange === 'quarterly' && "ring-2 ring-purple-300"
                              )}
                              style={{ height: `${growthHeight}px` }}
                            />
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Growth: {item.growthScore}
                            </div>
                          </div>
                        </div>
                        
                        {/* X-axis label */}
                        <span className={cn(
                          "text-xs text-neutral-500 text-center",
                          index === performanceData.length - 1 && timeRange === 'quarterly' && "font-medium text-neutral-700"
                        )}>
                          {timeRange === 'quarterly' 
                            ? (`${item.quarter}${index === performanceData.length - 1 ? ' (Current)' : ''}`)
                            : (item as any).month
                          }
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Chart Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center">
                  <div className="w-4 h-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-neutral-600">Overall Score</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-3 bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-neutral-600">Growth Score</span>
                </div>
              </div>
            </div>
            
            {/* Performance Insights */}
            {data?.summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Performance Insights</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Team performance is trending {data.summary.trend} with <strong>{data.summary.topPerformingArea}</strong> being 
                      the top performing area. Focus on improving <strong>{data.summary.focusArea}</strong> for better overall results.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
