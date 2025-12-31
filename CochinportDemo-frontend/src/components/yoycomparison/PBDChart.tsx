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
  ReferenceArea,
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
    const res = await fetch(
      `${serverUrl}/api/y-o-y/pbd-data-yoy?startDate=${startDate}&endDate=${endDate}&mode=${mode}`
    );
    const result = await res.json();
    setData(result);
  }, [startDate, endDate, mode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (data.length === 0) {
    return (
      <div className="w-full h-[350px] bg-white rounded-2xl p-4 shadow">
        <p className="text-center mt-24 text-black">
          No data from {startDate} to {endDate}
        </p>
      </div>
    );
  }

  /* ---------- Dynamic zones ---------- */
  const values = data.map(d => d.avgPBD);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const range = max - min || max || 1;

  const zones = {
    greenMax: min + range * 0.33,
    yellowMax: min + range * 0.66,
  };

  const yAxisMax = Math.ceil(max * 1)+1; // 🔥 REQUIRED

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

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={mode === "month" ? "month" : "year"}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            domain={[0, yAxisMax]}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(v?: number) =>
              v != null ? `${v.toFixed(2)} hrs` : "—"
            }
          />

          {/* 🟢🟡🔴 Risk Zones */}
          <ReferenceArea y1={0} y2={zones.greenMax} fill="#DCFCE7" />
          <ReferenceArea y1={zones.greenMax} y2={zones.yellowMax} fill="#FEF9C3" />
          <ReferenceArea y1={zones.yellowMax} y2={yAxisMax} fill="#f5c6c6ff" />

          <Bar
            dataKey="avgPBD"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
