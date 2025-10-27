"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { serverUrl } from "@/services/serverUrl"; // 👈 your API base URL

interface Props {
  startDate: string;
  endDate: string;
}

interface VesselData {
  vessel: string;
  idle: number;
  trt: number;
}

// ✅ Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { vessel, idle, trt } = payload[0].payload;
    return (
      <div className="bg-white border p-2 rounded shadow-md text-sm">
        <p>
          <strong>Vessel ID:</strong> {vessel}
        </p>
        <p>Idle Time: {idle?.toFixed(2)} hrs</p>
        <p>TRT: {trt?.toFixed(2)} hrs</p>
      </div>
    );
  }
  return null;
};

export default function IdleVsTRTScatterChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<VesselData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${serverUrl}/api/vessel/idle-vs-trt?startDate=${startDate}&endDate=${endDate}`;
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 h-[450px] bg-white rounded-2xl shadow-md flex items-center justify-center">
        <p>Loading chart...</p>
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="w-full h-[320px] bg-white rounded-2xl p-4 shadow  items-center  ">
        <h2 className="text-lg font-semibold mb-2">Idle Time vs. Turnaround Time</h2>
        <p className="text-gray-600 text-center flex items-center justify-center mt-25 ">
          No Data from {startDate} to {endDate}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 h-[320px] bg-white rounded-2xl shadow-md">
      <h2 className="text-md font-semibold mb-4">
        Idle Time vs. Turnaround Time
      </h2>
      <ResponsiveContainer width="100%" height="95%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="idle" name="Idle Time" unit="h" />
          <YAxis
            type="number"
            dataKey="trt"
            name="Turnaround Time"
            unit="h"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter name="Vessels" data={data} fill="#3B82F6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
