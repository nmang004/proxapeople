import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import proxaLogoImage from "../../assets/proxa-logo.png";

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
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  // For icon variant, we'll just crop the full logo
  const variantClasses = {
    full: "w-auto",
    icon: "w-8 overflow-hidden"
  };

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <img 
        src={proxaLogoImage} 
        alt="Proxa Logo" 
        className={cn(sizeClasses[size], variantClasses[variant])}
        style={{ objectFit: "contain", objectPosition: variant === "icon" ? "left" : "center" }}
      />
    </div>
  );
}