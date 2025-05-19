import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@shared/schema";
import { MoreHorizontal, ChevronRight } from "lucide-react";

interface GoalCardProps {
  goal: Partial<Goal>;
  onClick: () => void;
  assignee?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export function GoalCard({ goal, onClick, assignee }: GoalCardProps) {
  const [progress, setProgress] = useState(goal.progress || 0);
  
  const getStatusBadge = () => {
    switch (goal.status) {
      case 'active':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">Completed</Badge>;
      case 'at_risk':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">At Risk</Badge>;
      case 'behind':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Behind</Badge>;
      default:
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-700 hover:bg-neutral-50 border-neutral-200">Draft</Badge>;
    }
  };
  
  const getProgressColor = () => {
    if (progress >= 100) return "bg-emerald-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatDate = (date?: string) => {
    if (!date) return "No date set";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="relative overflow-hidden mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {assignee && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback>
                  {assignee.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              <h3 className="font-medium text-neutral-900 line-clamp-1">{goal.title}</h3>
              <p className="text-sm text-neutral-500">
                {assignee ? assignee.name : "Unassigned"} • 
                {goal.category === 'okr' ? " OKR" : 
                 goal.category === 'personal' ? " Personal" : 
                 goal.category === 'team' ? " Team" : 
                 " Goal"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm mb-4 line-clamp-2 text-neutral-700">
          {goal.description || "No description provided."}
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-neutral-600">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className={getProgressColor()} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500 mb-1">Start Date</p>
              <p>{formatDate(goal.startDate)}</p>
            </div>
            <div>
              <p className="text-neutral-500 mb-1">Due Date</p>
              <p>{formatDate(goal.dueDate)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-3 bg-neutral-50 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary-dark ml-auto flex items-center"
          onClick={onClick}
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}