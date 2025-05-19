import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export function TeamPerformance() {
  const [timeRange, setTimeRange] = useState<TimeRange>('quarterly');
  
  const { data, isLoading, error } = useQuery<{ teamPerformance: PerformanceData }>({
    queryKey: ['/api/dashboard'],
    select: (data) => ({ teamPerformance: data.teamPerformance || { quarterly: [] } }),
  });

  // Use mock data for visual presentation until the API provides real data
  const performanceData = timeRange === 'quarterly' 
    ? mockPerformanceData.quarterly 
    : mockPerformanceData.monthly.slice(0, 6);

  return (
    <Card className="shadow-sm">
      <CardContent>
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
            <p className="text-neutral-500">Loading performance data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-red-500">Error loading performance data</p>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="relative aspect-video bg-neutral-50 rounded border border-neutral-100 flex items-center justify-center">
              <div className="h-full w-full px-2 py-4">
                {/* Simulated Bar Chart */}
                <div className="h-full flex items-end justify-between gap-1">
                  {performanceData.map((item, index) => (
                    <div key={index} className="w-1/5 flex flex-col items-center">
                      <div 
                        className={cn(
                          "w-full rounded-t-md", 
                          index % 2 === 0 ? "bg-primary" : "bg-primary-dark",
                          index === performanceData.length - 1 && "animate-pulse-slow"
                        )} 
                        style={{ height: `${(item.overallScore / 10) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-neutral-500">
                        {timeRange === 'quarterly' 
                          ? (`Q${index + 1} ${index === performanceData.length - 1 ? '(Current)' : ''}`)
                          : (item as any).month
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-500">
                <span>10</span>
                <span>7.5</span>
                <span>5</span>
                <span>2.5</span>
                <span>0</span>
              </div>
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-primary rounded-sm mr-2"></span>
                <span className="text-sm text-neutral-600">Overall Score</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-primary-dark rounded-sm mr-2"></span>
                <span className="text-sm text-neutral-600">Growth Score</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
