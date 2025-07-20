import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive?: boolean;
    isWarning?: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, change, subtitle, icon }: MetricCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="text-4xl font-bold text-primary mr-3">{value}</div>
          {(change || subtitle) && (
            <div className="text-sm text-neutral-500">
              {change && (
                <div className={`flex items-center ${change.positive ? 'text-success' : change.isWarning ? 'text-warning' : 'text-destructive'}`}>
                  {change.positive ? (
                    <i className="ri-arrow-up-line mr-1"></i>
                  ) : change.isWarning ? (
                    <i className="ri-time-line mr-1"></i>
                  ) : (
                    <i className="ri-arrow-down-line mr-1"></i>
                  )}
                  <span>{change.value}</span>
                </div>
              )}
              {subtitle && <div>{subtitle}</div>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}