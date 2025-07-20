import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Goal } from "@shared/schema";
import { 
  CalendarDays, 
  Flag, 
  BarChart3, 
  Edit, 
  Save, 
  CheckCircle2, 
  XCircle, 
  MessageCircle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GoalDetailProps {
  goal: Partial<Goal>;
  open: boolean;
  onClose: () => void;
  assignee?: {
    id: number;
    name: string;
    title?: string;
    avatar?: string;
  };
  owner?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export function GoalDetail({
  goal,
  open,
  onClose,
  assignee,
  owner
}: GoalDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(goal.progress || 0);
  const [notes, setNotes] = useState(goal.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = () => {
    switch (goal.status) {
      case 'in_progress':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">Completed</Badge>;
      case 'not_started':
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-700 hover:bg-neutral-50 border-neutral-200">Not Started</Badge>;
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
  
  const handleSave = async () => {
    if (!goal.id) return;
    
    setIsSubmitting(true);
    try {
      const updatedGoal = {
        ...goal,
        progress,
        notes
      };
      
      await apiRequest('PATCH', `/api/goals/${goal.id}`, updatedGoal);
      
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set of key results for OKR display
  const keyResults = [
    { id: 1, title: "Increase user engagement by 25%", progress: 65, status: "active" },
    { id: 2, title: "Reduce bounce rate by 15%", progress: 40, status: "behind" },
    { id: 3, title: "Improve conversion rate to 5%", progress: 80, status: "active" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl mr-2">{goal.title}</DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription className="text-neutral-700">
            {goal.description || "No description provided for this goal."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Goal Meta Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-neutral-500 flex items-center gap-1 mb-1">
                <CalendarDays size={14} /> Start Date
              </span>
              <span>{formatDate(goal.startDate)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500 flex items-center gap-1 mb-1">
                <CalendarDays size={14} /> Due Date
              </span>
              <span>{formatDate(goal.dueDate)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500 flex items-center gap-1 mb-1">
                <Flag size={14} /> Category
              </span>
              <span>
                Project Goal
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500 flex items-center gap-1 mb-1">
                <BarChart3 size={14} /> Priority
              </span>
              <span>
                {goal.priority === 'high' ? 'High' :
                 goal.priority === 'medium' ? 'Medium' :
                 goal.priority === 'low' ? 'Low' : 'Not set'}
              </span>
            </div>
          </div>
          
          {/* Assignee and Owner */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between py-3 border-y border-neutral-100">
            {assignee && (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                  <AvatarFallback>
                    {assignee.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-neutral-500">Assignee</p>
                  <p className="font-medium">{assignee.name}</p>
                  {assignee.title && <p className="text-xs text-neutral-500">{assignee.title}</p>}
                </div>
              </div>
            )}
            
            {owner && (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={owner.avatar} alt={owner.name} />
                  <AvatarFallback>
                    {owner.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-neutral-500">Created by</p>
                  <p className="font-medium">{owner.name}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Progress</h3>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={14} className="mr-1" />
                  Update
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setProgress(goal.progress || 0);
                      setNotes(goal.notes || "");
                      setIsEditing(false);
                    }}
                  >
                    <XCircle size={14} className="mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSave}
                    disabled={isSubmitting}
                  >
                    <Save size={14} className="mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-500 mb-1 block">
                    Progress Percentage
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={progress} 
                      onChange={(e) => setProgress(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{progress}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-neutral-500 mb-1 block">
                    Notes & Updates
                  </label>
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about recent progress..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-neutral-600">
                      {progress === 100 ? (
                        <span className="flex items-center text-emerald-600">
                          <CheckCircle2 size={14} className="mr-1" /> 
                          Completed
                        </span>
                      ) : `${progress}% Complete`}
                    </span>
                  </div>
                  <Progress value={progress} className={getProgressColor()} />
                </div>
                
                {notes && (
                  <div className="mt-3">
                    <p className="text-sm text-neutral-500 mb-1 flex items-center">
                      <MessageCircle size={14} className="mr-1" /> Latest Update
                    </p>
                    <p className="text-sm">{notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Tabs for different goal views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alignment">Alignment</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <div className="p-3 bg-neutral-50 rounded-md text-sm">
                  {goal.description || "No detailed description provided."}
                </div>
              </div>
              
              {goal.targetValue && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Target Value</h3>
                  <div className="p-3 bg-neutral-50 rounded-md text-sm">
                    {goal.targetValue}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {false && (
              <TabsContent value="keyResults" className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Key Results</h3>
                  <div className="space-y-3">
                    {keyResults.map((kr) => (
                      <Card key={kr.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium mb-1">{kr.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={
                                  kr.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                  kr.status === 'completed' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                  kr.status === 'at_risk' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                  kr.status === 'behind' ? "bg-red-50 text-red-700 border-red-200" :
                                  "bg-neutral-50 text-neutral-700 border-neutral-200"
                                }
                              >
                                {kr.status === 'active' ? 'On Track' : 
                                 kr.status === 'completed' ? 'Completed' :
                                 kr.status === 'at_risk' ? 'At Risk' :
                                 kr.status === 'behind' ? 'Behind' : 'Draft'}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">{kr.progress}%</p>
                          </div>
                          <Progress 
                            value={kr.progress} 
                            className={
                              kr.progress >= 100 ? "bg-emerald-500" :
                              kr.progress >= 75 ? "bg-blue-500" :
                              kr.progress >= 50 ? "bg-amber-500" :
                              "bg-red-500"
                            } 
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="alignment" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Goal Alignment</h3>
                <p className="text-sm text-neutral-500">Shows how this goal aligns with team and company goals.</p>
                
                <div className="mt-4 p-6 border border-dashed rounded-md flex flex-col items-center justify-center text-center">
                  <p className="text-neutral-500 mb-2">No alignment information available</p>
                  <Button variant="outline" size="sm">Link to Parent Goal</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Update History</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 border-b">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assignee?.avatar} />
                        <AvatarFallback>{assignee?.name.split(" ").map(n => n[0]).join("") || "U"}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{assignee?.name || "User"}</p>
                        <p className="text-xs text-neutral-500">Yesterday at 3:45 PM</p>
                      </div>
                      <p className="text-sm mt-1">Updated progress to 65%</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 p-3 border-b">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={owner?.avatar} />
                        <AvatarFallback>{owner?.name.split(" ").map(n => n[0]).join("") || "O"}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{owner?.name || "Creator"}</p>
                        <p className="text-xs text-neutral-500">3 days ago</p>
                      </div>
                      <p className="text-sm mt-1">Created the goal</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {progress < 100 && (
            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 size={16} className="mr-1" />
              Mark as Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}