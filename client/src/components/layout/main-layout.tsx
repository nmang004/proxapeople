import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [location] = useLocation();

  // Check device size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [location]);

  // Add a small delay for initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle mobile scroll behavior
  useEffect(() => {
    if (isMobileSidebarOpen && isMobile) {
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileSidebarOpen, isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar - Animated */}
      <AnimatePresence mode="wait">
        <motion.div 
          className="hidden md:block z-30"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.2
          }}
        >
          <Sidebar />
        </motion.div>
      </AnimatePresence>
      
      {/* Mobile Sidebar - Enhanced */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent 
          side="right" 
          className="p-0 w-[280px] sm:w-[320px] border-l-0 focus:outline-none"
        >
          <div className="relative h-full">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Content - Animated */}
      <motion.div 
        className="flex flex-col flex-1 overflow-hidden w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header - Animated */}
        <motion.div
          className="sticky top-0 z-20"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.3
          }}
        >
          <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />
        </motion.div>
        
        {/* Page Content with subtle fade-in animation and improved mobile padding */}
        <motion.main 
          className={cn(
            "flex-1 relative overflow-y-auto focus:outline-none bg-background",
            "p-3 sm:p-4 md:p-6", // Progressive padding for different screen sizes
            "pb-20 md:pb-6" // Extra bottom padding on mobile for fixed navigation
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            y: isLoaded ? 0 : 20 
          }}
          transition={{ 
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4
          }}
        >
          {children}
        </motion.main>
        
        {/* Mobile Fixed Bottom Navigation */}
        <motion.div 
          className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-between z-20"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.6
          }}
        >
          {/* Reviews on far left */}
          <NavButton 
            icon="ri-award-line" 
            label="Reviews" 
            href="/reviews" 
            active={location === "/reviews"}
            badge={3}
            className="flex-1"
          />
          <NavButton 
            icon="ri-flag-line" 
            label="Goals" 
            href="/goals" 
            active={location === "/goals"}
            className="flex-1"
          />
          {/* Dashboard centered */}
          <NavButton 
            icon="ri-dashboard-line" 
            label="Dashboard" 
            href="/dashboard" 
            active={location === "/dashboard"}
            className="flex-1"
          />
          <NavButton 
            icon="ri-team-line" 
            label="Team" 
            href="/employees" 
            active={location === "/employees"}
            className="flex-1"
          />
          <NavButton 
            icon="ri-more-2-line" 
            label="More" 
            href="/more" 
            active={false}
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex-1"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Mobile Navigation Button Component
interface NavButtonProps {
  icon: string;
  label: string;
  href: string;
  active: boolean;
  badge?: number;
  onClick?: () => void;
  className?: string;
}

function NavButton({ icon, label, href, active, badge, onClick, className }: NavButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex flex-col items-center justify-center p-0 h-auto w-16 gap-1 rounded-lg transition-all", 
        active ? "text-primary" : "text-muted-foreground",
        "active:scale-95 hover:bg-transparent",
        className
      )}
      asChild={!onClick}
      onClick={onClick}
    >
      {onClick ? (
        <div>
          <div className="relative">
            <i className={cn(icon, "text-lg")}></i>
            {badge && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                {badge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </div>
      ) : (
        <a href={href}>
          <div className="relative">
            <i className={cn(icon, "text-lg")}></i>
            {badge && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                {badge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </a>
      )}
    </Button>
  );
}
