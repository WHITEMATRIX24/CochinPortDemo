'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { mockData } from '@/data/TRTDashboardMockData';

const colors: Record<string, string> = {
  trtPort: '#6366F1',        // Indigo
  trtNonPort: '#10B981',     // Emerald
  trtTotal: '#F59E0B',       // Amber
  trtNor: '#EF4444',         // Red
  trtBoarding: '#3B82F6',    // Blue
  trtDeboarding: '#8B5CF6',  // Violet
};

export default function TRTTrendsChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full border-t border-gray-200">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">📈 TRT Trends Over Time</h2>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={mockData} margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ fontSize: '14px', borderRadius: '8px' ,color:'#003049' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {Object.entries(colors).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
