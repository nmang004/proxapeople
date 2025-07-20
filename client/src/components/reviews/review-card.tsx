// Review card component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PerformanceReview } from "@shared/schema";

interface ReviewCardProps {
  review: PerformanceReview;
  onViewDetails?: (id: number) => void;
}

export function ReviewCard({ review, onViewDetails }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Review</CardTitle>
        <Badge variant="outline">{review.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Employee ID:</strong> {review.employeeId}</p>
          <p><strong>Reviewer ID:</strong> {review.reviewerId}</p>
          <p><strong>Type:</strong> {review.reviewType}</p>
          {review.dueDate && (
            <p><strong>Due Date:</strong> {new Date(review.dueDate).toLocaleDateString()}</p>
          )}
          {onViewDetails && (
            <Button 
              variant="outline" 
              onClick={() => onViewDetails(review.id)}
              className="w-full mt-4"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}