"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { serverUrl } from "@/services/serverUrl";

interface TrendData {
  month: string;
  overall: number;
  containerised: number;
  dry_bulk_mechanical: number;
  liquid_bulk: number;
  break_bulk: number;
}

interface Props {
  startDate: string;
  endDate: string;
}

const LINES = [
  { key: "overall", label: "Overall", color: "#2563eb" },
  { key: "containerised", label: "Container", color: "#60a5fa" },
  { key: "dry_bulk_mechanical", label: "Dry", color: "#16a34a" },
  { key: "liquid_bulk", label: "Liquid", color: "#f59e0b" },
  { key: "break_bulk", label: "Break Bulk", color: "#8b5cf6" },
];

export default function VesselTurnaroundChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [selectedLines, setSelectedLines] = useState<string[]>(
    LINES.map((l) => l.key) // ✅ initially all selected
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${serverUrl}/api/vessel/vessel-turnaround-time?startDate=${startDate}&endDate=${endDate}`
        );
        const json = await res.json();

        if (Array.isArray(json) && json.length > 0) {
          setData(json);
          setNoData(false);
        } else {
          setNoData(true);
        }
      } catch (error) {
        console.error("Error fetching vessel turnaround trend", error);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const toggleLine = (key: string) => {
    setSelectedLines((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-white rounded-2xl shadow flex items-center justify-center">
        <p className="text-gray-500">Loading vessel turnaround trend...</p>
      </div>
    );
  }

  if (noData) {
    return (
      <div className="w-full h-[450px] bg-white rounded-2xl shadow flex items-center justify-center">
        <p className="text-gray-600">
          No vessel turnaround data available between{" "}
          <span className="font-medium">{startDate}</span> and{" "}
          <span className="font-medium">{endDate}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-2xl shadow flex flex-col">
      <h2 className="text-lg font-semibold mb-4">
        Trend of Vessel Turnaround Time
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 20, right: 0, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          {/* ✅ Conditional rendering of lines */}
          {LINES.map(
            (line) =>
              selectedLines.includes(line.key) && (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={false}
                  name={line.label}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* ✅ Custom clickable legend */}
      <div className="flex justify-center gap-6 mt-3 flex-wrap">
        {LINES.map((line) => {
          const isActive = selectedLines.includes(line.key);
          return (
            <button
              key={line.key}
              onClick={() => toggleLine(line.key)}
              className={`flex items-center gap-2 text-sm cursor-pointer transition ${
                isActive ? "opacity-100 font-medium" : "opacity-40"
              }`}
            >
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: line.color }}
              ></span>
              {line.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
