import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  fadeInDelay?: number;
}

export function AnimatedCard({
  children,
  className,
  hoverEffect = true,
  fadeInDelay = 0,
  ...props
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg p-5 border border-slate-200",
        hoverEffect && "transition-all duration-300 ease-in-out hover:shadow-lg",
        isHovered && "shadow-xl border-primary/20 scale-[1.01]",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0],
          delay: fadeInDelay
        } 
      }}
      onMouseEnter={() => hoverEffect && setIsHovered(true)}
      onMouseLeave={() => hoverEffect && setIsHovered(false)}
      whileHover={hoverEffect ? { 
        scale: 1.01, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        borderColor: "rgba(151, 71, 255, 0.2)"
      } : {}}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;