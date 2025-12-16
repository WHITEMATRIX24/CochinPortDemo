"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";

interface Props {
  startDate: string;
  endDate: string;
}

interface HeatmapRow {
  berth: string;
  month: string;
  avgWaitingHours: number;
}

export default function BerthCongestionHeatmap({ startDate, endDate }: Props) {
  const [data, setData] = useState<HeatmapRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${serverUrl}/api/vessels/time-utilization/berth-congestion-heatmap?startDate=${startDate}&endDate=${endDate}`
        );
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.error("Error fetching berth congestion heatmap:", err);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (data.length === 0) {
    return (
      <div className="w-full h-80 p-4 bg-white shadow rounded-2xl">
        <h2 className="text-md font-semibold text-black mb-4">
          Berth Congestion Heatmap
        </h2>
        <p className="text-black text-center">
          No Data from {startDate} to {endDate}
        </p>
      </div>
    );
  }

  const berths = Array.from(new Set(data.map(d => d.berth)));
  const months = Array.from(new Set(data.map(d => d.month)));

  const getColor = (value: number) => {
    if (value > 20) return "#DC2626"; // red
    if (value > 10) return "#F59E0B"; // amber
    if (value > 5) return "#FBBF24";  // yellow
    return "#10B981";                 // green
  };

  return (
    <div className="w-full p-4 bg-white shadow rounded-2xl overflow-x-auto">
      <h2 className="text-md font-semibold text-black mb-4">
        Berth Congestion Heatmap (Avg Waiting Hours)
      </h2>

      <table className="border-collapse">
        <thead>
          <tr>
            <th className="p-2 border text-black">Berth</th>
            {months.map(m => (
              <th key={m} className="p-2 border text-black">{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {berths.map(berth => (
            <tr key={berth}>
              <td className="p-2 border font-medium text-black">{berth}</td>
              {months.map(month => {
                const cell = data.find(
                  d => d.berth === berth && d.month === month
                );
                const value = cell?.avgWaitingHours || 0;
                return (
                  <td
                    key={month}
                    className="p-2 border text-center text-white"
                    style={{ backgroundColor: getColor(value) }}
                    title={`${value} hrs`}
                  >
                    {value > 0 ? value : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
