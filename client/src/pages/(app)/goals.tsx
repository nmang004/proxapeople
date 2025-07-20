import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Helmet } from 'react-helmet';
import { useMediaQuery } from "@/hooks/use-media-query";
import { Goal } from "@shared/schema";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalDetail } from "@/components/goals/goal-detail";
import { GoalForm } from "@/components/goals/goal-form";
import { 
  BarChart3, 
  ListFilter, 
  PlusCircle, 
  Search, 
  Target,
  Users
} from "lucide-react";

export default function Goals() {
  const [activeTab, setActiveTab] = useState("all");
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Partial<Goal> | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Media query for responsive design
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const { data: goals, isLoading, error } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  });
  
  // Sample user data for assignees
  const users = [
    { id: 1, name: "Sarah Johnson", title: "Product Manager", avatar: "/avatars/sarah.jpg" },
    { id: 2, name: "Michael Chen", title: "Design Lead", avatar: "/avatars/michael.jpg" },
    { id: 3, name: "Emily Rodriguez", title: "Software Engineer", avatar: "/avatars/emily.jpg" },
    { id: 4, name: "David Kim", title: "Data Analyst", avatar: "/avatars/david.jpg" },
  ];
  
  // Sample team data
  const teams = [
    { id: 1, name: "Product" },
    { id: 2, name: "Design" },
    { id: 3, name: "Engineering" },
    { id: 4, name: "Marketing" },
  ];
  
  // Sample department data
  const departments = [
    { id: 1, name: "Product & Design" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "Marketing" },
    { id: 4, name: "Operations" },
  ];
  
  // Sample goal data
  const sampleGoals = [
    {
      id: 1,
      title: "Increase user engagement by 25%",
      description: "Implement features and enhancements to increase overall user engagement metrics across the platform",
      status: "active",
      category: "okr",
      progress: 65,
      startDate: "2023-10-01",
      dueDate: "2023-12-31",
      assigneeId: 1,
      priority: "high",
      notes: "Weekly engagement metrics show positive trend after release of new social features",
      keyResults: [
        { id: 1, title: "Increase daily active users by 20%", progress: 75, status: "active" },
        { id: 2, title: "Improve session duration by 15%", progress: 60, status: "active" },
        { id: 3, title: "Boost user-generated content by 30%", progress: 45, status: "behind" }
      ]
    },
    {
      id: 2,
      title: "Redesign user dashboard",
      description: "Create a more intuitive and user-friendly dashboard that improves UX and reduces bounce rates",
      status: "at_risk",
      category: "project",
      progress: 40,
      startDate: "2023-09-15",
      dueDate: "2023-11-15",
      assigneeId: 2,
      priority: "medium",
      notes: "Experiencing some delays in finalizing user research. May need to adjust timeline."
    },
    {
      id: 3,
      title: "Launch mobile app v2.0",
      description: "Release the next version of our mobile app with enhanced performance and new features",
      status: "active",
      category: "team",
      progress: 80,
      startDate: "2023-08-01",
      dueDate: "2023-12-15",
      teamId: 3,
      priority: "high",
      notes: "Development on track, QA testing starting next week"
    },
    {
      id: 4,
      title: "Complete certification program",
      description: "Finish product management certification to enhance skills and knowledge",
      status: "completed",
      category: "personal",
      progress: 100,
      startDate: "2023-07-15",
      dueDate: "2023-10-31",
      assigneeId: 1,
      priority: "medium",
      notes: "All modules completed and final exam passed with 92%"
    },
    {
      id: 5,
      title: "Reduce page load time by 30%",
      description: "Optimize website performance to improve user experience and SEO rankings",
      status: "behind",
      category: "project",
      progress: 35,
      startDate: "2023-09-01",
      dueDate: "2023-11-01",
      assigneeId: 3,
      priority: "high",
      notes: "Initial optimizations complete but facing challenges with third-party scripts"
    }
  ];
  
  const goalsToShow = goals?.length ? goals : sampleGoals;
  
  const handleViewGoal = (goal: Partial<Goal>) => {
    setSelectedGoal(goal);
    setIsDetailOpen(true);
  };
  
  const filteredGoals = goalsToShow.filter(goal => {
    // Filter by tab
    if (activeTab === "my_goals" && goal.assigneeId !== 1) return false; // Assuming current user ID is 1
    if (activeTab === "team_goals" && goal.category !== "team") return false;
    if (activeTab === "okrs" && goal.category !== "okr") return false;
    
    // Filter by category
    if (categoryFilter !== "all" && goal.category !== categoryFilter) return false;
    
    // Filter by status
    if (statusFilter !== "all" && goal.status !== statusFilter) return false;
    
    // Filter by search query
    if (searchQuery && !goal.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !goal.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Stats calculation
  const totalGoals = goalsToShow.length;
  const activeGoals = goalsToShow.filter(g => g.status === "active").length;
  const completedGoals = goalsToShow.filter(g => g.status === "completed").length;
  const atRiskGoals = goalsToShow.filter(g => g.status === "at_risk" || g.status === "behind").length;
  
  const getAssigneeForGoal = (assigneeId?: number) => {
    if (!assigneeId) return undefined;
    return users.find(u => u.id === assigneeId);
  };

  return (
    <>
      <Helmet>
        <title>Goals & OKRs | Proxa People Management</title>
        <meta name="description" content="Manage your personal, team, and organizational goals and OKRs. Track progress, align objectives, and drive success." />
      </Helmet>
      
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-neutral-800">Goals & OKRs</h1>
          <p className="text-neutral-500 mt-1">Manage and track objectives across your organization</p>
        </div>
        <Button 
          className="self-start md:self-auto"
          onClick={() => {
            setSelectedGoal(undefined);
            setIsGoalFormOpen(true);
          }}
        >
          <PlusCircle size={16} className="mr-2" />
          Create Goal
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 rounded-md bg-blue-50">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs uppercase text-neutral-500 font-medium">Total Goals</span>
            </div>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <div className="text-sm text-neutral-500 mt-1">
              {activeGoals} active, {completedGoals} completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 rounded-md bg-emerald-50">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs uppercase text-neutral-500 font-medium">Overall Progress</span>
            </div>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 rounded-md bg-amber-50">
                <Users className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs uppercase text-neutral-500 font-medium">Team Goals</span>
            </div>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 rounded-md bg-red-50">
                <Target className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-xs uppercase text-neutral-500 font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold">{atRiskGoals}</div>
            <div className="text-sm text-neutral-500 mt-1">
              {Math.round((atRiskGoals / totalGoals) * 100)}% of total goals
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Goals Tab and Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Goal Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="mb-0 w-full md:w-auto overflow-x-auto">
                <TabsTrigger value="all">All Goals</TabsTrigger>
                <TabsTrigger value="my_goals">My Goals</TabsTrigger>
                <TabsTrigger value="team_goals">Team Goals</TabsTrigger>
                <TabsTrigger value="okrs">OKRs</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                  <Input
                    placeholder="Search goals..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-36">
                      <div className="flex items-center gap-2">
                        <ListFilter className="h-4 w-4" />
                        <SelectValue placeholder="Category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="okr">OKRs</SelectItem>
                      <SelectItem value="project">Projects</SelectItem>
                      <SelectItem value="team">Team Goals</SelectItem>
                      <SelectItem value="personal">Personal Goals</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-36">
                      <div className="flex items-center gap-2">
                        <ListFilter className="h-4 w-4" />
                        <SelectValue placeholder="Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="behind">Behind</SelectItem>
                      <SelectItem value="at_risk">At Risk</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Content for each tab */}
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="py-8 text-center">Loading goals...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">Error loading goal data</div>
              ) : filteredGoals.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Target className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No goals found</h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery || categoryFilter !== "all" || statusFilter !== "all" ? 
                      "Try adjusting your filters to see more goals" : 
                      "Start by creating your first goal or OKR"}
                  </p>
                  <Button onClick={() => setIsGoalFormOpen(true)}>
                    <PlusCircle size={16} className="mr-2" />
                    Create Goal
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onClick={() => handleViewGoal(goal)}
                      assignee={getAssigneeForGoal(goal.assigneeId)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="my_goals" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={() => handleViewGoal(goal)}
                    assignee={getAssigneeForGoal(goal.assigneeId)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="team_goals" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={() => handleViewGoal(goal)}
                    assignee={getAssigneeForGoal(goal.assigneeId)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="okrs" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={() => handleViewGoal(goal)}
                    assignee={getAssigneeForGoal(goal.assigneeId)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Company OKRs Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Company OKRs</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium mb-1">Q4 2023 Company Objectives</h3>
              <p className="text-sm text-neutral-500">October - December 2023</p>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Objective 1: Increase Market Share by 15%</h4>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <Progress value={70} className="h-2 mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-neutral-50 rounded-md text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Expand to 3 new markets</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-1 mb-1" />
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Increase customer retention to 85%</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <Progress value={80} className="h-1 mb-1" />
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Launch 2 new products</span>
                      <span className="font-medium">50%</span>
                    </div>
                    <Progress value={50} className="h-1 mb-1" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Objective 2: Improve Product Quality & User Experience</h4>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2 mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-50 rounded-md text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Reduce bug reports by 30%</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-1 mb-1" />
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Improve NPS score from 32 to 45</span>
                      <span className="font-medium">55%</span>
                    </div>
                    <Progress value={55} className="h-1 mb-1" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Goal Form Dialog */}
      {isGoalFormOpen && (
        <GoalForm
          open={isGoalFormOpen}
          onClose={() => setIsGoalFormOpen(false)}
          initialData={selectedGoal}
          assignees={users}
          teams={teams}
          departments={departments}
          parentGoals={goalsToShow.filter(g => g.isCompanyGoal || g.category === "okr")}
        />
      )}
      
      {/* Goal Detail Dialog */}
      {isDetailOpen && selectedGoal && (
        <GoalDetail
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          goal={selectedGoal}
          assignee={selectedGoal.assigneeId ? getAssigneeForGoal(selectedGoal.assigneeId) : undefined}
          owner={users[0]}
        />
      )}
    </>
  );
}