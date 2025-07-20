// Goal detail component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@shared/schema";

interface GoalDetailProps {
  goal: Goal;
}

export function GoalDetail({ goal }: GoalDetailProps) {
  const progressValue = goal.progress || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
        <Badge variant="outline">{goal.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goal.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p>{goal.description}</p>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-2">Progress</h4>
            <div className="flex justify-between text-sm mb-2">
              <span>Completion</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {goal.dueDate && (
              <div>
                <h4 className="font-semibold">Due Date</h4>
                <p>{new Date(goal.dueDate).toLocaleDateString()}</p>
              </div>
            )}
            
            <div>
              <h4 className="font-semibold">Owner</h4>
              <p>User ID: {goal.userId}</p>
            </div>
          </div>

          {goal.departmentId && (
            <div>
              <h4 className="font-semibold">Department</h4>
              <p>Department ID: {goal.departmentId}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}