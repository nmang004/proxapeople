// Goal card component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@shared/schema";

interface GoalCardProps {
  goal: Goal;
  onViewDetails?: (id: number) => void;
}

// Helper function to format status for display
const formatStatus = (status: string): string => {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    case 'not_started':
      return 'Not Started';
    case 'completed':
      return 'Completed';
    case 'on_hold':
      return 'On Hold';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Helper function to get status variant for Badge
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'completed':
      return 'default'; // Green
    case 'in_progress':
      return 'secondary'; // Blue
    case 'not_started':
      return 'outline'; // Gray
    case 'on_hold':
    case 'cancelled':
      return 'destructive'; // Red
    default:
      return 'outline';
  }
};

export function GoalCard({ goal, onViewDetails }: GoalCardProps) {
  const progressValue = goal.progress || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{goal.title}</CardTitle>
        <Badge variant={getStatusVariant(goal.status)}>{formatStatus(goal.status)}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goal.description && (
            <p className="text-sm text-gray-600">{goal.description}</p>
          )}
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} />
          </div>

          {goal.dueDate && (
            <p className="text-sm">
              <strong>Due:</strong> {new Date(goal.dueDate).toLocaleDateString()}
            </p>
          )}

          {onViewDetails && (
            <Button 
              variant="outline" 
              onClick={() => onViewDetails(goal.id)}
              className="w-full"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}