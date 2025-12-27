"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
import { useEffect, useState } from "react";
import { serverUrl } from "@/services/serverUrl";

interface Props {
  startDate: string;
  endDate: string;
}

export default function CargoTrendChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [cargoTypes, setCargoTypes] = useState<string[]>([]);
  const [allZero, setAllZero] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${serverUrl}/api/cargo/cargo-trend?startDate=${startDate}&endDate=${endDate}`
      );
      const result = await res.json();
      setData(result.data);
      setCargoTypes(result.cargoTypes);
      setAllZero(result.allZero);
    };

    fetchData();
  }, []);

  const COLORS = [
    "#1e3a8a",
    "#0284c7",
    "#38bdf8",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <div className="w-full h-85 bg-white rounded-2xl p-4 shadow flex flex-col">
      {/* Title + Dropdown */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md  text-black font-semibold">Trend of Cargo Volumes</h2>

        {/* ✅ Dropdown filter */}
        <select
          value={selectedCargo}
          onChange={(e) => setSelectedCargo(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value="All">All Cargo Types</option>
          {cargoTypes.map((cargo) => (
            <option key={cargo} value={cargo}>
              {cargo}
            </option>
          ))}
        </select>
      </div>

      {allZero ? (
        <p className="text-black text-center flex items-center justify-center mt-25">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 14 }}
              interval={0}
            />

            <YAxis
              tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)} `}
              padding={{ top: 0, bottom: 0 }}
              tick={{ fontSize: 14 }}
            >
              <Label
                value="MMT"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip
              formatter={(value?: number) =>
                value != null ? `${value.toLocaleString()} MT` : ""
              }
            />
            <Legend />

            {/* ✅ Render lines based on dropdown */}
            {selectedCargo === "All"
              ? cargoTypes.map((cargo, idx) => (
                <Line
                  key={cargo}
                  type="monotone"
                  dataKey={cargo}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                />
              ))
              : (
                <Line
                  type="monotone"
                  dataKey={selectedCargo}
                  stroke={COLORS[0]}
                  strokeWidth={2}
                />
              )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
