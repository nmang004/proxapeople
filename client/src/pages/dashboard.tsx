import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TeamPerformance } from "@/components/dashboard/team-performance";
import { UpcomingReviews } from "@/components/dashboard/upcoming-reviews";
import { TeamGoals } from "@/components/dashboard/team-goals";
import { OneOnOneMeetings } from "@/components/dashboard/one-on-one-meetings";
import { EngagementScore } from "@/components/dashboard/engagement-score";
import { Helmet } from 'react-helmet';
import { PageTransition, StaggeredChildren } from "@/components/ui/page-transition";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NewReviewDialog } from "@/components/dialogs/new-review-dialog";
import { ScheduleMeetingDialog } from "@/components/dialogs/schedule-meeting-dialog";
import { NewSurveyDialog } from "@/components/dialogs/new-survey-dialog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Edit, Check, Move, X, LightbulbIcon, Grid } from "lucide-react";

// Team member interface
interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  status: "active" | "away" | "busy" | "offline";
}

// Team members data
const teamMembers: TeamMember[] = [
  { id: 1, name: "Sarah Johnson", role: "Product Designer", department: "Design", avatar: "https://i.pravatar.cc/150?img=1", status: "active" },
  { id: 2, name: "Michael Chen", role: "Frontend Developer", department: "Engineering", avatar: "https://i.pravatar.cc/150?img=3", status: "busy" },
  { id: 3, name: "David Miller", role: "UX Researcher", department: "Design", avatar: "https://i.pravatar.cc/150?img=4", status: "away" },
  { id: 4, name: "Emily Wilson", role: "Product Manager", department: "Product", avatar: "https://i.pravatar.cc/150?img=5", status: "active" },
  { id: 5, name: "James Taylor", role: "Backend Developer", department: "Engineering", avatar: "https://i.pravatar.cc/150?img=6", status: "offline" },
  { id: 6, name: "Olivia Parker", role: "Marketing Specialist", department: "Marketing", avatar: "https://i.pravatar.cc/150?img=7", status: "active" },
];

// Goal interface
interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  owner: string;
  type: "personal" | "team" | "company";
  status: "not_started" | "in_progress" | "completed" | "blocked";
}

// Goals data
const goals: Goal[] = [
  { 
    id: 1, 
    title: "Improve User Engagement", 
    description: "Increase DAU by 25% through improved onboarding and core feature engagement.",
    progress: 70, 
    dueDate: "2025-06-30", 
    owner: "Emily Wilson", 
    type: "team",
    status: "in_progress"
  },
  { 
    id: 2, 
    title: "Launch Mobile App v2", 
    description: "Complete the redesign and feature enhancements for version 2.0 of our mobile app.",
    progress: 40, 
    dueDate: "2025-07-15", 
    owner: "Michael Chen", 
    type: "team",
    status: "in_progress"
  },
  { 
    id: 3, 
    title: "Improve Code Quality", 
    description: "Reduce bugs by 30% through improved testing and code reviews.",
    progress: 25, 
    dueDate: "2025-08-01", 
    owner: "James Taylor", 
    type: "personal",
    status: "in_progress"
  },
  { 
    id: 4, 
    title: "Launch Product Analytics", 
    description: "Implement advanced analytics to track user behavior and feature adoption.",
    progress: 90, 
    dueDate: "2025-05-30", 
    owner: "Sarah Johnson", 
    type: "personal",
    status: "completed"
  },
  { 
    id: 5, 
    title: "Improve Team Collaboration", 
    description: "Implement new processes for cross-functional team collaboration.",
    progress: 15, 
    dueDate: "2025-08-15", 
    owner: "Ashley Johnson", 
    type: "company",
    status: "not_started"
  },
];

// Review interface
interface Review {
  id: number;
  subject: string;
  reviewer: string;
  reviewee: string;
  dueDate: string;
  status: "scheduled" | "in_progress" | "completed" | "overdue";
  progress: number;
  type: "quarterly" | "annual" | "peer" | "self";
}

