"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

const COLORS = {
  PBD: "#1E3A8A",
  SNWB: "#2563EB",
  SWB: "#3B82F6",
  Shifting: "#60A5FA",
  Idling: "#94A3B8",
  OM: "#93C5FD",
  IM: "#97b6dbff",
};

export default function TimeUtilizationBreakdownChart({
  startDate,
  endDate,
}: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${serverUrl}/api/vessels/time-utilization/breakdown?startDate=${startDate}&endDate=${endDate}`
      );
      const json = await res.json();
      setData(json || []);
    };
    fetchData();
  }, [startDate, endDate]);

  const formatMonth = (label: string) => {
  // "Aug-2025" → "Aug-25"
  const [mon, year] = label.split("-");
  return `${mon}-${year.slice(-2)}`;
};

  return (
    <div className="w-full h-100 p-5 bg-white  shadow-sm rounded-2xl">
      <h2 className="text-md text-black font-semibold mb-4">
        Vessel Time Utilization Breakdown (Hours)
      </h2>

      {data.length === 0 ? (
        <p className="text-slate-500 text-center text-sm">
          No data available from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fill: "#334155", fontSize: 12 }}
              axisLine={{ stroke: "#CBD5E1" }}
            />
            <YAxis
              tick={{ fill: "#334155", fontSize: 12 }}
              axisLine={{ stroke: "#CBD5E1" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 12,
              }}
              labelStyle={{ color: "#1E3A8A", fontWeight: 600 }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
              }}
            />

            <Bar dataKey="PBD" stackId="a" fill={COLORS.PBD} />
            <Bar dataKey="SNWB" stackId="a" fill={COLORS.SNWB} />
            <Bar dataKey="SWB" stackId="a" fill={COLORS.SWB} />
            <Bar dataKey="Shifting" stackId="a" fill={COLORS.Shifting} />
            <Bar dataKey="OM" stackId="a" fill={COLORS.OM} />
            <Bar dataKey="IM" stackId="a" fill={COLORS.IM} />
            <Bar dataKey="Idling" stackId="a" fill={COLORS.Idling} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
