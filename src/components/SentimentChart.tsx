
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { KeystrokeLog } from "@/hooks/useDashboardData";

interface SentimentChartProps {
  logs: KeystrokeLog[];
  className?: string;
}

interface SentimentCount {
  name: string;
  value: number;
  color: string;
}

const SentimentChart = ({ logs, className }: SentimentChartProps) => {
  const data = useMemo(() => {
    const counts = {
      Positive: 0,
      Negative: 0,
      Neutral: 0
    };
    
    logs.forEach((log) => {
      if (counts.hasOwnProperty(log.sentiment)) {
        counts[log.sentiment as keyof typeof counts]++;
      }
    });
    
    return [
      { name: 'Positive', value: counts.Positive, color: '#10B981' }, // green
      { name: 'Negative', value: counts.Negative, color: '#EF4444' }, // red
      { name: 'Neutral', value: counts.Neutral, color: '#3B82F6' }   // blue
    ];
  }, [logs]);
  
  // If there's no data, display a message
  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        No sentiment data available
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} logs`, 'Count']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
