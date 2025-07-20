import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PerformanceReview, reviewStatusEnum } from "@shared/schema";
import { ChevronRight } from "lucide-react";

interface ReviewCardProps {
  review: Partial<PerformanceReview>;
  onClick: () => void;
  employeeName?: string;
  employeeTitle?: string;
  employeeImage?: string;
  reviewerName?: string;
}

export function ReviewCard({ 
  review, 
  onClick, 
  employeeName = "Employee Name", 
  employeeTitle = "Job Title",
  employeeImage,
  reviewerName = "Reviewer Name"
}: ReviewCardProps) {
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

  return (
    <Card className="mb-3 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={employeeImage} alt={employeeName} />
              <AvatarFallback>{employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium line-clamp-1">{employeeName}</div>
              <div className="text-sm text-neutral-500 line-clamp-1">{employeeTitle}</div>
            </div>
            <div className={getStatusBadgeClass(review.status)}>
              {review.status === 'not_started' ? 'Not Started' :
               review.status === 'self_review' ? 'Self Review' :
               review.status === 'peer_review' ? 'Peer Review' :
               review.status === 'manager_review' ? 'Manager Review' :
               review.status === 'completed' ? 'Completed' : 'Unknown'}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-neutral-500">Review Type</div>
              <div>{getReviewTypeName(review.reviewType)}</div>
            </div>
            <div>
              <div className="text-neutral-500">Due Date</div>
              <div>{formatDate(review.dueDate)}</div>
            </div>
            <div>
              <div className="text-neutral-500">Reviewer</div>
              <div className="line-clamp-1">{reviewerName}</div>
            </div>
            {review.rating !== null && (
              <div>
                <div className="text-neutral-500">Rating</div>
                <div>{review.rating} / 5</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Button 
          variant="ghost" 
          className="w-full rounded-none h-12 justify-between"
          onClick={onClick}
        >
          View Details 
          <ChevronRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}