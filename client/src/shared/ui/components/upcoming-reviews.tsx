import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveTable, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import type { ReviewStatus } from "@/shared/types/types";
import { ErrorMessage } from "@/shared/ui/components/error-message";
import { Spinner } from "@/shared/ui/components/spinner";

interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  profileImage?: string;
}

interface Review {
  id: number;
  type: string;
  dueDate: string;
  status: ReviewStatus;
  employee: Employee;
}

// Sample review data for the dashboard
const sampleReviews: Review[] = [
  {
    id: 1,
    type: "Quarterly Review",
    dueDate: "2025-06-15",
    status: "self_review",
    employee: {
      id: 1,
      name: "Sarah Johnson",
      jobTitle: "Product Designer",
      profileImage: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: 2,
    type: "Annual Review",
    dueDate: "2025-05-30",
    status: "in_progress",
    employee: {
      id: 2,
      name: "Michael Chen",
      jobTitle: "Frontend Developer",
      profileImage: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: 3,
    type: "Peer Review",
    dueDate: "2025-06-05",
    status: "not_started",
    employee: {
      id: 3,
      name: "David Miller",
      jobTitle: "UX Researcher",
      profileImage: "https://i.pravatar.cc/150?img=4"
    }
  }
];

interface UpcomingReviewsProps {
  data?: Review[];
  isLoading?: boolean;
  error?: Error | null;
}

export function UpcomingReviews({ data, isLoading = false, error = null }: UpcomingReviewsProps) {
  // Use sample data for visual representation
  const reviews = data?.length ? data : sampleReviews;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadgeClass = (status: ReviewStatus) => {
    switch (status) {
      case 'self_review':
        return 'status-badge status-badge-info';
      case 'in_progress':
        return 'status-badge status-badge-warning';
      case 'completed':
        return 'status-badge status-badge-success';
      default:
        return 'status-badge status-badge-info';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading font-medium text-neutral-800">Upcoming Reviews</CardTitle>
          <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="py-4">
            <ErrorMessage 
              title="Failed to load reviews"
              message={error.message || "Unable to fetch upcoming reviews. Please try again later."}
            />
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center">
            <Spinner className="mx-auto" />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <ResponsiveTable
            data={reviews}
            columns={[
              {
                key: 'employee',
                label: 'Employee',
                render: (review) => (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.employee.profileImage} alt={review.employee.name} />
                      <AvatarFallback className="text-xs">
                        {review.employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-neutral-800">{review.employee.name}</div>
                      <div className="text-xs text-neutral-500">{review.employee.jobTitle}</div>
                    </div>
                  </div>
                )
              },
              {
                key: 'type',
                label: 'Review Type',
                render: (review) => (
                  <span className="text-sm text-neutral-800">
                    {review.type === 'quarterly' ? 'Quarterly Performance' : 
                     review.type === 'annual' ? 'Annual Review' : 
                     review.type === 'peer' ? 'Peer Review' : 'Self Review'}
                  </span>
                )
              },
              {
                key: 'dueDate',
                label: 'Due Date',
                render: (review) => (
                  <span className="text-sm text-neutral-800">{formatDate(review.dueDate)}</span>
                )
              },
              {
                key: 'status',
                label: 'Status',
                render: (review) => (
                  <span className={getStatusBadgeClass(review.status)}>
                    {review.status === 'not_started' ? 'Not Started' :
                     review.status === 'self_review' ? 'Self-Review' :
                     review.status === 'peer_review' ? 'Peer Review' :
                     review.status === 'manager_review' ? 'Manager Review' :
                     review.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                )
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (review) => (
                  <a href="#" className="text-primary hover:text-primary-dark text-sm font-medium">
                    View
                  </a>
                )
              }
            ]}
          >
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Review Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.employee.profileImage} alt={review.employee.name} />
                          <AvatarFallback className="text-xs">
                            {review.employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-neutral-800">{review.employee.name}</div>
                          <div className="text-xs text-neutral-500">{review.employee.jobTitle}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-800">
                        {review.type === 'quarterly' ? 'Quarterly Performance' : 
                         review.type === 'annual' ? 'Annual Review' : 
                         review.type === 'peer' ? 'Peer Review' : 'Self Review'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-800">{formatDate(review.dueDate)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(review.status)}>
                        {review.status === 'not_started' ? 'Not Started' :
                         review.status === 'self_review' ? 'Self-Review' :
                         review.status === 'peer_review' ? 'Peer Review' :
                         review.status === 'manager_review' ? 'Manager Review' :
                         review.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a href="#" className="text-primary hover:text-primary-dark text-sm font-medium">
                        View
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTable>
        ) : (
          <div className="py-8 text-center text-sm text-neutral-500">
            No upcoming reviews
          </div>
        )}
      </CardContent>
    </Card>
  );
}
