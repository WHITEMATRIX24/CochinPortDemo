"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

const COLORS = ["#10B981", "#EF4444"];

export default function ProductiveVsNonProductiveChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${serverUrl}/api/vessels/time-utilization/productive-vs-nonproductive?startDate=${startDate}&endDate=${endDate}`
      );
      const json = await res.json();
      setData(json || []);
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="w-full h-80 p-4 bg-white shadow rounded-2xl">
      <h2 className="text-md font-semibold text-black mb-4">
        Productive vs Non-Productive Time
      </h2>

      {data.length === 0 ? (
        <p className="text-black text-center">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
