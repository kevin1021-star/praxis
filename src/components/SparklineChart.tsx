'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import { Reading, SiteStatus } from '@/types/gridpulse';

interface SparklineChartProps {
  data: Reading[];
  status: SiteStatus;
  height?: number;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  status,
  height = 40
}) => {
  if (!data || data.length === 0) {
    return <div className="h-10 flex items-center justify-center text-xs text-zinc-500">No telemetry</div>;
  }

  const chartData = data.slice(-15).map((r, idx) => ({
    i: idx,
    val: r.battery_v
  }));

  const strokeColor =
    status === 'FAULT' ? '#ef4444' : status === 'WARNING' ? '#f59e0b' : '#10b981';

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
          <Line
            type="monotone"
            dataKey="val"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
