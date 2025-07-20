import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  fadeInDelay?: number;
  className?: string;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, fadeInDelay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: fadeInDelay,
          ease: "easeOut"
        }}
        whileHover={{
          y: -3,
          transition: { duration: 0.2 }
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);