import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "full" | "none";
  fadeInDelay?: number;
}

export function AnimatedSkeleton({
  className,
  width,
  height,
  rounded = "md",
  fadeInDelay = 0,
  ...props
}: AnimatedSkeletonProps) {
  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };

  const shimmerVariants = {
    initial: {
      backgroundPosition: "-500px 0",
    },
    animate: {
      backgroundPosition: ["500px 0"],
      transition: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 1.5,
        ease: "linear",
        delay: fadeInDelay,
      },
    },
  };

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden bg-slate-200 dark:bg-slate-700", 
        roundedMap[rounded],
        className
      )}
      style={{ 
        width: width ? width : '100%', 
        height: height ? height : '20px',
        backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)",
        backgroundSize: "500px 100%",
        backgroundRepeat: "no-repeat"
      }}
      initial="initial"
      animate="animate"
      variants={shimmerVariants}
      {...props}
    />
  );
}

export function AnimatedSkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <AnimatedSkeleton className="h-6 w-2/5" fadeInDelay={0.1} />
      <AnimatedSkeleton className="h-4 w-4/5" fadeInDelay={0.2} />
      <AnimatedSkeleton className="h-4 w-3/5" fadeInDelay={0.3} />
      <div className="pt-2">
        <AnimatedSkeleton className="h-8 w-full rounded-lg" fadeInDelay={0.4} />
      </div>
    </div>
  );
}

export function AnimatedSkeletonProfile({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center space-x-4", className)} {...props}>
      <AnimatedSkeleton className="h-12 w-12 rounded-full" fadeInDelay={0.1} />
      <div className="space-y-2 flex-1">
        <AnimatedSkeleton className="h-4 w-1/3" fadeInDelay={0.2} />
        <AnimatedSkeleton className="h-3 w-1/2" fadeInDelay={0.3} />
      </div>
    </div>
  );
}

export function AnimatedSkeletonStats({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="flex justify-between">
        <AnimatedSkeleton className="h-6 w-1/4" fadeInDelay={0.1} />
        <AnimatedSkeleton className="h-6 w-1/5" fadeInDelay={0.2} />
      </div>
      <AnimatedSkeleton className="h-24 w-full rounded-lg" fadeInDelay={0.3} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedSkeleton className="h-16 rounded-lg" fadeInDelay={0.4} />
        <AnimatedSkeleton className="h-16 rounded-lg" fadeInDelay={0.5} />
        <AnimatedSkeleton className="h-16 rounded-lg" fadeInDelay={0.6} />
        <AnimatedSkeleton className="h-16 rounded-lg" fadeInDelay={0.7} />
      </div>
    </div>
  );
}

export default AnimatedSkeleton;