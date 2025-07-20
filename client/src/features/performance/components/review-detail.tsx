import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PerformanceReview, reviewStatusEnum } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, Star } from "lucide-react";

interface ReviewDetailProps {
  review: Partial<PerformanceReview>;
  open: boolean;
  onClose: () => void;
  employee?: {
    id: number;
    name: string;
    title: string;
    avatar?: string;
  };
  reviewer?: {
    id: number;
    name: string;
    title: string;
    avatar?: string;
  };
}

export function ReviewDetail({
  review,
  open,
  onClose,
  employee = { 
    id: 0, 
    name: "Employee Name", 
    title: "Job Title", 
    avatar: undefined 
  },
  reviewer = { 
    id: 0, 
    name: "Reviewer Name", 
    title: "Job Title", 
    avatar: undefined 
  }
}: ReviewDetailProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState(review.feedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getStatusBadgeClass = (status: "not_started" | "self_review" | "peer_review" | "manager_review" | "completed" | undefined) => {
    if (!status) return "status-badge status-badge-info";
    
    switch (status) {
      case 'not_started':
        return 'status-badge status-badge-warning';
      case 'self_review':
        return 'status-badge status-badge-info';
      case 'peer_review':
        return 'status-badge status-badge-info';
      case 'manager_review':
        return 'status-badge status-badge-warning';
      case 'completed':
        return 'status-badge status-badge-success';
      default:
        return 'status-badge status-badge-info';
    }
  };

  const getReviewTypeName = (type: string | undefined) => {
    if (!type) return "Review";
    
    switch (type) {
      case 'quarterly':
        return 'Quarterly Review';
      case 'annual':
        return 'Annual Review';
      case 'peer':
        return 'Peer Review';
      case 'self':
        return 'Self Review';
      default:
        return 'Review';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSave = async () => {
    if (!review.id) return;
    
    setIsSubmitting(true);
    try {
      const updatedReview = {
        ...review,
        feedback
      };
      
      await apiRequest('PATCH', `/api/reviews/${review.id}`, updatedReview);
      
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Performance Review Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Header with meta information */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{employee.name}</h3>
                <p className="text-sm text-neutral-500">{employee.title}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 items-start sm:items-end">
              <div className={getStatusBadgeClass(review.status)}>
                {review.status === 'not_started' ? 'Not Started' :
                 review.status === 'self_review' ? 'Self Review' :
                 review.status === 'peer_review' ? 'Peer Review' :
                 review.status === 'manager_review' ? 'Manager Review' :
                 review.status === 'completed' ? 'Completed' : 'Unknown'}
              </div>
              <span className="text-sm">{getReviewTypeName(review.reviewType)}</span>
            </div>
          </div>
          
          {/* Review Meta Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-neutral-500 mb-1">Due Date</div>
              <div>{formatDate(review.dueDate)}</div>
            </div>
            <div>
              <div className="text-neutral-500 mb-1">Reviewer</div>
              <div className="line-clamp-1">{reviewer.name}</div>
            </div>
            <div>
              <div className="text-neutral-500 mb-1">Review Cycle</div>
              <div>Q4 2023</div>
            </div>
            {review.rating !== null && review.rating !== undefined && (
              <div>
                <div className="text-neutral-500 mb-1">Overall Rating</div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < (review.rating || 0) 
                        ? "text-yellow-500 fill-yellow-500" 
                        : "text-neutral-300"} 
                    />
                  ))}
                  <span className="ml-2">{review.rating} / 5</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Tabs for different sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-0 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Overall Performance</h4>
                {review.rating !== null && review.rating !== undefined && (
                  <div className="mb-2">
                    <Progress value={review.rating * 20} className="mb-1" />
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Needs Improvement</span>
                      <span>Outstanding</span>
                    </div>
                  </div>
                )}
                
                <p className="text-neutral-700">
                  {review.feedback || "No feedback provided yet."}
                </p>
              </div>
              
              <div className="text-sm text-neutral-500 mt-4">
                <p>Additional details can be found in the feedback section above.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-0">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Overall Feedback</h4>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <Textarea 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter feedback..."
                  className="min-h-[200px]"
                />
              ) : (
                <div className="min-h-[100px] p-3 border rounded-md bg-neutral-50">
                  {review.feedback || "No feedback provided yet."}
                </div>
              )}
            </TabsContent>
            
          </Tabs>
        </div>
        
        <DialogFooter>
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFeedback(review.feedback || "");
                  setIsEditing(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSubmitting}
              >
                <Save size={16} className="mr-1" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}