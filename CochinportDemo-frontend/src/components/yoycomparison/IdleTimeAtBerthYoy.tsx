"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

export default function IdleTimeChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [mode, setMode] = useState<"month" | "year">("year");

  const fetchData = async (chartMode: "month" | "year") => {
    try {
      const res = await fetch(
        `${serverUrl}/api/y-o-y/idle-time-yoy?mode=${chartMode}&startDate=${startDate}&endDate=${endDate}`
      );
      const result = await res.json();
      const filled = fillMissing(result, chartMode, startDate, endDate);
      setData(filled);
    } catch (error) {
      console.error("Error fetching Idle Time data:", error);
    }
  };

  useEffect(() => {
    fetchData(mode);
  }, [startDate, endDate, mode]);

  // Fill missing months/years with 0
  const fillMissing = (
    raw: any[],
    chartMode: "month" | "year",
    start: string,
    end: string
  ) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const map: Record<string, any> = {};

    raw.forEach((d) => {
      const key = chartMode === "month" ? `${d.year}-${d.month}` : `${d.year}`;
      map[key] = d;
    });

    const result: any[] = [];
    if (chartMode === "month") {
      const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (current <= endDate) {
        const key = `${current.getFullYear()}-${current.getMonth() + 1}`;
        result.push(
          map[key] || {
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            idlePercent: 0,
            totalIdle: 0,
          }
        );
        current.setMonth(current.getMonth() + 1);
      }
    } else {
  // Always ensure last 5 years in year mode
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 4; y <= currentYear; y++) {
    const key = `${y}`;
    result.push(
      map[key] || {
        year: y,
        idlePercent: 0,
        totalIdle: 0,
      }
    );
  }
}

    return result;
  };

  const COLORS = {
    idlePercent: "#EF4444", // red
    totalIdle: "#3B82F6", // blue
  };

  return (
    <div className="w-full h-[350px] p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-black font-semibold">
          Idle Time at Berth ({mode === "month" ? "Monthwise" : "Yearwise"})
        </h2>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "month" | "year")}
          className="border border-gray-300  rounded px-2 py-1 text-sm  text-black"
        >
          <option value="month">Monthwise</option>
          <option value="year">Year-wise</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-black text-center mt-20">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="75%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={mode === "month" ? "month" : "year"}
              tickFormatter={(val, idx) =>
                mode === "month"
                  ? new Date(data[idx].year, val - 1).toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })
                  : val
              }
            />
            {/* Left Y axis for Idle Hours */}
            <YAxis yAxisId="left" label={{ value: "Idle Hours", angle: -90, position: "insideLeft" }} />
            {/* Right Y axis for Idle % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Idle %", angle: -90, position: "insideRight" }}
            />
            <Tooltip  contentStyle={{ color: "gray" }} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalIdle"
              stroke={COLORS.totalIdle}
              strokeWidth={2}
              name="Idle Hours"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="idlePercent"
              stroke={COLORS.idlePercent}
              strokeWidth={2}
              name="Idle %"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
