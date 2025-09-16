'use client';

import { Card, CardContent } from '../ui/Card';
import { mockData, TRTData } from '@/data/TRTDashboardMockData';

type TRTMetricKey = keyof Omit<TRTData, 'month' | 'year'>;

const metricKeys: TRTMetricKey[] = [
  'trtPort',
  'trtNonPort',
  'trtTotal',
  'trtNor',
  'trtBoarding',
  'trtDeboarding',
];

const metricLabels: Record<TRTMetricKey, string> = {
  trtPort: 'TRT PORT',
  trtNonPort: 'TRT NON-PORT',
  trtTotal: 'TRT TOTAL',
  trtNor: 'TRT NOR',
  trtBoarding: 'TRT BOARDING',
  trtDeboarding: 'TRT DEBOARDING',
};

export default function TRTSummaryCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 font-sans">
      {metricKeys.map((key) => (
        <Card
          key={key}
          className="bg-[#003049] min-w-[160px] shadow-md rounded-xl border border-gray-700 hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-2 flex flex-col items-center justify-center text-center h-12">
            <div className="text-xs sm:text-sm text-[#003049] font-medium mb-1">
              {metricLabels[key]}
            </div>
            <div className="text-base sm:text-lg font-bold text-[#003049]">
              {mockData.reduce((sum, d) => sum + d[key], 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
