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
          viewBox="0 0 300 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* "P" shape */}
          <path
            d="M52.5 0H0V52.5C0 23.5 23.5 0 52.5 0Z"
            fill="#9C5AFF"
          />
          <path
            d="M0 52.5V80H27.5C12.3 80 0 67.7 0 52.5Z"
            fill="#9C5AFF"
          />
          <path
            d="M52.5 80H80V27.5C80 56.5 56.5 80 27.5 80H52.5Z"
            fill="#9C5AFF"
          />
          
          {/* "PROXA" text */}
          <path 
            d="M100 20H120C134 20 145 30 145 45C145 60 134 70 120 70H100V20ZM120 55C125 55 130 50 130 45C130 40 125 35 120 35H115V55H120Z" 
            fill="#9C5AFF"
          />
          <path 
            d="M150 20H165V70H150V20Z" 
            fill="#9C5AFF"
          />
          <path 
            d="M170 45C170 30 182 18 197 18C212 18 224 30 224 45C224 60 212 72 197 72C182 72 170 60 170 45ZM197 57C203 57 208 52 208 45C208 38 203 33 197 33C191 33 186 38 186 45C186 52 191 57 197 57Z" 
            fill="#9C5AFF"
          />
          <path 
            d="M230 20H245L260 43L275 20H290L265 55V70H250V55L230 20Z" 
            fill="#9C5AFF"
          />
          <path 
            d="M295 45C295 30 307 18 322 18C337 18 350 30 350 45C350 60 337 72 322 72C307 72 295 60 295 45ZM322 57C328 57 333 52 333 45C333 38 328 33 322 33C316 33 311 38 311 45C311 52 316 57 322 57Z" 
            fill="#9C5AFF"
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
            fill="#9C5AFF"
          />
          <path
            d="M0 52.5V80H27.5C12.3 80 0 67.7 0 52.5Z"
            fill="#9C5AFF"
          />
          <path
            d="M52.5 80H80V27.5C80 56.5 56.5 80 27.5 80H52.5Z"
            fill="#9C5AFF"
          />
        </svg>
      )}
    </div>
  );
}