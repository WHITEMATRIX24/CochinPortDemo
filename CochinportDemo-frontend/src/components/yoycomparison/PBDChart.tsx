"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { serverUrl } from "@/services/serverUrl";

interface Props {
  startDate: string;
  endDate: string;
}

type ChartMode = "month" | "year";

interface PBDChartData {
  month?: string;
  year?: number;
  avgPBD: number;
}

export default function PBDChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<PBDChartData[]>([]);
  const [mode, setMode] = useState<ChartMode>("year");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${serverUrl}/api/y-o-y/pbd-data-yoy?startDate=${startDate}&endDate=${endDate}&mode=${mode}`
      );
      const result: PBDChartData[] = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching PBD data:", err);
    }
  }, [startDate, endDate, mode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const colors = [
    "#5d82e6",
    "#0284c7",
    "#236683",
    "#6366f1",
    "#1fafec",
    "#38bdf8",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <div className="w-full h-[350px] bg-white rounded-2xl p-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-md text-black">
          Avg. Pre-Berthing Detention
        </h2>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as ChartMode)}
          className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
        >
          <option value="month">Month-wise</option>
          <option value="year">Year-wise</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-center mt-20 text-black">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={mode === "month" ? "month" : "year"}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)} hrs`}
              contentStyle={{ color: "gray" }}
            />
            <Bar dataKey="avgPBD" radius={[4, 4, 0, 0]} barSize={30}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
