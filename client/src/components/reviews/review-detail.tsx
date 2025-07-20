// Review detail component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerformanceReview } from "@shared/schema";

interface ReviewDetailProps {
  review: PerformanceReview;
}

export function ReviewDetail({ review }: ReviewDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Details</CardTitle>
        <Badge variant="outline">{review.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Review Information</h4>
            <p><strong>Employee ID:</strong> {review.employeeId}</p>
            <p><strong>Reviewer ID:</strong> {review.reviewerId}</p>
            <p><strong>Type:</strong> {review.reviewType}</p>
            {review.dueDate && (
              <p><strong>Due Date:</strong> {new Date(review.dueDate).toLocaleDateString()}</p>
            )}
          </div>
          {review.rating && (
            <div>
              <h4 className="font-semibold">Overall Rating</h4>
              <p>{review.rating}</p>
            </div>
          )}
          {review.feedback && (
            <div>
              <h4 className="font-semibold">Feedback</h4>
              <p>{review.feedback}</p>
            </div>
          )}
          {review.feedback && (
            <div>
              <h4 className="font-semibold">Additional Notes</h4>
              <p>{review.feedback}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}