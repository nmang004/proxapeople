import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from 'react-helmet';
import { ReviewForm } from "@/components/forms/review-form";
import { PerformanceReview, reviewStatusEnum } from "@shared/schema";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ReviewCard } from "@/features/performance/components/review-card";
import { ReviewDetail } from "@/features/performance/components/review-detail";
import { PlusCircle, Filter } from "lucide-react";

type ReviewStatus = typeof reviewStatusEnum.enumValues[number];

// Extended type with populated employee and reviewer data
type PopulatedPerformanceReview = PerformanceReview & {
  employee?: {
    name: string;
    title: string;
    image?: string;
  };
  reviewer?: {
    name: string;
    title: string;
    image?: string;
  };
};

export default function PerformanceReviews() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cycleFilter, setCycleFilter] = useState("current");
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Partial<PopulatedPerformanceReview> | undefined>(undefined);
  
  // Media query for responsive design
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const { data: reviews, isLoading, error } = useQuery<PopulatedPerformanceReview[]>({
    queryKey: ['/api/reviews'],
  });

  const getStatusBadgeClass = (status: ReviewStatus) => {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Sample review data for UI demonstration
  const sampleReviews: PopulatedPerformanceReview[] = [
    {
      id: 1,
      employeeId: 1,
      reviewerId: 5,
      reviewCycleId: 1,
      reviewType: "quarterly",
      status: "self_review" as ReviewStatus,
      startDate: "2023-11-01",
      dueDate: "2023-11-15",
      completedAt: null,
      feedback: "Good progress on design system implementation.",
      rating: null,
      createdAt: new Date("2023-11-01"),
      updatedAt: new Date("2023-11-01"),
      employee: {
        name: "Michael Chen",
        title: "Product Designer",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&h=100",
      },
      reviewer: {
        name: "Ashley Johnson",
        title: "Design Director"
      }
    },
    {
      id: 2,
      employeeId: 2,
      reviewerId: 6,
      reviewCycleId: 1,
      dueDate: "2023-11-22",
      status: "peer_review" as ReviewStatus,
      reviewType: "annual",
      startDate: "2023-11-08",
      completedAt: null,
      feedback: "Excellent leadership skills demonstrated during the project turnaround.",
      rating: null,
      createdAt: new Date("2023-11-08"),
      updatedAt: new Date("2023-11-08"),
      employee: {
        name: "Sarah Wilson",
        title: "Engineering Lead",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&h=100",
      },
      reviewer: {
        name: "James Mitchell",
        title: "CTO"
      }
    },
    {
      id: 3,
      employeeId: 3,
      reviewerId: 1,
      reviewCycleId: 1,
      dueDate: "2023-11-30",
      status: "not_started" as ReviewStatus,
      reviewType: "quarterly",
      startDate: "2023-11-15",
      completedAt: null,
      feedback: "",
      rating: null,
      createdAt: new Date("2023-11-15"),
      updatedAt: new Date("2023-11-15"),
      employee: {
        name: "David Rodriguez",
        title: "Software Engineer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&h=100",
      },
      reviewer: {
        name: "Sarah Wilson",
        title: "Engineering Lead"
      }
    }
  ];
  
  const handleViewReview = (review: Partial<PerformanceReview>) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const reviewsToShow = reviews?.length ? reviews : sampleReviews;
  
  return (
    <>
      <Helmet>
        <title>Performance Reviews | Proxa People Management</title>
        <meta name="description" content="Manage and track employee performance reviews, including self-assessments, peer feedback, and manager evaluations." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-neutral-800">Performance Reviews</h1>
          <p className="text-neutral-500 mt-1">Manage and track employee performance evaluations</p>
        </div>
        <Button 
          className="self-start md:self-auto"
          onClick={() => {
            setSelectedReview(undefined);
            setIsReviewFormOpen(true);
          }}
        >
          <PlusCircle size={16} className="mr-2" />
          Start New Review
        </Button>
      </div>
      
      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Current Review Cycle Progress</CardTitle>
            <Select value={cycleFilter} onValueChange={setCycleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Q4 2023 (Current)</SelectItem>
                <SelectItem value="q3-2023">Q3 2023</SelectItem>
                <SelectItem value="q2-2023">Q2 2023</SelectItem>
                <SelectItem value="q1-2023">Q1 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">78%</div>
              <div className="text-neutral-600 text-xs md:text-sm text-center">Overall Completion</div>
              <Progress value={78} className="w-full mt-2" />
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-2xl md:text-3xl font-bold text-emerald-500 mb-1">92%</div>
              <div className="text-neutral-600 text-xs md:text-sm text-center">Self Reviews</div>
              <Progress value={92} className="w-full mt-2" />
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-2xl md:text-3xl font-bold text-amber-500 mb-1">65%</div>
              <div className="text-neutral-600 text-xs md:text-sm text-center">Peer Reviews</div>
              <Progress value={65} className="w-full mt-2" />
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-2xl md:text-3xl font-bold text-blue-500 mb-1">84%</div>
              <div className="text-neutral-600 text-xs md:text-sm text-center">Manager Reviews</div>
              <Progress value={84} className="w-full mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Review Management</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsReviewFormOpen(true)}
                size="sm"
              >
                <PlusCircle size={14} className="mr-1" />
                Start New Review
              </Button>
              <Button variant="outline" size="sm">
                <Filter size={14} className="mr-1" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0">
              {isLoading ? (
                <div className="py-8 text-center">Loading reviews...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">Error loading review data</div>
              ) : (
                <>
                  {/* Desktop View - Table */}
                  {isDesktop ? (
                    <div className="rounded-md border hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Review Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Reviewer</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reviewsToShow.map((review) => (
                            <TableRow key={review.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={review.employee?.image} alt={review.employee?.name} />
                                    <AvatarFallback>
                                      {review.employee?.name?.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{review.employee?.name}</div>
                                    <div className="text-sm text-neutral-500">{review.employee?.title}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {review.reviewType === 'quarterly' ? 'Quarterly Review' : 
                                 review.reviewType === 'annual' ? 'Annual Review' : 
                                 review.reviewType === 'peer' ? 'Peer Review' : 
                                 review.reviewType === 'self' ? 'Self Review' : 'Review'}
                              </TableCell>
                              <TableCell>
                                <span className={getStatusBadgeClass(review.status)}>
                                  {review.status === 'not_started' ? 'Not Started' :
                                   review.status === 'self_review' ? 'Self Review' :
                                   review.status === 'peer_review' ? 'Peer Review' :
                                   review.status === 'manager_review' ? 'Manager Review' :
                                   review.status === 'completed' ? 'Completed' : 'Unknown'}
                                </span>
                              </TableCell>
                              <TableCell>{formatDate(review.dueDate)}</TableCell>
                              <TableCell>{review.reviewer?.name}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewReview(review)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    /* Mobile View - Cards */
                    <div className="space-y-4 md:hidden">
                      {reviewsToShow.map((review) => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                          onClick={() => handleViewReview(review)}
                          employeeName={review.employee?.name || "Employee"}
                          employeeTitle={review.employee?.title || "Job Title"}
                          employeeImage={review.employee?.image}
                          reviewerName={review.reviewer?.name || "Reviewer"}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="inProgress" className="mt-0">
              {isDesktop ? (
                <div className="rounded-md border hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Review Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewsToShow
                        .filter(r => r.status === 'self_review' || r.status === 'peer_review' || r.status === 'manager_review')
                        .map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={review.employee?.image} alt={review.employee?.name} />
                                <AvatarFallback>
                                  {review.employee?.name?.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.employee?.name}</div>
                                <div className="text-sm text-neutral-500">{review.employee?.title}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {review.reviewType === 'quarterly' ? 'Quarterly Review' : 
                             review.reviewType === 'annual' ? 'Annual Review' : 
                             review.reviewType === 'peer' ? 'Peer Review' : 
                             review.reviewType === 'self' ? 'Self Review' : 'Review'}
                          </TableCell>
                          <TableCell>
                            <span className={getStatusBadgeClass(review.status)}>
                              {review.status === 'not_started' ? 'Not Started' :
                               review.status === 'self_review' ? 'Self Review' :
                               review.status === 'peer_review' ? 'Peer Review' :
                               review.status === 'manager_review' ? 'Manager Review' :
                               review.status === 'completed' ? 'Completed' : 'Unknown'}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(review.dueDate)}</TableCell>
                          <TableCell>{review.reviewer?.name}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewReview(review)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="space-y-4 md:hidden">
                  {reviewsToShow
                    .filter(r => r.status === 'self_review' || r.status === 'peer_review' || r.status === 'manager_review')
                    .map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onClick={() => handleViewReview(review)}
                      employeeName={review.employee?.name || "Employee"}
                      employeeTitle={review.employee?.title || "Job Title"}
                      employeeImage={review.employee?.image}
                      reviewerName={review.reviewer?.name || "Reviewer"}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              {/* Add completed reviews view, similar to the above patterns */}
              <div className="py-8 text-center text-neutral-500">
                No completed reviews yet
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              {isDesktop ? (
                <div className="rounded-md border hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Review Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewsToShow.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={review.employee?.image} alt={review.employee?.name} />
                                <AvatarFallback>
                                  {review.employee?.name?.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.employee?.name}</div>
                                <div className="text-sm text-neutral-500">{review.employee?.title}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {review.reviewType === 'quarterly' ? 'Quarterly Review' : 
                             review.reviewType === 'annual' ? 'Annual Review' : 
                             review.reviewType === 'peer' ? 'Peer Review' : 
                             review.reviewType === 'self' ? 'Self Review' : 'Review'}
                          </TableCell>
                          <TableCell>
                            <span className={getStatusBadgeClass(review.status)}>
                              {review.status === 'not_started' ? 'Not Started' :
                               review.status === 'self_review' ? 'Self Review' :
                               review.status === 'peer_review' ? 'Peer Review' :
                               review.status === 'manager_review' ? 'Manager Review' :
                               review.status === 'completed' ? 'Completed' : 'Unknown'}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(review.dueDate)}</TableCell>
                          <TableCell>{review.reviewer?.name}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewReview(review)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="space-y-4 md:hidden">
                  {reviewsToShow.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onClick={() => handleViewReview(review)}
                      employeeName={review.employee?.name || "Employee"}
                      employeeTitle={review.employee?.title || "Job Title"}
                      employeeImage={review.employee?.image}
                      reviewerName={review.reviewer?.name || "Reviewer"}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Review Form Dialog */}
      {isReviewFormOpen && (
        <ReviewForm
          open={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
          initialData={selectedReview}
          employees={[
            { id: 1, name: "Michael Chen" },
            { id: 2, name: "Sarah Wilson" },
            { id: 3, name: "David Rodriguez" }
          ]}
          reviewers={[
            { id: 5, name: "Ashley Johnson" },
            { id: 6, name: "James Mitchell" },
            { id: 1, name: "Sarah Wilson" }
          ]}
          reviewCycles={[
            { id: 1, name: "Q4 2023" },
            { id: 2, name: "Q1 2024" },
            { id: 3, name: "Q2 2024" },
            { id: 4, name: "Q3 2024" }
          ]}
        />
      )}
      
      {/* Review Detail Dialog */}
      {isDetailOpen && selectedReview && (
        <ReviewDetail
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          review={selectedReview}
          employee={{
            id: selectedReview.employeeId || 0,
            name: selectedReview.employee?.name || "Employee Name",
            title: selectedReview.employee?.title || "Job Title",
            avatar: selectedReview.employee?.image
          }}
          reviewer={{
            id: selectedReview.reviewerId || 0,
            name: selectedReview.reviewer?.name || "Reviewer Name",
            title: selectedReview.reviewer?.title || "Manager",
            avatar: undefined
          }}
        />
      )}
    </>
  );
}
