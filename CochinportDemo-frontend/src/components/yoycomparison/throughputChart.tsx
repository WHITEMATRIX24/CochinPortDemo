"use client";

import { serverUrl } from "@/services/serverUrl";
import { useCallback, useEffect, useState } from "react";
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

type ChartMode = "month" | "year";

type CargoKey =
  | "totalThroughput"
  | "dryCargo"
  | "liquidCargo"
  | "containerTEUs";

interface ThroughputData {
  month?: string;
  year?: number;

  // year mode values
  totalThroughput?: number;
  dryCargo?: number;
  liquidCargo?: number;
  containerTEUs?: number;

  // month mode structure
  current?: {
    totalThroughput?: number;
    dryCargo?: number;
    liquidCargo?: number;
    containerTEUs?: number;
  };

  variance?: {
    totalThroughput?: number;
    dryCargo?: number;
    liquidCargo?: number;
    containerTEUs?: number;
  };
}

export default function ThroughputChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<ThroughputData[]>([]);
  const [mode, setMode] = useState<ChartMode>("year");
  const [cargoType, setCargoType] = useState<CargoKey>("totalThroughput");

  const fetchData = useCallback(
    async (chartMode: ChartMode) => {
      try {
        const res = await fetch(
          `${serverUrl}/api/y-o-y/throughput-variance?mode=${chartMode}&startDate=${startDate}&endDate=${endDate}`
        );
        const result: ThroughputData[] = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching throughput trend:", error);
      }
    },
    [startDate, endDate]
  );

  useEffect(() => {
    fetchData(mode);
  }, [fetchData, mode]);

  const cargoOptions: { key: CargoKey; label: string }[] = [
    { key: "totalThroughput", label: "Total Throughput (MMT)" },
    { key: "dryCargo", label: "Dry Cargo (MMT)" },
    { key: "liquidCargo", label: "Liquid Cargo (MMT)" },
    { key: "containerTEUs", label: "Container TEUs" },
  ];

  const COLORS: Record<string, string> = {
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
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ChartMode)}
            className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
          >
            <option value="month">Monthwise</option>
            <option value="year">Year-wise</option>
          </select>

          <select
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value as CargoKey)}
            className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
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
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={mode === "month" ? "month" : "year"} />
            <YAxis
              yAxisId="left"
              tickFormatter={(v: number) => {
                if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
                if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
                return v.toString();
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(v: number) => `${v.toFixed(1)}%`}
            />
            <Tooltip
              formatter={(val?: number, name?: string) => {
                if (val == null || !name) return "";

                return name.includes("Variance")
                  ? [`${val.toFixed(2)}%`, name]
                  : [val.toLocaleString(), name];
              }}
              contentStyle={{ color: "gray" }}
            />

            <Legend />

            {/* Bars */}
            <Bar
              yAxisId="left"
              dataKey={mode === "month" ? `current.${cargoType}` : cargoType}
              name={cargoOptions.find((c) => c.key === cargoType)?.label}
              fill={COLORS[cargoType]}
              barSize={30}
            />

            {/* Variance Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={`variance.${cargoType}`}
              stroke={COLORS.variance}
              strokeWidth={2}
              name="Variance %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
