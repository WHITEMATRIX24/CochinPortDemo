"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
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

export default function ThroughputChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [mode, setMode] = useState<"month" | "year">("year");
  const [cargoType, setCargoType] = useState<string>("totalThroughput");

  const fetchData = async (chartMode: "month" | "year") => {
    try {
      const res = await fetch(
        `${serverUrl}/api/y-o-y/throughput-variance?mode=${chartMode}&startDate=${startDate}&endDate=${endDate}`
      );
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching throughput trend:", error);
    }
  };

  useEffect(() => {
    fetchData(mode);
  }, [startDate, endDate, mode]);

  const cargoOptions: { key: string; label: string }[] = [
    { key: "totalThroughput", label: "Total Throughput (MMT)" },
    { key: "dryCargo", label: "Dry Cargo (MMT)" },
    { key: "liquidCargo", label: "Liquid Cargo (MMT)" },
    { key: "containerTEUs", label: "Container TEUs" },
/*     { key: "all", label: "All Cargo Types" },
 */  ];

  const COLORS = {
    totalThroughput: "#1E40AF",
    dryCargo: "#3B82F6",
    liquidCargo: "#496797ff",
    containerTEUs: "#7193c9ff",
    variance: "#9dbceeff",
  };

  return (
    <div className="w-full h-[350px] p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-black font-semibold">
          {cargoOptions.find((c) => c.key === cargoType)?.label} Trend (
          {mode === "month" ? "Monthwise" : "Yearwise"})
        </h2>

        <div className="flex gap-2">
          {/* Mode Dropdown */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "month" | "year")}
            className="border border-gray-300 rounded px-2 py-1 text-sm  text-black"
          >
            <option value="month">Monthwise</option>
            <option value="year">Year-wise</option>
          </select>

          {/* Cargo Type Dropdown */}
          <select
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm  text-black"
          >
            {cargoOptions.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-black text-center mt-20">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="75%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={mode === "month" ? "month" : "year"} />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => {
                if (value >= 1_000_000)
                  return (value / 1_000_000).toFixed(1) + "M";
                if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                return value;
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(v) => v.toFixed(1) + "%"}
            />
            <Tooltip
              formatter={(val: number, name: string) => {
                if (name.includes("Variance"))
                  return [val.toFixed(2) + "%", name];
                return [val.toLocaleString(), name];
              }}
               contentStyle={{ color: "gray" }}
            />
            <Legend />

            {cargoType === "all" ? (
              <>
                {/* Total */}
                <Bar
                  yAxisId="left"
                  dataKey={mode === "month" ? "current.totalThroughput" : "totalThroughput"}
                  name="Total Throughput (MMT)"
                  fill={COLORS.totalThroughput}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={`variance.totalThroughput`}
                  stroke={COLORS.totalThroughput}
                  strokeWidth={2}
                  name="Total Variance %"
                />

                {/* Dry */}
                <Bar
                  yAxisId="left"
                  dataKey={mode === "month" ? "current.dryCargo" : "dryCargo"}
                  name="Dry Cargo (MMT)"
                  fill={COLORS.dryCargo}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={`variance.dryCargo`}
                  stroke={COLORS.dryCargo}
                  strokeWidth={2}
                  name="Dry Variance %"
                />

                {/* Liquid */}
                <Bar
                  yAxisId="left"
                  dataKey={mode === "month" ? "current.liquidCargo" : "liquidCargo"}
                  name="Liquid Cargo (MMT)"
                  fill={COLORS.liquidCargo}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={`variance.liquidCargo`}
                  stroke={COLORS.liquidCargo}
                  strokeWidth={2}
                  name="Liquid Variance %"
                />

                {/* Container */}
                <Bar
                  yAxisId="left"
                  dataKey={mode === "month" ? "current.containerTEUs" : "containerTEUs"}
                  name="Container TEUs"
                  fill={COLORS.containerTEUs}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={`variance.containerTEUs`}
                  stroke={COLORS.containerTEUs}
                  strokeWidth={2}
                  name="Container Variance %"
                />
              </>
            ) : (
              <>
                {/* Single Cargo Mode */}
                <Bar
                  yAxisId="left"
                  dataKey={mode === "month" ? `current.${cargoType}` : cargoType}
                  name={cargoOptions.find((c) => c.key === cargoType)?.label}
                  fill={COLORS[cargoType as keyof typeof COLORS]}
                  barSize={30}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={`variance.${cargoType}`}
                  stroke={COLORS.variance}
                  strokeWidth={2}
                  name="Variance %"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
