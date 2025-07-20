import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  bgColor?: string;
  fgColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 12,
  className,
  bgColor = "hsl(var(--muted))",
  fgColor = "hsl(var(--primary))",
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg className="progress-ring w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          fill="none" 
          stroke={bgColor} 
          strokeWidth={strokeWidth} 
        />
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          fill="none" 
          stroke={fgColor} 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
