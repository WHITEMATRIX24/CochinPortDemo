"use client";

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
import { useEffect, useState } from "react";
import { serverUrl } from "@/services/serverUrl";

interface Props {
  startDate: string;
  endDate: string;
}

export default function TopCommoditiesChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${serverUrl}/api/cargo/get-top-commodities?startDate=${startDate}&endDate=${endDate}&limit=8`
        );
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching commodities:", error);
      }
    };
    fetchData();
  }, []);

  const colors = ["#5d82e6", "#0284c7", "#236683", "#6366f1", "#1fafec", "#38bdf8", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (data.length === 0) {
    return (
      <div className="w-full h-[320px] bg-white rounded-2xl p-4 shadow  items-center  ">
        <h2 className="text-lg font-semibold mb-2">Top Commodities Handled</h2>
        <p className="text-black text-center flex items-center justify-center mt-25 ">
          No Data from {startDate} to {endDate}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] bg-white rounded-2xl p-4 shadow">
      <h2 className="text-md font-semibold mb-2">Top Commodities Handled</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}MMT`}
          />
<YAxis
  type="category"
  dataKey="commodity"
  width={120}
  tick={{ fontSize: 12 }}
  tickFormatter={(value: any) => {
    if (!value) return "";
    const str = String(value); // ensure it's a string
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }}
/>

          <Tooltip
            formatter={(value: number) =>
              `${(value / 1_000_000).toFixed(2)} MMT`
            }
          />
          <Bar dataKey="volume" radius={[0, 8, 8, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
