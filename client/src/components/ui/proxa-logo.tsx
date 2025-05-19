import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ProxaLogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
}

export function ProxaLogo({
  variant = "full",
  size = "md",
  className,
  ...props
}: ProxaLogoProps) {
  const sizeClasses = {
    sm: variant === "full" ? "h-6" : "h-6 w-6",
    md: variant === "full" ? "h-8" : "h-8 w-8",
    lg: variant === "full" ? "h-10" : "h-10 w-10",
  };

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {variant === "full" ? (
        <svg
          className={cn(sizeClasses[size])}
          viewBox="0 0 170 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Square icons */}
          <path
            d="M15 0L0 0L0 15C0 6.716 6.716 0 15 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M30 0L15 0C23.284 0 30 6.716 30 15L30 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M30 15L30 30L15 30C23.284 30 30 23.284 30 15Z"
            fill="#9C5AFF"
          />
          <path
            d="M15 30L0 30L0 15C0 23.284 6.716 30 15 30Z"
            fill="#9C5AFF"
          />
          
          {/* Second square */}
          <path
            d="M45 0L30 0L30 15C30 6.716 36.716 0 45 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M60 0L45 0C53.284 0 60 6.716 60 15L60 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M60 15L60 30L45 30C53.284 30 60 23.284 60 15Z"
            fill="#9C5AFF"
          />
          <path
            d="M45 30L30 30L30 15C30 23.284 36.716 30 45 30Z"
            fill="#9C5AFF"
          />

          {/* DIOY Text */}
          <path
            d="M70 5H80C87 5 92 10 92 17.5C92 25 87 30 80 30H70V5Z"
            fill="#9C5AFF"
          />
          <path
            d="M100 5H110V30H100V5Z"
            fill="#9C5AFF"
          />
          <path
            d="M120 17.5C120 10 125 5 132.5 5C140 5 145 10 145 17.5C145 25 140 30 132.5 30C125 30 120 25 120 17.5ZM132.5 22.5C135 22.5 137 20.5 137 17.5C137 14.5 135 12.5 132.5 12.5C130 12.5 128 14.5 128 17.5C128 20.5 130 22.5 132.5 22.5Z"
            fill="#9C5AFF"
          />
          <path
            d="M150 5H162.5L170 17.5L162.5 30H150L157.5 17.5L150 5Z"
            fill="#9C5AFF"
          />
        </svg>
      ) : (
        <svg
          className={cn(sizeClasses[size])}
          viewBox="0 0 60 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* First square */}
          <path
            d="M15 0L0 0L0 15C0 6.716 6.716 0 15 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M30 0L15 0C23.284 0 30 6.716 30 15L30 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M30 15L30 30L15 30C23.284 30 30 23.284 30 15Z"
            fill="#9C5AFF"
          />
          <path
            d="M15 30L0 30L0 15C0 23.284 6.716 30 15 30Z"
            fill="#9C5AFF"
          />
          
          {/* Second square */}
          <path
            d="M45 0L30 0L30 15C30 6.716 36.716 0 45 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M60 0L45 0C53.284 0 60 6.716 60 15L60 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M60 15L60 30L45 30C53.284 30 60 23.284 60 15Z"
            fill="#9C5AFF"
          />
          <path
            d="M45 30L30 30L30 15C30 23.284 36.716 30 45 30Z"
            fill="#9C5AFF"
          />
        </svg>
      )}
    </div>
  );
}