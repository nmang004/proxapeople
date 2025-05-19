import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
import { useState } from "react";

interface AnimatedButtonProps extends ButtonProps {
  glowEffect?: boolean;
  pulseEffect?: boolean;
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  glowEffect = false,
  pulseEffect = false,
  ...props
}: AnimatedButtonProps) {
  const [isPressing, setIsPressing] = useState(false);
  
  // Base button classes
  const buttonClasses = buttonVariants({ variant, size, className: cn(
    glowEffect && "btn-glow",
    className
  )});

  return (
    <motion.button
      className={buttonClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={pulseEffect ? { scale: 1 } : {}}
      animate={pulseEffect ? {
        scale: [1, 1.03, 1],
        boxShadow: [
          "0 0 0 0 rgba(151, 71, 255, 0)",
          "0 0 0 10px rgba(151, 71, 255, 0.1)",
          "0 0 0 0 rgba(151, 71, 255, 0)"
        ]
      } : {}}
      transition={pulseEffect ? {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatType: "loop"
      } : {
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => isPressing && setIsPressing(false)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;