// Reviews data
const reviews: Review[] = [
  { 
    id: 1, 
    subject: "Q2 Performance Review", 
    reviewer: "Ashley Johnson", 
    reviewee: "Sarah Johnson", 
    dueDate: "2025-05-24", 
    status: "in_progress", 
    progress: 50,
    type: "quarterly"
  },
  { 
    id: 2, 
    subject: "Annual Review", 
    reviewer: "Ashley Johnson", 
    reviewee: "Michael Chen", 
    dueDate: "2025-05-28", 
    status: "scheduled", 
    progress: 0,
    type: "annual"
  },
  { 
    id: 3, 
    subject: "Peer Review", 
    reviewer: "Emily Wilson", 
    reviewee: "David Miller", 
    dueDate: "2025-06-05", 
    status: "scheduled", 
    progress: 25,
    type: "peer"
  },
  { 
    id: 4, 
    subject: "Self Assessment", 
    reviewer: "James Taylor", 
    reviewee: "James Taylor", 
    dueDate: "2025-05-15", 
    status: "overdue", 
    progress: 75,
    type: "self"
  },
  { 
    id: 5, 
    subject: "Q2 Performance Review", 
    reviewer: "Ashley Johnson", 
    reviewee: "Olivia Parker", 
    dueDate: "2025-06-12", 
    status: "scheduled", 
    progress: 0,
    type: "quarterly"
  },
];

// Define widget types for the dashboard
type WidgetId = 
  | "stats" 
  | "team-performance" 
  | "team-goals" 
  | "upcoming-reviews" 
  | "one-on-one-meetings" 
  | "engagement-score";

// Widget configuration interface
interface Widget {
  id: WidgetId;
  title: string;
  component: JSX.Element;
  colSpan?: string; // For controlling grid layout
  isMinimized?: boolean; // To track if widget is minimized
  isMaximized?: boolean; // To track if widget is maximized
  originalSize?: { width: string; height: string }; // To store original size when maximizing
  width?: number; // Width in pixels
  height?: number; // Height in pixels
  defaultWidth?: number; // Default width
  defaultHeight?: number; // Default height
}

