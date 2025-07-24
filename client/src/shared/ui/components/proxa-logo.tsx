import { cn } from "@/lib/utils";
import logoUrl from "@/assets/proxa-logo.png";

interface ProxaLogoProps {
  className?: string;
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg";
}

export function ProxaLogo({ className, variant = "full", size = "md" }: ProxaLogoProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "w-8 h-8";
      case "md": return "w-10 h-10";
      case "lg": return "w-12 h-12";
      default: return "w-10 h-10";
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src={logoUrl} 
        alt="ProxaPeople" 
        className={cn(getSizeClasses(), "object-contain")}
        onError={(e) => {
          console.warn("Logo failed to load:", logoUrl);
        }}
      />
      {variant === "full" && (
        <span className="font-bold text-lg text-primary">ProxaPeople</span>
      )}
    </div>
  );
}
