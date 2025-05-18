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

type ReviewStatus = typeof reviewStatusEnum.enum;

export default function PerformanceReviews() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cycleFilter, setCycleFilter] = useState("current");
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Partial<PerformanceReview> | undefined>(undefined);
  
  const { data: reviews, isLoading, error } = useQuery<PerformanceReview[]>({
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

  return (
    <>
      <Helmet>
        <title>Performance Reviews | Proxa People Management</title>
        <meta name="description" content="Manage and track employee performance reviews, including self-assessments, peer feedback, and manager evaluations." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Performance Reviews</h1>
        <p className="text-neutral-500 mt-1">Manage and track employee performance evaluations</p>
      </div>
      
      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Current Review Cycle Progress</CardTitle>
            <Select value={cycleFilter} onValueChange={setCycleFilter}>
              <SelectTrigger className="w-[180px]">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-3xl font-bold text-primary mb-1">78%</div>
              <div className="text-neutral-600 text-sm">Overall Completion</div>
              <Progress value={78} className="w-full mt-2" />
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-3xl font-bold text-emerald-500 mb-1">92%</div>
              <div className="text-neutral-600 text-sm">Self Reviews</div>
              <Progress value={92} className="w-full mt-2" />
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-3xl font-bold text-amber-500 mb-1">65%</div>
              <div className="text-neutral-600 text-sm">Peer Reviews</div>
              <Progress value={65} className="w-full mt-2" />
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md">
              <div className="text-3xl font-bold text-blue-500 mb-1">84%</div>
              <div className="text-neutral-600 text-sm">Manager Reviews</div>
              <Progress value={84} className="w-full mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Review Management</CardTitle>
            <Button onClick={() => {
              setSelectedReview(undefined);
              setIsReviewFormOpen(true);
            }}>
              <i className="ri-add-line mr-1"></i>
              Start New Review
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
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
                    {/* Sample data for UI demonstration */}
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=32&h=32" alt="Michael Chen" />
                            <AvatarFallback>MC</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Michael Chen</div>
                            <div className="text-sm text-neutral-500">Product Designer</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Quarterly Performance</TableCell>
                      <TableCell>
                        <span className="status-badge status-badge-warning">In Progress</span>
                      </TableCell>
                      <TableCell>Nov 15, 2023</TableCell>
                      <TableCell>Ashley Johnson</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedReview({
                              employeeId: 1,
                              reviewerId: 5,
                              reviewCycleId: 1,
                              dueDate: "2023-11-15",
                              status: "self_review",
                              type: "quarterly",
                              feedback: "Good progress on design system implementation."
                            });
                            setIsReviewFormOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=32&h=32" alt="Sarah Wilson" />
                            <AvatarFallback>SW</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Sarah Wilson</div>
                            <div className="text-sm text-neutral-500">Engineering Lead</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Annual Review</TableCell>
                      <TableCell>
                        <span className="status-badge status-badge-info">Self-Review</span>
                      </TableCell>
                      <TableCell>Nov 22, 2023</TableCell>
                      <TableCell>James Mitchell</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="inProgress" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing in-progress reviews
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing completed reviews
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing all reviews
              </div>
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
          employees={reviews?.map(review => ({
            id: review.employeeId,
            name: `Employee ID: ${review.employeeId}`
          })) || []}
          reviewers={reviews?.map(review => ({
            id: review.reviewerId, 
            name: `Reviewer ID: ${review.reviewerId}`
          })) || []}
          reviewCycles={[
            { id: 1, name: "Q4 2023" },
            { id: 2, name: "Q1 2024" },
            { id: 3, name: "Q2 2024" },
            { id: 4, name: "Q3 2024" }
          ]}
        />
      )}
    </>
  );
}
