import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalProgress } from "@/components/ui/goal-progress";
import { Goal } from "@/lib/types";

export function TeamGoals() {
  const { data: goals, isLoading, error } = useQuery<Goal[]>({
    queryKey: ['/api/dashboard'],
    select: (data) => data.teamGoals || [],
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-heading font-medium text-neutral-800">Team Goals</CardTitle>
          <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-neutral-500">Loading goals...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">Error loading goals</div>
        ) : goals && goals.length > 0 ? (
          <div className="space-y-5">
            {/* Sample goals for demonstration */}
            <GoalProgress 
              title="Increase customer satisfaction score to 9.2" 
              progress={75} 
              currentValue="8.7" 
              targetValue="9.2" 
            />
            
            <GoalProgress 
              title="Launch new product features (6/8)" 
              progress={62} 
              dueDate="Dec 15" 
            />
            
            <GoalProgress 
              title="Reduce bug resolution time by 30%" 
              progress={40} 
              currentValue="-12%" 
              targetValue="-30%" 
            />
            
            <GoalProgress 
              title="Improve team knowledge sharing" 
              progress={90} 
              isOngoing={true} 
              dueDate="14 sessions completed" 
            />
          </div>
        ) : (
          <div className="py-4 text-center text-neutral-500">No team goals found</div>
        )}
        
        <Button className="mt-5 w-full py-2 bg-secondary text-primary text-sm font-medium rounded-md hover:bg-primary hover:text-white transition-colors duration-200">
          Add New Goal
        </Button>
      </CardContent>
    </Card>
  );
}
