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

export default function VesselTurnaroundChartYoy({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [mode, setMode] = useState<"month" | "year">("year");
  const [inactiveKeys, setInactiveKeys] = useState<string[]>([]); // track faded series

  const fetchData = async (chartMode: "month" | "year") => {
    try {
      const res = await fetch(
        `${serverUrl}/api/y-o-y/turnaround-trend-yoy?mode=${chartMode}&startDate=${startDate}&endDate=${endDate}`
      );
      const result = await res.json();
      const filled = fillMissing(result, chartMode, startDate, endDate);
      setData(filled);
    } catch (error) {
      console.error("Error fetching vessel turnaround trend:", error);
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
            meanOverall: 0,
            medianOverall: 0,
            containerAvg: 0,
          }
        );
        current.setMonth(current.getMonth() + 1);
      }
    } else {
      const endYear = endDate.getFullYear();
      const startYear = endYear - 4; // always last 5 years
      for (let y = startYear; y <= endYear; y++) {
        const key = `${y}`;
        result.push(
          map[key] || {
            year: y,
            meanOverall: 0,
            medianOverall: 0,
            containerAvg: 0,
          }
        );
      }
    }
    return result;
  };

  const COLORS = {
    meanOverall: "#1E40AF",
    medianOverall: "#F59E0B",
    containerAvg: "#10B981",
  };

  // Toggle inactive (faded) state
  const handleLegendClick = (o: any) => {
    const { dataKey } = o;
    setInactiveKeys((prev) =>
      prev.includes(dataKey)
        ? prev.filter((k) => k !== dataKey) // re-activate
        : [...prev, dataKey] // fade out
    );
  };

  return (
    <div className="w-full h-[450px] p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Vessel Turn Round Time Trend ({mode === "month" ? "Monthwise" : "Yearwise"})
        </h2>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "month" | "year")}
          className="border border-gray-300  rounded px-2 py-1 text-sm"
        >
          <option value="month">Monthwise</option>
          <option value="year">Yearwise</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-black text-center mt-20">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
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
            <YAxis />
            <Tooltip formatter={(val: number) => val.toFixed(1) + " hrs"} />
            <Legend onClick={handleLegendClick} />

            <Line
              type="monotone"
              dataKey="meanOverall"
              stroke={COLORS.meanOverall}
              strokeWidth={2}
              strokeOpacity={inactiveKeys.includes("meanOverall") ? 0.2 : 1}
              name="Mean TRT (Overall)"
            />
            <Line
              type="monotone"
              dataKey="medianOverall"
              stroke={COLORS.medianOverall}
              strokeWidth={2}
              strokeOpacity={inactiveKeys.includes("medianOverall") ? 0.2 : 1}
              name="Median TRT"
            />
            <Line
              type="monotone"
              dataKey="containerAvg"
              stroke={COLORS.containerAvg}
              strokeWidth={2}
              strokeOpacity={inactiveKeys.includes("containerAvg") ? 0.2 : 1}
              name="Avg TRT (Container)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
