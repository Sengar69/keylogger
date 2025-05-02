
import React, { useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import LiveLogsTable from "@/components/LiveLogsTable";
import SentimentChart from "@/components/SentimentChart";
import KeyFrequencyChart from "@/components/KeyFrequencyChart";
import GeoLocationCard from "@/components/GeoLocationCard";
import RefreshControl from "@/components/RefreshControl";
import useDashboardData from "@/hooks/useDashboardData";
import { format } from "date-fns";

const Index = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { logs, keyFrequency, isLoading, lastUpdated, refreshData } = useDashboardData({
    autoRefresh
  });

  const handleRefresh = () => {
    refreshData();
  };

  const handleAutoRefreshToggle = (enabled: boolean) => {
    setAutoRefresh(enabled);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Keystroke Monitoring Dashboard</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-muted-foreground">
              {lastUpdated ? (
                <>Last updated: {format(lastUpdated, "MMMM dd, yyyy HH:mm:ss")}</>
              ) : (
                "Loading data..."
              )}
            </p>
            <RefreshControl
              isLoading={isLoading}
              isAutoRefresh={autoRefresh}
              onRefresh={handleRefresh}
              onAutoRefreshToggle={handleAutoRefreshToggle}
              className="ml-auto"
            />
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Logs - Full Width */}
          <div className="lg:col-span-3">
            <DashboardCard 
              title="Live Keystroke Logs" 
              action={
                <div className="text-sm text-muted-foreground">
                  {logs.length} entries
                </div>
              }
            >
              <LiveLogsTable logs={logs} />
            </DashboardCard>
          </div>

          {/* Sentiment Chart */}
          <div className="lg:col-span-1">
            <DashboardCard title="Sentiment Analysis" fullHeight>
              <SentimentChart logs={logs} />
            </DashboardCard>
          </div>

          {/* Key Frequency Chart */}
          <div className="lg:col-span-1">
            <DashboardCard title="Key Frequency" fullHeight>
              <KeyFrequencyChart data={keyFrequency} />
            </DashboardCard>
          </div>

          {/* Geo Location */}
          <div className="lg:col-span-1">
            <DashboardCard title="Location Data" fullHeight>
              <GeoLocationCard logs={logs} />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
