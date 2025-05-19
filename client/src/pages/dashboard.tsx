import { useState, useEffect } from "react";
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
import { motion } from "framer-motion";

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="gradient-text">Dashboard</span>
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back, Ashley! Here's an overview of your team's progress.</p>
      </motion.div>
      
      {/* Quick Actions Row - Mobile Optimized */}
      <div className="mb-6 -mt-2 overflow-x-auto scrollbar-hide py-2">
        <div className="flex gap-2 min-w-max">
          <AnimatedButton 
            variant="outline" 
            size="sm"
            glowEffect
            className="touch-button flex items-center gap-1.5"
          >
            <i className="ri-add-line"></i>
            <span>New Review</span>
          </AnimatedButton>
          
          <AnimatedButton 
            variant="outline" 
            size="sm"
            className="touch-button flex items-center gap-1.5"
          >
            <i className="ri-calendar-line"></i>
            <span>Schedule 1:1</span>
          </AnimatedButton>
          
          <AnimatedButton 
            variant="outline" 
            size="sm"
            className="touch-button flex items-center gap-1.5"
          >
            <i className="ri-survey-line"></i>
            <span>New Survey</span>
          </AnimatedButton>
          
          <AnimatedButton 
            variant="outline" 
            size="sm"
            className="touch-button flex items-center gap-1.5"
          >
            <i className="ri-file-list-line"></i>
            <span>Export</span>
          </AnimatedButton>
        </div>
      </div>
      
      {/* Dashboard Tabs - Mobile Friendly */}
      <div className="mb-6 border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button 
            className={`px-4 py-2 text-sm font-medium tab-underline ${activeTab === 'overview' ? 'active text-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium tab-underline ${activeTab === 'team' ? 'active text-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('team')}
          >
            Team
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium tab-underline ${activeTab === 'goals' ? 'active text-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('goals')}
          >
            Goals
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium tab-underline ${activeTab === 'reviews' ? 'active text-primary' : 'text-muted-foreground'}`}
            onClick={() => handleTabChange('reviews')}
          >
            Reviews
          </button>
        </div>
      </div>
      
      {/* Stats Cards Section with Staggered Animation */}
      <StaggeredChildren 
        className="pb-6" 
        staggerDelay={0.1} 
        direction="up"
      >
        <StatsCards />
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
    </PageTransition>
  );
}
