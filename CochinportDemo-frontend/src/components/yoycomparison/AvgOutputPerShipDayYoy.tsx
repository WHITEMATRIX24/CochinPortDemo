"use client";

import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCallback, useEffect, useState } from "react";
import { serverUrl } from "@/services/serverUrl";

interface Props {
  startDate: string;
  endDate: string;
}

type ChartMode = "month" | "year";

interface ChartData {
  month?: string;
  year?: number;
  avgOutput: number;
  vesselCount: number;
}

/* ---------- Tooltip Types ---------- */
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border p-2 rounded shadow-md text-sm text-gray-400">
        <p>
          <strong>{label}</strong>
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? entry.value.toFixed(2)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AvgOutputPerShipBerthDayChartYoY({
  startDate,
  endDate,
}: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [mode, setMode] = useState<ChartMode>("year");

  const fetchData = useCallback(
    async (chartMode: ChartMode) => {
      try {
        const res = await fetch(
          `${serverUrl}/api/y-o-y/avg-output-yoy?mode=${chartMode}&startDate=${startDate}&endDate=${endDate}`
        );
        const json: ChartData[] = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching Avg Output chart:", err);
      }
    },
    [startDate, endDate]
  );

  useEffect(() => {
    fetchData(mode);
  }, [fetchData, mode]);

  return (
    <div className="p-4 h-[350px] bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-black font-semibold">
          Avg Output per Ship Berth Day (
          {mode === "month" ? "Monthwise" : "Yearwise"})
        </h2>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as ChartMode)}
          className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
        >
          <option value="month">Monthwise</option>
          <option value="year">Year-wise</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={mode === "month" ? "month" : "year"} />
          <YAxis
            yAxisId="left"
            label={{
              value: "Avg Output (MT/Day)",
              angle: -90,
              position: "insideLeft",
              offset: -5,
              dy: 40,
            }}
            tickFormatter={(val: number) => {
              if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
              if (val >= 1_000) return (val / 1_000).toFixed(1) + "K";
              return val.toFixed(0);
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Vessels",
              angle: -90,
              position: "insideRight",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="avgOutput"
            fill="#3B82F6"
            name="Avg Output (MT/Day)"
            barSize={30}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="vesselCount"
            stroke="#042b68ff"
            name="Vessel Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
