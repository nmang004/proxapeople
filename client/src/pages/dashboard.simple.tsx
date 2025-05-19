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
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit, Check, LightbulbIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  colSpan?: string;
}

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    staleTime: 60000,
  });
  
  // Define widget configuration
  const widgets = [
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
      colSpan: "col-span-6"
    },
    { 
      id: "team-performance", 
      title: "Team Performance", 
      component: <TeamPerformance />,
      colSpan: "col-span-3"
    },
    { 
      id: "team-goals", 
      title: "Team Goals", 
      component: <TeamGoals />,
      colSpan: "col-span-2"
    },
    { 
      id: "upcoming-reviews", 
      title: "Upcoming Reviews", 
      component: <UpcomingReviews />,
      colSpan: "col-span-3"
    },
    { 
      id: "one-on-one-meetings", 
      title: "Upcoming 1:1s", 
      component: <OneOnOneMeetings />,
      colSpan: "col-span-2"
    },
    { 
      id: "engagement-score", 
      title: "Team Engagement", 
      component: <EngagementScore />,
      colSpan: "col-span-1"
    }
  ];
  
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

  // Render dashboard view
  const renderDashboard = () => {
    return (
      <div className="mt-6">
        {/* Edit Mode Hint */}
        {isEditMode && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-md mb-4 flex items-start">
            <LightbulbIcon size={16} className="mr-1" /> 
            <p>You're in edit mode - changes to the dashboard layout will be saved when you click "Save Layout"</p>
          </div>
        )}
        
        {/* Dashboard Header */}
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

        {/* Simple Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 auto-rows-min">
          {widgets.map((widget, index) => (
            <div 
              key={widget.id}
              className={cn(
                widget.colSpan || "",
                "transition-all duration-200"
              )}
            >
              <motion.div 
                className="bg-white dark:bg-gray-900 border border-border rounded-lg overflow-hidden flex flex-col h-full shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isLoaded ? 1 : 0, 
                  y: isLoaded ? 0 : 20
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.1 + 0.3
                }}
              >
                <div className="p-3 border-b border-border bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{widget.title}</span>
                  </div>
                </div>
                <div className="p-4 h-full overflow-auto flex-1 relative">
                  <div className="h-full relative">
                    {widget.component}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Helmet>
        <title>Dashboard | Proxa People</title>
      </Helmet>
      
      <PageTransition>
        <div className="container px-4 py-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto">
          <StaggeredChildren>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your personalized dashboard</p>
            </div>
            
            {/* Dashboard Tabs */}
            <div className="border-b mb-6">
              <div className="flex overflow-x-auto no-scrollbar">
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
            
            {/* Dashboard Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderDashboard()}
              </motion.div>
            </AnimatePresence>
          </StaggeredChildren>
        </div>
      </PageTransition>
    </>
  );
}