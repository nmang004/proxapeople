import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.3, 
            ease: [0.4, 0.0, 0.2, 1] 
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -20,
          transition: { 
            duration: 0.2, 
            ease: [0.4, 0.0, 0.2, 1] 
          }
        }}
        className="w-full h-full"
        onAnimationComplete={handleAnimationEnd}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;