
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { KeyFrequency } from "@/hooks/useDashboardData";

interface KeyFrequencyChartProps {
  data: KeyFrequency[];
  className?: string;
}

const KeyFrequencyChart = ({ data, className }: KeyFrequencyChartProps) => {
  // Sort the data by count in descending order and take the top 20
  const chartData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  // If there's no data, display a message
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        No key frequency data available
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="key" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis 
            width={40}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`${value} presses`, 'Frequency']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`hsl(${250 - (index * 3)}, 70%, 65%)`} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeyFrequencyChart;
