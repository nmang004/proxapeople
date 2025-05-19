import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Separator } from "@/components/ui/separator";
import { EngagementData } from "@/lib/types";

// Sample engagement data for better visual representation
const sampleEngagementData: EngagementData = {
  overall: 8.2,
  categories: [
    { name: "Communication", score: 8.5 },
    { name: "Work Environment", score: 8.7 },
    { name: "Recognition", score: 7.8 },
    { name: "Professional Growth", score: 7.9 },
    { name: "Team Collaboration", score: 8.5 }
  ]
};

export function EngagementScore() {
  const { data, isLoading, error } = useQuery<{ teamEngagement: EngagementData }>({
    queryKey: ['/api/dashboard'],
    select: (data) => ({ 
      teamEngagement: data.teamEngagement || { 
        overall: 0, 
        categories: [] 
      } 
    }),
  });

  // Use sample data for visual representation
  const engagementData = data?.teamEngagement?.overall ? data.teamEngagement : sampleEngagementData;
  const score = engagementData.overall;
  const scorePercentage = (score / 10) * 100;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-heading font-medium text-neutral-800">Team Engagement</CardTitle>
          <div className="flex items-center">
            <span className="text-sm text-neutral-500 mr-2">Last 30 days</span>
            <i className="ri-arrow-down-s-line text-neutral-500"></i>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-neutral-500">Loading engagement data...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">Error loading engagement data</div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <ProgressRing progress={scorePercentage} size={120} strokeWidth={12}>
                <span className="text-3xl font-semibold text-neutral-800">{score.toFixed(1)}</span>
                <span className="text-xs text-neutral-500">out of 10</span>
              </ProgressRing>
            </div>
            
            <div className="space-y-3">
              {engagementData?.categories?.map((category) => (
                <div key={category.name} className="flex justify-between">
                  <span className="text-sm text-neutral-800">{category.name}</span>
                  <span className="text-sm font-medium text-neutral-800">{category.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
            
            <Separator className="mt-4 mb-4" />
            
            <a href="#" className="text-primary text-sm font-medium hover:underline flex items-center justify-center">
              <i className="ri-survey-line mr-1"></i>
              Send New Pulse Survey
            </a>
          </>
        )}
      </CardContent>
    </Card>
  );
}
