import { useQuery } from "@tanstack/react-query";
// Removed card imports as we're handling this at the dashboard level
import { Button } from "@/components/ui/button";
import { GoalProgress } from "@/components/ui/goal-progress";
import { Goal } from "@shared/schema";
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
    startDate: "2025-01-01",
    dueDate: "2025-08-15",
    status: "in_progress",
    userId: null,
    teamId: 1,
    departmentId: null,
    isCompanyGoal: false,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 2,
    title: "Launch new product features (6/8)",
    description: "Complete development and rollout of 8 planned features for Q2",
    progress: 62,
    startDate: "2025-01-01",
    dueDate: "2025-06-30",
    status: "in_progress",
    userId: null,
    teamId: 2,
    departmentId: null,
    currentValue: null,
    targetValue: null,
    isCompanyGoal: false,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 3,
    title: "Reduce bug resolution time by 30%",
    description: "Improve testing processes and implement automated test suite",
    progress: 40,
    currentValue: "-12%",
    targetValue: "-30%",
    startDate: "2025-01-01",
    dueDate: "2025-07-15",
    status: "in_progress",
    userId: null,
    teamId: 3,
    departmentId: null,
    isCompanyGoal: false,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 4,
    title: "Improve team knowledge sharing",
    description: "Conduct regular knowledge sharing sessions and document best practices",
    progress: 90,
    startDate: "2025-01-01",
    dueDate: "2025-09-30",
    status: "in_progress",
    userId: null,
    teamId: null,
    departmentId: 1,
    currentValue: null,
    targetValue: null,
    isCompanyGoal: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z")
  }
];

export function TeamGoals() {
  const { data: apiGoals, isLoading, error } = useQuery<Goal[]>({
    queryKey: ['/api/dashboard'],
    select: (data: any) => data?.teamGoals || [],
  });
  
  // Use sample data for visual representation
  const goals = apiGoals?.length ? apiGoals : sampleTeamGoals;

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full p-1">
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
      </div>
    </div>
  );
}
