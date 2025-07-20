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

export function GoalCard({ goal, onViewDetails }: GoalCardProps) {
  const progressValue = goal.progress || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{goal.title}</CardTitle>
        <Badge variant="outline">{goal.status}</Badge>
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