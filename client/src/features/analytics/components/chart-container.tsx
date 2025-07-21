import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";


interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  height?: number | string;
  className?: string;
}

export function ChartContainer({ title, description, children, height = 300, className }: ChartContainerProps) {
  return (
    <Card className={`shadow-sm ${className || ''}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent style={{ height }}>
        <div style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}