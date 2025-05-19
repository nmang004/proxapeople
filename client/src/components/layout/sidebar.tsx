import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { ProxaLogo } from "@/components/ui/proxa-logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";

type SidebarLink = {
  href: string;
  label: string;
  icon: string;
  category?: string;
  badge?: {
    count?: number;
    type?: "default" | "primary" | "secondary" | "danger" | "warning";
  };
};

const links: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line", category: "Overview" },
  { 
    href: "/employees", 
    label: "Employee Directory", 
    icon: "ri-team-line", 
    category: "People",
    badge: { count: 2, type: "primary" }
  },
  { 
    href: "/reviews", 
    label: "Performance Reviews", 
    icon: "ri-award-line", 
    category: "People",
    badge: { count: 3, type: "danger" }
  },
  { href: "/goals", label: "Goals & OKRs", icon: "ri-flag-line", category: "Performance" },
  { href: "/one-on-one", label: "1:1 Meetings", icon: "ri-chat-1-line", category: "Performance" },
  { href: "/surveys", label: "Surveys", icon: "ri-survey-line", category: "Feedback" },
  { href: "/analytics", label: "Analytics", icon: "ri-bar-chart-box-line", category: "Insights" },
  { href: "/profile", label: "Profile", icon: "ri-user-settings-line", category: "Settings" },
  { href: "/settings", label: "Platform Settings", icon: "ri-settings-line", category: "Settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-expand the category of the current location
  useEffect(() => {
    const currentLink = links.find(link => link.href === location);
    if (currentLink && currentLink.category) {
      setExpandedCategory(currentLink.category);
    }
  }, [location]);

  // Group links by category
  const linksByCategory = links.reduce((acc, link) => {
    const category = link.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, SidebarLink[]>);

  // Order categories
  const categoryOrder = ["Overview", "People", "Performance", "Feedback", "Insights", "Settings", "Other"];
  const sortedCategories = Object.keys(linksByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategory(prev => prev === category ? null : category);
  };
  
  // Get badge style
  const getBadgeStyle = (type?: string) => {
    switch(type) {
      case "primary":
        return "bg-primary text-primary-foreground";
      case "secondary":
        return "bg-secondary text-secondary-foreground";
      case "danger":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-amber-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  return (
    <div className="flex flex-shrink-0 h-full">
      <div className="flex flex-col w-full md:w-64 border-r border-neutral-200 bg-white shadow-sm">
        {/* Logo */}
        <motion.div 
          className="flex items-center h-16 px-4 md:px-6 border-b border-neutral-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <ProxaLogo variant="full" size="md" />
          </div>
          
          {/* Mobile Only - Version Label */}
          <div className="md:hidden ml-auto">
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">Proxa People</Badge>
          </div>
        </motion.div>
        
        {/* User Profile - Mobile Only */}
        <motion.div 
          className="md:hidden flex items-center p-3 border-b border-neutral-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Avatar className="h-9 w-9 border-2 border-primary/10">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="Ashley Johnson" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="flex-1 ml-3">
            <p className="text-sm font-medium">Ashley Johnson</p>
            <p className="text-xs text-muted-foreground">HR Director</p>
          </div>
          <AnimatedButton variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0">
            <i className="ri-settings-3-line"></i>
          </AnimatedButton>
        </motion.div>
        
        {/* Sidebar Links */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 md:px-3 py-4">
            {sortedCategories.map((category, categoryIndex) => (
              <motion.div 
                key={category} 
                className="mb-3 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.1 + (categoryIndex * 0.05),
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {/* Category Header - Clickable on Mobile */}
                <div 
                  className={cn(
                    "group px-3 mb-1 flex justify-between items-center",
                    isMobile && "cursor-pointer touch-button py-2"
                  )}
                  onClick={() => isMobile && toggleCategory(category)}
                >
                  <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                  {isMobile && (
                    <motion.i 
                      className="ri-arrow-down-s-line text-slate-400"
                      animate={{ rotate: expandedCategory === category ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
                
                {/* Links for this category */}
                <AnimatePresence initial={false}>
                  {(!isMobile || expandedCategory === category) && (
                    <motion.div 
                      className="space-y-1"
                      initial={isMobile ? { height: 0, opacity: 0 } : { opacity: 1 }}
                      animate={isMobile ? { height: "auto", opacity: 1 } : { opacity: 1 }}
                      exit={isMobile ? { height: 0, opacity: 0 } : { opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {linksByCategory[category].map((link, linkIndex) => (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.1 + (linkIndex * 0.05),
                            ease: [0.22, 1, 0.36, 1]
                          }}
                        >
                          <Link href={link.href}>
                            <Button 
                              variant="ghost"
                              className={cn(
                                "sidebar-link justify-start w-full transition-all py-3 h-auto md:h-10", 
                                location === link.href ? "active" : ""
                              )}
                            >
                              <i className={cn(link.icon, "mr-3 text-lg opacity-80")} />
                              <span className="flex-1 text-left">{link.label}</span>
                              {link.badge && link.badge.count && (
                                <Badge className={cn("ml-auto", getBadgeStyle(link.badge.type))}>
                                  {link.badge.count}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>

          {/* User Profile - Desktop Only */}
          <motion.div 
            className="mt-auto p-4 hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Separator className="mb-4" />
            <div className="flex items-center px-2 group hover:bg-primary/5 rounded-lg transition-all duration-200 py-2 cursor-pointer">
              <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-200">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="Ashley Johnson" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className="flex-1 ml-3">
                <p className="text-sm font-medium">Ashley Johnson</p>
                <p className="text-xs text-slate-500">HR Director</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ri-logout-box-line text-slate-500"></i>
              </Button>
            </div>
            
            {/* App Version */}
            <div className="mt-4 flex justify-center">
              <span className="text-xs text-slate-400">Proxa People</span>
            </div>
          </motion.div>
          
          {/* Mobile Quick Actions */}
          <motion.div 
            className="border-t border-neutral-100 p-2 flex md:hidden items-center justify-around"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <i className="ri-search-line"></i>
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <i className="ri-notification-3-line"></i>
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <i className="ri-message-3-line"></i>
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <i className="ri-question-line"></i>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
