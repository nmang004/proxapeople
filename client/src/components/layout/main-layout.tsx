import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Add a small delay for initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - Animated */}
      <AnimatePresence mode="wait">
        <motion.div 
          className="hidden md:block"
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
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[250px] sm:w-[300px]">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      {/* Main Content - Animated */}
      <motion.div 
        className="flex flex-col flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header - Animated */}
        <motion.div
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
        
        {/* Page Content with subtle fade-in animation */}
        <motion.main 
          className="flex-1 relative overflow-y-auto focus:outline-none bg-neutral-50 p-4 md:p-6"
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
      </motion.div>
    </div>
  );
}
