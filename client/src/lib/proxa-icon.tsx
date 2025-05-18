import { SVGProps } from "react";

interface ProxaIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function ProxaIcon({ className, ...props }: ProxaIconProps) {
  return (
    <svg
      width="40"
      height="48"
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M0 0H40C40 11.0457 31.0457 20 20 20H0V0Z" 
        fill="#8A4FFF" 
      />
      <path 
        d="M0 28H20C31.0457 28 40 36.9543 40 48H0V28Z" 
        fill="#8A4FFF" 
      />
    </svg>
  );
}
