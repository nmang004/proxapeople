import { useState, useEffect } from "react";
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

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Simulating data fetch for dashboard stats
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    staleTime: 60000,
  });
  
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
            
            {/* Main Dashboard Content - Desktop Layout */}
            <div className="hidden lg:grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Team Performance & Upcoming Reviews */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isLoaded ? 1 : 0, 
                    y: isLoaded ? 0 : 20 
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3
                  }}
                >
                  <TeamPerformance />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isLoaded ? 1 : 0, 
                    y: isLoaded ? 0 : 20 
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.4
                  }}
                >
                  <UpcomingReviews />
                </motion.div>
              </div>
              
              {/* Right Column - Team Goals & 1:1 Meetings */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: isLoaded ? 1 : 0, 
                  x: isLoaded ? 0 : 20 
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.5
                }}
              >
                <TeamGoals />
                <OneOnOneMeetings />
                <EngagementScore />
              </motion.div>
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