// Interface for widget sizes
interface WidgetSizeState {
  [key: string]: {
    width: number;
    height: number;
  }
}

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgetStates, setWidgetStates] = useState<{[key: string]: {isMinimized: boolean, isMaximized: boolean}}>({});
  const [widgetSizes, setWidgetSizes] = useState<WidgetSizeState>({});
  const [resizingWidget, setResizingWidget] = useState<string | null>(null);
  const [initialResize, setInitialResize] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  
  // Simulating data fetch for dashboard stats
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    staleTime: 60000,
  });
  
  // Define widget configuration
  const [widgets, setWidgets] = useState<Widget[]>([
    { 
      id: "stats", 
      title: "Statistics", 
      component: <StatsCards 
        stats={{
          teamMembers: 14,
          reviewsInProgress: 8,
          activeGoals: 23,
          upcomingOneOnOnes: 5
        }}
        differences={{
          teamMembers: "+2 since last month",
          reviewsInProgress: "65% completion rate",
          activeGoals: "4 due this week",
          upcomingOneOnOnes: "2 scheduled for today"
        }}
        isLoading={isLoading}
      />,
      colSpan: "col-span-6",
      defaultWidth: 800,
      defaultHeight: 250
    },
    { 
      id: "team-performance", 
      title: "Team Performance", 
      component: <TeamPerformance />,
      colSpan: "col-span-3",
      defaultWidth: 600,
      defaultHeight: 380
    },
    { 
      id: "team-goals", 
      title: "Team Goals", 
      component: <TeamGoals />,
      colSpan: "col-span-2",
      defaultWidth: 380,
      defaultHeight: 400
    },
    { 
      id: "upcoming-reviews", 
      title: "Upcoming Reviews", 
      component: <UpcomingReviews />,
      colSpan: "col-span-3",
      defaultWidth: 600, 
      defaultHeight: 350
    },
    { 
      id: "one-on-one-meetings", 
      title: "Upcoming 1:1s", 
      component: <OneOnOneMeetings />,
      colSpan: "col-span-2",
      defaultWidth: 380,
      defaultHeight: 350
    },
    { 
      id: "engagement-score", 
      title: "Team Engagement", 
      component: <EngagementScore />,
      colSpan: "col-span-1",
      defaultWidth: 380,
      defaultHeight: 300
    }
  ]);
  
  useEffect(() => {
    // Slightly delay the animation to ensure smooth transitions
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Initialize widget states and sizes
  useEffect(() => {
    // Initialize widget states (minimize/maximize)
    const states = widgets.reduce((acc, widget) => {
      acc[widget.id] = { isMinimized: false, isMaximized: false };
      return acc;
    }, {} as {[key: string]: {isMinimized: boolean, isMaximized: boolean}});
    
    setWidgetStates(states);
    
    // Initialize widget sizes
    const sizes = widgets.reduce((acc, widget) => {
      acc[widget.id] = { 
        width: widget.defaultWidth || 350, 
        height: widget.defaultHeight || 300 
      };
      return acc;
    }, {} as WidgetSizeState);
    
    setWidgetSizes(sizes);
  }, []);
  
  // Event handlers for resize functionality
  const handleResizeStart = useCallback((e: React.MouseEvent, widgetId: string) => {
    e.preventDefault();
    
    const widget = document.getElementById(`widget-${widgetId}`);
    if (!widget) return;
    
    const rect = widget.getBoundingClientRect();
    
    setResizingWidget(widgetId);
    setInitialResize({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height
    });
    
    // Add event listeners for resize
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  }, []);
  
  const handleResize = useCallback((e: MouseEvent) => {
    if (!resizingWidget || !initialResize) return;
    
    // Calculate new dimensions
    const deltaX = e.clientX - initialResize.x;
    const deltaY = e.clientY - initialResize.y;
    
    const newWidth = Math.max(200, initialResize.width + deltaX);  // Minimum width
    const newHeight = Math.max(150, initialResize.height + deltaY); // Minimum height
    
    // Update the widget size
    setWidgetSizes(prev => ({
      ...prev,
      [resizingWidget]: {
        width: newWidth,
        height: newHeight
      }
    }));
  }, [initialResize, resizingWidget]);
  
  const handleResizeEnd = useCallback(() => {
    setResizingWidget(null);
    setInitialResize(null);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    // Show success toast
    toast({
      title: "Widget resized",
      description: "Widget size has been updated.",
      variant: "default",
    });
  }, [toast, handleResize]);

  // Handle minimizing and maximizing widgets
  const toggleMinimize = (widgetId: string) => {
    setWidgetStates(prev => ({
      ...prev,
      [widgetId]: {
        ...prev[widgetId],
        isMinimized: !prev[widgetId].isMinimized,
        isMaximized: false, // Reset maximized state when minimizing
      }
    }));
    
    toast({
      title: `Widget ${widgetStates[widgetId]?.isMinimized ? "expanded" : "minimized"}`,
      description: `Widget has been ${widgetStates[widgetId]?.isMinimized ? "expanded" : "minimized"}.`,
      variant: "default",
    });
  };
  
  const toggleMaximize = (widgetId: string) => {
    setWidgetStates(prev => ({
      ...prev,
      [widgetId]: {
        ...prev[widgetId],
        isMaximized: !prev[widgetId].isMaximized,
        isMinimized: false, // Reset minimized state when maximizing
      }
    }));
    
    toast({
      title: `Widget ${widgetStates[widgetId]?.isMaximized ? "restored" : "maximized"}`,
      description: `Widget has been ${widgetStates[widgetId]?.isMaximized ? "restored to original size" : "maximized"}.`,
      variant: "default",
    });
  };

  // Handle drag end event when widgets are reordered
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWidgets(items);
    
    // Show success message on widget reorder
    toast({
      title: "Dashboard updated",
      description: "Your widget layout has been saved.",
      variant: "default",
    });
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "away":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Away</Badge>;
      case "busy":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Busy</Badge>;
      case "offline":
        return <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">Offline</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "not_started":
        return <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">Not Started</Badge>;
      case "blocked":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render progress bar
  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  // Render the content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "team":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
              <AnimatedButton size="sm" className="flex items-center gap-1.5">
                <i className="ri-user-add-line"></i>
                <span>Add Member</span>
              </AnimatedButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member, index) => (
                <AnimatedCard 
                  key={member.id}
                  className="p-4"
                  fadeInDelay={index * 0.1}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{member.name}</h3>
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            member.status === "active" && "bg-green-500",
                            member.status === "away" && "bg-amber-500",
                            member.status === "busy" && "bg-red-500",
                            member.status === "offline" && "bg-gray-400"
                          )}></span>
                          <span className="text-xs text-muted-foreground capitalize">{member.status}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">{member.department}</p>
                      
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs text-primary hover:underline">View Profile</button>
                        <span className="text-xs text-muted-foreground">•</span>
                        <button className="text-xs text-primary hover:underline">Schedule 1:1</button>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </motion.div>
        );
        
      case "goals":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Goals & Objectives</h2>
              <AnimatedButton size="sm" className="flex items-center gap-1.5">
                <i className="ri-add-line"></i>
                <span>New Goal</span>
              </AnimatedButton>
            </div>
            
            <AnimatedTabs 
              items={[
                {
                  value: "all",
                  label: "All Goals",
                  content: (
                    <div className="mt-4 space-y-4">
                      {goals.map((goal, index) => (
                        <AnimatedCard 
                          key={goal.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                            </div>
                            {getStatusBadge(goal.status)}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm font-medium">{goal.progress}%</span>
                            {renderProgressBar(goal.progress)}
                          </div>
                          
                          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <i className="ri-user-line"></i>
                              <span>{goal.owner}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-calendar-line"></i>
                              <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-group-line"></i>
                              <span className="capitalize">{goal.type}</span>
                            </div>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                },
                {
                  value: "personal",
                  label: "Personal",
                  content: (
                    <div className="mt-4 space-y-4">
                      {goals.filter(g => g.type === "personal").map((goal, index) => (
                        <AnimatedCard 
                          key={goal.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                            </div>
                            {getStatusBadge(goal.status)}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm font-medium">{goal.progress}%</span>
                            {renderProgressBar(goal.progress)}
                          </div>
                          
                          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <i className="ri-user-line"></i>
                              <span>{goal.owner}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-calendar-line"></i>
                              <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                },
                {
                  value: "team",
                  label: "Team",
                  content: (
                    <div className="mt-4 space-y-4">
                      {goals.filter(g => g.type === "team").map((goal, index) => (
                        <AnimatedCard 
                          key={goal.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                            </div>
                            {getStatusBadge(goal.status)}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm font-medium">{goal.progress}%</span>
                            {renderProgressBar(goal.progress)}
                          </div>
                          
                          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <i className="ri-user-line"></i>
                              <span>{goal.owner}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-calendar-line"></i>
                              <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                },
                {
                  value: "company",
                  label: "Company",
                  content: (
                    <div className="mt-4 space-y-4">
                      {goals.filter(g => g.type === "company").map((goal, index) => (
                        <AnimatedCard 
                          key={goal.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                            </div>
                            {getStatusBadge(goal.status)}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm font-medium">{goal.progress}%</span>
                            {renderProgressBar(goal.progress)}
                          </div>
                          
                          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <i className="ri-user-line"></i>
                              <span>{goal.owner}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-calendar-line"></i>
                              <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                }
              ]}
              variant="underline"
            />
          </motion.div>
        );
        
      case "reviews":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Performance Reviews</h2>
              <AnimatedButton size="sm" className="flex items-center gap-1.5">
                <i className="ri-add-line"></i>
                <span>New Review</span>
              </AnimatedButton>
            </div>
            
            <AnimatedTabs 
              items={[
                {
                  value: "all",
                  label: "All Reviews",
                  content: (
                    <div className="mt-4 space-y-4">
                      {reviews.map((review, index) => (
                        <AnimatedCard 
                          key={review.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{review.subject}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Reviewee: <span className="font-medium">{review.reviewee}</span>
                              </p>
                            </div>
                            {getStatusBadge(review.status)}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm font-medium">{review.progress}%</span>
                            {renderProgressBar(review.progress)}
                          </div>
                          
                          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <i className="ri-user-line"></i>
                              <span>Reviewer: {review.reviewer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-calendar-line"></i>
                              <span>Due: {new Date(review.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-file-list-line"></i>
                              <span className="capitalize">
                                {review.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <AnimatedButton 
                              size="sm" 
                              variant="outline"
                              className="text-xs"
                            >
                              View Details
                            </AnimatedButton>
                            {review.status !== "completed" && (
                              <AnimatedButton 
                                size="sm"
                                className="text-xs"
                              >
                                {review.status === "scheduled" ? "Start Review" : "Continue"}
                              </AnimatedButton>
                            )}
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                },
                {
                  value: "in_progress",
                  label: "In Progress",
                  content: (
                    <div className="mt-4 space-y-4">
                      {reviews.filter(r => r.status === "in_progress").map((review, index) => (
                        <AnimatedCard 
                          key={review.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{review.subject}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Reviewee: <span className="font-medium">{review.reviewee}</span>
                              </p>
                            </div>
                            {getStatusBadge(review.status)}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm font-medium">{review.progress}%</span>
                            {renderProgressBar(review.progress)}
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <AnimatedButton 
                              size="sm" 
                              variant="outline"
                              className="text-xs"
                            >
                              View Details
                            </AnimatedButton>
                            <AnimatedButton 
                              size="sm"
                              className="text-xs"
                            >
                              Continue
                            </AnimatedButton>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                },
                {
                  value: "scheduled",
                  label: "Scheduled",
                  content: (
                    <div className="mt-4 space-y-4">
                      {reviews.filter(r => r.status === "scheduled").map((review, index) => (
                        <AnimatedCard 
                          key={review.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{review.subject}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Reviewee: <span className="font-medium">{review.reviewee}</span>
                              </p>
                            </div>
                            {getStatusBadge(review.status)}
                          </div>
                          
                          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <i className="ri-user-line"></i>
                              <span>Reviewer: {review.reviewer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-calendar-line"></i>
                              <span>Due: {new Date(review.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <AnimatedButton 
                              size="sm"
                              className="text-xs"
                            >
                              Start Review
                            </AnimatedButton>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                },
                {
                  value: "completed",
                  label: "Completed",
                  content: (
                    <div className="mt-4 space-y-4">
                      {reviews.filter(r => r.status === "completed").map((review, index) => (
                        <AnimatedCard 
                          key={review.id}
                          className="p-4"
                          fadeInDelay={index * 0.1}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{review.subject}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Reviewee: <span className="font-medium">{review.reviewee}</span>
                              </p>
                            </div>
                            {getStatusBadge(review.status)}
                          </div>
                          
                          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <i className="ri-user-line"></i>
                              <span>Reviewer: {review.reviewer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-calendar-line"></i>
                              <span>Completed: {new Date(review.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <AnimatedButton 
                              size="sm" 
                              variant="outline"
                              className="text-xs"
                            >
                              View Report
                            </AnimatedButton>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  )
                }
              ]}
              variant="underline"
            />
          </motion.div>
        );
        
      default: // Overview tab
        return (
          <>
            {/* Stats Cards Section with Staggered Animation */}
            <StaggeredChildren 
              className="pb-6" 
              staggerDelay={0.1} 
              direction="up"
            >
              <StatsCards 
                stats={{
                  teamMembers: dashboardData?.stats?.teamCount || 14,
                  reviewsInProgress: dashboardData?.stats?.reviewsInProgress || 8,
                  activeGoals: dashboardData?.stats?.activeGoalsCount || 23,
                  upcomingOneOnOnes: dashboardData?.stats?.upcomingOneOnOnes?.length || 5
                }}
                differences={{
                  teamMembers: "+2 since last month",
                  reviewsInProgress: "65% completion rate",
                  activeGoals: "4 due this week",
                  upcomingOneOnOnes: "2 scheduled for today"
                }}
                isLoading={isLoading}
              />
            </StaggeredChildren>
            
            {/* Mobile-optimized Swipe Container for Small Screens */}
            <div className="block lg:hidden mb-6">
              <h2 className="text-md font-semibold mb-2 text-gray-800">Quick Insights</h2>
              <div className="swipe-container flex overflow-x-auto gap-4 pb-4">
                <AnimatedCard className="min-w-[280px] p-4 flex-shrink-0">
                  <h3 className="text-sm font-semibold mb-2">Team Performance</h3>
                  <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Performance chart...</p>
                  </div>
                </AnimatedCard>
                
                <AnimatedCard className="min-w-[280px] p-4 flex-shrink-0">
                  <h3 className="text-sm font-semibold mb-2">Upcoming Reviews</h3>
                  <div className="h-40 flex flex-col justify-center gap-2">
                    <div className="flex justify-between items-center p-2 bg-secondary rounded-md">
                      <span className="text-xs">Sarah Johnson</span>
                      <span className="text-xs text-muted-foreground">May 24</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary rounded-md">
                      <span className="text-xs">Mike Peters</span>
                      <span className="text-xs text-muted-foreground">May 28</span>
                    </div>
                  </div>
                </AnimatedCard>
                
                <AnimatedCard className="min-w-[280px] p-4 flex-shrink-0">
                  <h3 className="text-sm font-semibold mb-2">Engagement Score</h3>
                  <div className="h-40 flex items-center justify-center">
                    <div className="relative h-24 w-24 flex items-center justify-center">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle 
                          className="text-gray-200" 
                          strokeWidth="10" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50" 
                        />
                        <circle 
                          className="text-primary progress-ring" 
                          strokeWidth="10" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="50" 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50" 
                        />
                      </svg>
                      <span className="absolute font-bold text-xl">80%</span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
            
            {/* Draggable Dashboard Grid - Desktop Layout */}
            <div className="hidden lg:block">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">My Dashboard</h2>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    variant={isEditMode ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => {
                      setIsEditMode(!isEditMode);
                      if (isEditMode) {
                        toast({
                          title: "Layout changes saved",
                          description: "Your dashboard customizations have been saved"
                        });
                      }
                    }}
                  >
                    {isEditMode ? (
                      <>
                        <Check size={14} /> Save Layout
                      </>
                    ) : (
                      <>
                        <Edit size={14} /> Edit Layout
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {isEditMode && (
                <div className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 px-4 py-2 rounded mb-4 border border-amber-200 dark:border-amber-900">
                  <LightbulbIcon size={16} className="mr-1" /> 
                  <p>Drag widgets to reorder them or resize by dragging the corner handles</p>
                </div>
              )}
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="dashboard-widgets">
                  {(provided) => (
                    <div 
                      className="grid grid-cols-1 lg:grid-cols-6 gap-4 auto-rows-min"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {widgets.map((widget, index) => (
                        <Draggable 
                          key={widget.id} 
                          draggableId={widget.id} 
                          index={index}
                          isDragDisabled={!isEditMode}
                        >
                          {(provided, snapshot) => {
                            const isMinimized = widgetStates[widget.id]?.isMinimized || false;
                            const isMaximized = widgetStates[widget.id]?.isMaximized || false;
                            
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                id={`widget-${widget.id}`}
                                className={cn(
                                  widget.colSpan || "",
                                  "transition-all duration-200",
                                  snapshot.isDragging && "z-50",
                                  isMaximized && "col-span-3 row-span-2 z-40",
                                  isMinimized && "h-auto"
                                )}
                                style={{
                                  ...(isMaximized ? {
                                    position: "absolute",
                                    left: "1rem",
                                    right: "1rem",
                                    top: "5rem",
                                    bottom: "1rem",
                                    width: "calc(100% - 2rem)",
                                    height: "calc(100% - 6rem)",
                                    zIndex: 50
                                  } : widgetSizes[widget.id] ? {
                                    width: `${widgetSizes[widget.id].width}px`,
                                    height: `${widgetSizes[widget.id].height}px`
                                  } : {})
                                }}
                              >
                                <motion.div 
                                  className="bg-white border border-border rounded-lg overflow-hidden flex flex-col h-full"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ 
                                    opacity: isLoaded ? 1 : 0, 
                                    y: isLoaded ? 0 : 20,
                                    scale: snapshot.isDragging ? 1.02 : 1,
                                    boxShadow: isMaximized 
                                      ? "0 10px 45px -5px rgba(0, 0, 0, 0.2)" 
                                      : (snapshot.isDragging ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "none")
                                  }}
                                  transition={{ 
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: index * 0.1 + 0.3
                                  }}
                                >
                                  <div 
                                    className={cn(
                                      "p-3 border-b border-border bg-gradient-to-r from-white to-gray-50 flex items-center justify-between",
                                      isMaximized && "bg-gradient-to-r from-blue-50 to-indigo-50",
                                      isEditMode && "cursor-move"
                                    )}
                                    {...(isEditMode ? provided.dragHandleProps : {})}
                                  >
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mr-2">
                                        <circle cx="8" cy="6" r="1"/>
                                        <circle cx="8" cy="12" r="1"/>
                                        <circle cx="8" cy="18" r="1"/>
                                        <circle cx="16" cy="6" r="1"/>
                                        <circle cx="16" cy="12" r="1"/>
                                        <circle cx="16" cy="18" r="1"/>
                                      </svg>
                                      <span className="font-medium">{widget.title}</span>
                                    </div>
                                    
                                    {/* Widget controls */}
                                    <div className="flex items-center space-x-1">
                                      <button 
                                        className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleMinimize(widget.id);
                                        }}
                                        title={isMinimized ? "Expand" : "Minimize"}
                                      >
                                        {isMinimized ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                          </svg>
                                        ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                          </svg>
                                        )}
                                      </button>
                                      <button 
                                        className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleMaximize(widget.id);
                                        }}
                                        title={isMaximized ? "Restore" : "Maximize"}
                                      >
                                        {isMaximized ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                            <polyline points="4 14 10 14 10 20" />
                                            <polyline points="20 10 14 10 14 4" />
                                            <line x1="14" y1="10" x2="21" y2="3" />
                                            <line x1="3" y1="21" x2="10" y2="14" />
                                          </svg>
                                        ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                            <polyline points="15 3 21 3 21 9" />
                                            <polyline points="9 21 3 21 3 15" />
                                            <line x1="21" y1="3" x2="14" y2="10" />
                                            <line x1="3" y1="21" x2="10" y2="14" />
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Widget content area */}
                                  {!isMinimized && (
                                    <div className="p-4 h-full overflow-auto flex-1 relative">
                                      <div className="h-full relative">
                                        {widget.component}
                                      </div>
                                      
                                      {/* Resize handles - bottom right (only visible in edit mode) */}
                                      {isEditMode && (
                                        <div 
                                          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize group"
                                          onMouseDown={(e) => handleResizeStart(e, widget.id)}
                                        >
                                          <div className="absolute bottom-0 right-0 w-0 h-0 border-b-8 border-r-8 border-primary/30 group-hover:border-primary transition-colors"></div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </motion.div>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </>
        );
    }
  };

  return (
    <PageTransition direction="up">
      <Helmet>
        <title>Dashboard | Proxa People Management</title>
        <meta name="description" content="Proxa dashboard showing team performance, upcoming reviews, goals, and engagement metrics." />
      </Helmet>
      
      {/* Page Title with Animation */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2
        }}
      >
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Ashley! Here's an overview of your team's progress.</p>
      </motion.div>
      
      {/* Quick Actions Row - Clean and Minimal */}
      <div className="mb-6 mt-4">
        <div className="flex flex-wrap gap-2">
          <NewReviewDialog />
          <ScheduleMeetingDialog />
          <NewSurveyDialog />
        </div>
      </div>
      
      {/* Dashboard Tabs - Clean Design */}
      <div className="mb-6 border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button 
            className={`px-6 py-2.5 text-sm font-medium ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-6 py-2.5 text-sm font-medium ${activeTab === 'team' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('team')}
          >
            Team
          </button>
          <button 
            className={`px-6 py-2.5 text-sm font-medium ${activeTab === 'goals' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('goals')}
          >
            Goals
          </button>
          <button 
            className={`px-6 py-2.5 text-sm font-medium ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('reviews')}
          >
            Reviews
          </button>
        </div>
      </div>
      
      {/* Dynamic Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  );
}
