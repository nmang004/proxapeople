import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalProgress } from "@/components/ui/goal-progress";
import { Goal } from "@/lib/types";
import { Link } from "wouter";

// Sample team goals for visual representation
const sampleTeamGoals: Goal[] = [
  {
    id: 1,
    title: "Increase customer satisfaction score to 9.2",
    description: "Improve customer experience through product enhancements and support improvements",
    progress: 75,
    currentValue: "8.7",
    targetValue: "9.2",
    dueDate: "2025-08-15",
    owner: "Team",
    type: "team",
    status: "in_progress"
  },
  {
    id: 2,
    title: "Launch new product features (6/8)",
    description: "Complete development and rollout of 8 planned features for Q2",
    progress: 62,
    dueDate: "2025-06-30",
    owner: "Product Development",
    type: "team",
    status: "in_progress"
  },
  {
    id: 3,
    title: "Reduce bug resolution time by 30%",
    description: "Improve testing processes and implement automated test suite",
    progress: 40,
    currentValue: "-12%",
    targetValue: "-30%",
    dueDate: "2025-07-15",
    owner: "Engineering",
    type: "team",
    status: "in_progress"
  },
  {
    id: 4,
    title: "Improve team knowledge sharing",
    description: "Conduct regular knowledge sharing sessions and document best practices",
    progress: 90,
    dueDate: "2025-09-30",
    owner: "All Departments",
    type: "team",
    status: "in_progress"
  }
];

export function TeamGoals() {
  const { data: apiGoals, isLoading, error } = useQuery<Goal[]>({
    queryKey: ['/api/dashboard'],
    select: (data) => data.teamGoals || [],
  });
  
  // Use sample data for visual representation
  const goals = apiGoals?.length ? apiGoals : sampleTeamGoals;

  return (
    <Card className="shadow-sm">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Link href="/goals" className="text-primary text-sm font-medium hover:underline ml-auto">View All</Link>
        </div>
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
