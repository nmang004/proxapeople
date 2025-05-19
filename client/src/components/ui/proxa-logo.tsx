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
          viewBox="0 0 280 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M52.5 0H0V52.5C0 23.5 23.5 0 52.5 0Z"
            fill="#9747FF"
          />
          <path
            d="M0 52.5V80H27.5C12.3 80 0 67.7 0 52.5Z"
            fill="#9747FF"
          />
          <path
            d="M52.5 80H80V27.5C80 56.5 56.5 80 27.5 80H52.5Z"
            fill="#9747FF"
          />
          <path
            d="M113.3 20.4H99.9V61.5H113.3V45.3H129.6V34.6H113.3V20.4Z"
            fill="#9747FF"
          />
          <path
            d="M155.5 20.4H141.7V61.5H155.5V42.9L171.8 61.5H188.1L167.3 40.1L186.3 20.4H170.6L155.5 34.6V20.4Z"
            fill="#9747FF"
          />
          <path
            d="M212.9 20.4C197.3 20.4 187.1 29.9 187.1 40.9C187.1 51.9 197.3 61.5 212.9 61.5C228.5 61.5 238.7 51.9 238.7 40.9C238.7 29.9 228.5 20.4 212.9 20.4ZM212.9 32.2C220.3 32.2 224.9 36.1 224.9 40.9C224.9 45.8 220.3 49.7 212.9 49.7C205.5 49.7 200.9 45.8 200.9 40.9C200.9 36.1 205.5 32.2 212.9 32.2Z"
            fill="#9747FF"
          />
          <path
            d="M271.6 20.4H241.1V32.2H249.8V61.5H263V32.2H271.6V20.4Z"
            fill="#9747FF"
          />
          <path
            d="M273.3 40.9C273.3 51.9 283 61.5 298.1 61.5H285.5C274.7 61.5 273.3 51.9 273.3 40.9Z"
            fill="#9747FF"
          />
          <path
            d="M298.1 20.4C283 20.4 273.3 29.9 273.3 40.9C273.3 29.9 274.7 20.4 285.5 20.4H298.1Z"
            fill="#9747FF"
          />
        </svg>
      ) : (
        <svg
          className={cn(sizeClasses[size])}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M52.5 0H0V52.5C0 23.5 23.5 0 52.5 0Z"
            fill="#9747FF"
          />
          <path
            d="M0 52.5V80H27.5C12.3 80 0 67.7 0 52.5Z"
            fill="#9747FF"
          />
          <path
            d="M52.5 80H80V27.5C80 56.5 56.5 80 27.5 80H52.5Z"
            fill="#9747FF"
          />
        </svg>
      )}
    </div>
  );
}