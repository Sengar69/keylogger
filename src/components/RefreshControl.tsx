
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RefreshControlProps {
  isLoading: boolean;
  isAutoRefresh: boolean;
  onRefresh: () => void;
  onAutoRefreshToggle: (enabled: boolean) => void;
  className?: string;
}

const RefreshControl = ({ 
  isLoading, 
  isAutoRefresh, 
  onRefresh, 
  onAutoRefreshToggle,
  className
}: RefreshControlProps) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center space-x-2">
        <Switch 
          id="auto-refresh" 
          checked={isAutoRefresh}
          onCheckedChange={onAutoRefreshToggle}
        />
        <Label htmlFor="auto-refresh" className="text-sm">
          Auto-refresh (10s)
        </Label>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRefresh} 
        disabled={isLoading}
        className="ml-2 h-8 w-8 p-0"
      >
        <RefreshCw 
          size={16} 
          className={cn(
            "text-muted-foreground",
            isLoading ? "animate-spin" : "",
          )}
        />
        <span className="sr-only">Refresh data</span>
      </Button>
    </div>
  );
};

export default RefreshControl;
