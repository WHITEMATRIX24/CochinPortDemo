'use client';

import { TRTData } from '@/data/TRTDashboardMockData';

type TRTDataTableProps = {
  data: TRTData[];
};

export default function TRTDataTable({ data }: TRTDataTableProps) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">TRT Data Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2">TRT Port</th>
              <th className="px-4 py-2">TRT Non-Port</th>
              <th className="px-4 py-2">TRT Total</th>
              <th className="px-4 py-2">TRT NOR</th>
              <th className="px-4 py-2">Boarding</th>
              <th className="px-4 py-2">Deboarding</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{item.month}</td>
                <td className="px-4 py-2">{item.year}</td>
                <td className="px-4 py-2">{item.trtPort}</td>
                <td className="px-4 py-2">{item.trtNonPort}</td>
                <td className="px-4 py-2">{item.trtTotal}</td>
                <td className="px-4 py-2">{item.trtNor}</td>
                <td className="px-4 py-2">{item.trtBoarding}</td>
                <td className="px-4 py-2">{item.trtDeboarding}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
