
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  fullHeight?: boolean;
}

const DashboardCard = ({ 
  title, 
  children, 
  className, 
  action,
  fullHeight = false 
}: DashboardCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg", 
      fullHeight ? "h-full" : "",
      className
    )}>
      <CardHeader className="px-6 py-4 flex flex-row items-center justify-between bg-secondary/30">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {action && <div className="ml-auto">{action}</div>}
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
