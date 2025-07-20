import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
  delay?: number;
  distance?: number;
  once?: boolean;
}

export function PageTransition({
  children,
  className,
  direction = "up",
  duration = 0.4,
  delay = 0,
  distance = 20,
  once = true,
}: PageTransitionProps) {
  // Calculate the initial animation values based on direction
  const getInitialAnimation = () => {
    const initialAnimation: any = { opacity: 0 };
    
    // Add directional animation
    switch (direction) {
      case "up":
        initialAnimation.y = distance;
        break;
      case "down":
        initialAnimation.y = -distance;
        break;
      case "left":
        initialAnimation.x = distance;
        break;
      case "right":
        initialAnimation.x = -distance;
        break;
      case "fade":
        // Only fade, no movement
        break;
    }
    
    return initialAnimation;
  };

  // Determine end animation values (usually just the default position)
  const getEndAnimation = () => {
    const endAnimation: any = { opacity: 1 };
    
    if (direction === "up" || direction === "down") {
      endAnimation.y = 0;
    }
    
    if (direction === "left" || direction === "right") {
      endAnimation.x = 0;
    }
    
    return endAnimation;
  };

  // Check if reduced motion is preferred
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
      : false;

  // If reduced motion is preferred, simplify the animation
  const initialAnimation = prefersReducedMotion 
    ? { opacity: 0 } 
    : getInitialAnimation();
    
  const endAnimation = prefersReducedMotion 
    ? { opacity: 1 } 
    : getEndAnimation();

  // Apply shorter duration for mobile
  const isMobile = 
    typeof window !== 'undefined' 
      ? window.matchMedia("(max-width: 768px)").matches 
      : false;
  
  const animationDuration = isMobile ? Math.max(0.2, duration * 0.7) : duration;

  return (
    <motion.div
      className={cn("", className)}
      initial={initialAnimation}
      animate={endAnimation}
      transition={{
        duration: animationDuration,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      viewport={{ once }}
    >
      {children}
    </motion.div>
  );
}

// Staggered children transition
interface StaggeredChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  childrenClassName?: string;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export function StaggeredChildren({
  children,
  className,
  staggerDelay = 0.1,
  childrenClassName,
  duration = 0.3,
  distance = 15,
  direction = "up",
}: StaggeredChildrenProps) {
  // Check if reduced motion is preferred
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
      : false;

  // Convert children to array
  const childrenArray = React.Children.toArray(children);
  
  // Get animation direction values
  const getDirectionValues = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      case "fade":
        return {};
    }
  };

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          className={childrenClassName}
          initial={prefersReducedMotion ? { opacity: 0 } : { 
            opacity: 0,
            ...getDirectionValues()
          }}
          animate={prefersReducedMotion ? { opacity: 1 } : { 
            opacity: 1,
            x: 0,
            y: 0
          }}
          transition={{
            duration,
            delay: staggerDelay * index,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export default PageTransition;