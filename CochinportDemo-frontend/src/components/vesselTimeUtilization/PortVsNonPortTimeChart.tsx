"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

export default function PortVsNonPortTimeChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${serverUrl}/api/vessels/time-utilization/port-vs-nonport?startDate=${startDate}&endDate=${endDate}`
        );
        const json = await res.json();
        setData(json || []);
      } catch (error) {
        console.error("Error fetching Port vs Non-Port time split:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);
const formatMonth = (label: string) => {
  // "Aug-2025" → "Aug-25"
  const [mon, year] = label.split("-");
  return `${mon}-${year.slice(-2)}`;
};

  return (
    <div className="w-full h-100 p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
      <h2 className="text-md font-semibold text-blue-900  mb-4">
        Port vs Non-Port Time Split (Avg Hours)
      </h2>

      {data.length === 0 ? (
        <p className="text-black text-center">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="month" tickFormatter={formatMonth}/>
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="Port"
              stackId="a"
              fill="#1E3A8A"   // blue
              name="Port Controlled"
            />
            <Bar
              dataKey="NonPort"
              stackId="a"
              fill="#3B82F6 "   // amber
              name="Non-Port Controlled"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
