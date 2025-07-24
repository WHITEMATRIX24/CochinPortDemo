'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockData } from '@/data/TRTDashboardMockData';

const softColors: Record<string, string> = {
  trtPort: '#94a3b8',       // slate-400
  trtNonPort: '#60a5fa',    // blue-400
  trtTotal: '#facc15',      // yellow-400
  trtNor: '#f87171',        // red-400
  trtBoarding: '#34d399',   // green-400
  trtDeboarding: '#c084fc', // purple-400
};

export default function TRTComparisons() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 w-full h-[450px]">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">TRT Comparison by Month</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={mockData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#4B5563', fontSize: 12 }} // text-gray-600
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#4B5563', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
             <Tooltip
            contentStyle={{ fontSize: '14px', borderRadius: '8px' ,color:'#003049' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#6B7280' }} />
          {Object.keys(softColors).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={softColors[key]}
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
