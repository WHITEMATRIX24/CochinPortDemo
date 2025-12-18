"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

export default function AvgWaitingBeforeBerthChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);

  const formatMonth = (label: string) => {
  // "Aug-2025" → "Aug-25"
  const [mon, year] = label.split("-");
  return `${mon}-${year.slice(-2)}`;
};

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${serverUrl}/api/vessels/time-utilization/waiting-trend?startDate=${startDate}&endDate=${endDate}`
      );
      const json = await res.json();
      setData(json || []);
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="w-full h-100 p-5 bg-white shadow-sm rounded-2xl">
      <h2 className="text-md text-black font-semibold mb-4">
        Avg Waiting Before Berth (Hours)
      </h2>

      {data.length === 0 ? (
        <p className="text-black text-center">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data}>
            <XAxis dataKey="month" tickFormatter={formatMonth} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avgWaitingHours"
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
