import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingReviews } from "@/shared/api/hooks";
import type { ReviewStatus } from "@/shared/types/types";

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

export function UpcomingReviews() {
  const { data: apiReviews, isLoading, error } = useUpcomingReviews();
  
  // Use sample data for visual representation
  const reviews = apiReviews?.length ? apiReviews : sampleReviews;

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
      <CardContent className="p-0">
        <div className="overflow-hidden -mx-5">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-neutral-200">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Review Type</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center text-sm text-neutral-500">
                        Loading reviews...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center text-sm text-red-500">
                        Error loading reviews
                      </td>
                    </tr>
                  ) : reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <tr key={review.id}>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={review.employee.profileImage} alt={review.employee.name} />
                                <AvatarFallback>
                                  {review.employee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-neutral-800">{review.employee.name}</div>
                              <div className="text-xs text-neutral-500">{review.employee.jobTitle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-800">
                            {review.type === 'quarterly' ? 'Quarterly Performance' : 
                             review.type === 'annual' ? 'Annual Review' : 
                             review.type === 'peer' ? 'Peer Review' : 'Self Review'}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-800">{formatDate(review.dueDate)}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={getStatusBadgeClass(review.status)}>
                            {review.status === 'not_started' ? 'Not Started' :
                             review.status === 'self_review' ? 'Self-Review' :
                             review.status === 'peer_review' ? 'Peer Review' :
                             review.status === 'manager_review' ? 'Manager Review' :
                             review.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-primary hover:text-primary-dark">View</a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center text-sm text-neutral-500">
                        No upcoming reviews
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
