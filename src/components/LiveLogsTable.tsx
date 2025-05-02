
import React, { useState } from "react";
import { KeystrokeLog } from "@/hooks/useDashboardData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LiveLogsTableProps {
  logs: KeystrokeLog[];
  className?: string;
}

type SortField = "timestamp" | "sentiment" | "country" | null;
type SortDirection = "asc" | "desc";

const LiveLogsTable = ({ logs, className }: LiveLogsTableProps) => {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedLogs = () => {
    if (!sortField) return logs;

    return [...logs].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "timestamp") {
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else {
        comparison = a[sortField].localeCompare(b[sortField]);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const getSentimentClass = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return "sentiment-positive";
      case "negative": return "sentiment-negative";
      case "neutral": return "sentiment-neutral";
      default: return "";
    }
  };

  const sortedLogs = getSortedLogs();

  return (
    <div className={cn("rounded-md overflow-hidden", className)}>
      <div className="overflow-auto max-h-[400px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead 
                className="w-[180px] cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center">
                  Timestamp
                  {sortField === "timestamp" && (
                    sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead>Keystrokes</TableHead>
              <TableHead 
                className="w-[120px] cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("sentiment")}
              >
                <div className="flex items-center">
                  Sentiment
                  {sortField === "sentiment" && (
                    sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="w-[150px] cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("country")}
              >
                <div className="flex items-center">
                  Location
                  {sortField === "country" && (
                    sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[140px]">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No logs available
                </TableCell>
              </TableRow>
            ) : (
              sortedLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.keystrokes.length > 40 
                      ? `${log.keystrokes.substring(0, 40)}...` 
                      : log.keystrokes}
                  </TableCell>
                  <TableCell className={getSentimentClass(log.sentiment)}>
                    {log.sentiment}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{log.country}</div>
                      <div className="text-xs text-muted-foreground">{log.region}{log.city ? `, ${log.city}` : ""}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LiveLogsTable;
