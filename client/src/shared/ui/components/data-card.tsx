import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function DataCard({
  title,
  value,
  icon,
  footer,
  className
}: DataCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-sm", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="text-2xl font-semibold text-neutral-800 mt-1">{value}</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary">
            {icon}
          </div>
        </div>
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
