
import React from "react";
import { KeystrokeLog } from "@/hooks/useDashboardData";
import { MapPin } from "lucide-react";

interface GeoLocationCardProps {
  logs: KeystrokeLog[];
  className?: string;
}

const GeoLocationCard = ({ logs, className }: GeoLocationCardProps) => {
  // Get location data from the most recent log
  const latestLog = logs.length > 0 
    ? logs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0]
    : null;

  if (!latestLog) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
          No location data available
        </div>
      </div>
    );
  }

  const locationText = [
    latestLog.city,
    latestLog.region,
    latestLog.country
  ].filter(Boolean).join(", ");

  // Count unique countries, regions, and IPs
  const uniqueCountries = new Set(logs.map(log => log.country)).size;
  const uniqueRegions = new Set(logs.map(log => `${log.region}, ${log.country}`)).size;
  const uniqueIPs = new Set(logs.map(log => log.ip_address)).size;

  return (
    <div className={`${className} space-y-6`}>
      {/* Current location section */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <MapPin className="text-primary w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Most recent location</h3>
          <p className="text-lg font-semibold">{locationText}</p>
          <p className="text-sm text-muted-foreground">{latestLog.ip_address}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Countries</p>
          <p className="text-2xl font-bold">{uniqueCountries}</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Regions</p>
          <p className="text-2xl font-bold">{uniqueRegions}</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Unique IPs</p>
          <p className="text-2xl font-bold">{uniqueIPs}</p>
        </div>
      </div>

      {/* Recent locations list */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent locations</h3>
        <ul className="space-y-2 max-h-[120px] overflow-auto pr-1">
          {logs.slice(0, 5).map((log, index) => (
            <li 
              key={log.id} 
              className="flex justify-between items-center p-2 text-sm rounded-md hover:bg-muted/50"
            >
              <span className="font-medium">{log.country}, {log.region}</span>
              <span className="text-xs text-muted-foreground font-mono">{log.ip_address}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GeoLocationCard;
