"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { serverUrl } from "@/services/serverUrl";
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
  ReferenceArea,
  LegendPayload,
} from "recharts";
import { TooltipProps } from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

type ChartMode = "month" | "year";

interface BerthOccupancyData {
  month?: string;
  year?: number;
  occupancyPercent: number;
  vesselsCount: number;
}

export default function BerthOccupancyChartYoy({
  startDate,
  endDate,
}: Props) {
  const [data, setData] = useState<BerthOccupancyData[]>([]);
  const [mode, setMode] = useState<ChartMode>("year");
  const [hiddenKeys, setHiddenKeys] = useState<Record<string, boolean>>({});

  /* ---------- Fetch data ---------- */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${serverUrl}/api/y-o-y/berth-occupancy-yoy?startDate=${startDate}&endDate=${endDate}&mode=${mode}`
      );
      const json: BerthOccupancyData[] = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching berth occupancy data:", err);
    }
  }, [startDate, endDate, mode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------- Legend toggle ---------- */
  const handleLegendClick = (entry: LegendPayload) => {
    const key = entry.dataKey;
    if (!key || typeof key === "object") return;

    const keyStr = String(key);
    setHiddenKeys((prev) => ({
      ...prev,
      [keyStr]: !prev[keyStr],
    }));
  };

  /* ---------- Tooltip ---------- */
  const renderTooltip: TooltipProps<number, string>["formatter"] = (
    value,
    name
  ) => {
    if (value == null) return "—";

    if (name === "Berth Occupancy (%)") {
      return `${value.toFixed(2)}%`;
    }

    return value.toString();
  };

  /* ---------- Dynamic background zones (Occupancy %) ---------- */
  const { maxOccupancy, zones } = useMemo(() => {
    const values = data.map((d) => d.occupancyPercent || 0);
    const max = Math.max(...values, 0);

    // Add headroom so red zone is visible
    const paddedMax = Math.min(100, Math.ceil(max * 1.2 || 10));

    return {
      maxOccupancy: paddedMax,
      zones: {
        greenMax: paddedMax * 0.6,   // safe
        yellowMax: paddedMax * 0.85, // caution
      },
    };
  }, [data]);

  return (
    <div className="w-full h-[350px] p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-black font-semibold">
          Berth Occupancy Trend ({mode === "month" ? "Monthwise" : "Yearwise"})
        </h2>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as ChartMode)}
          className="border rounded px-2 py-1 text-sm text-black"
        >
          <option value="month">Monthwise</option>
          <option value="year">Year-wise</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-center mt-20 text-black">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey={mode === "month" ? "month" : "year"} />

            {/* Occupancy % axis */}
            <YAxis
              yAxisId="left"
              domain={[0, maxOccupancy]}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
            />

            {/* Vessel count axis */}
            <YAxis yAxisId="right" orientation="right" />

            <Tooltip formatter={renderTooltip} />
            <Legend onClick={handleLegendClick} />

            {/* 🟢🟡🔴 Background zones */}
            <ReferenceArea
              yAxisId="left"
              y1={0}
              y2={zones.greenMax}
              fill="#f5c6c6ff"
            />
            <ReferenceArea
              yAxisId="left"
              y1={zones.greenMax}
              y2={zones.yellowMax}
              fill="#FEF9C3"
            />
            <ReferenceArea
              yAxisId="left"
              y1={zones.yellowMax}
              y2={maxOccupancy}
              fill="#DCFCE7"
            />

            {/* Occupancy bars */}
            <Bar
              yAxisId="left"
              dataKey="occupancyPercent"
              name="Berth Occupancy (%)"
              fill="#2563EB"
              barSize={22}
              opacity={hiddenKeys["occupancyPercent"] ? 0.2 : 1}
            />

            {/* Vessel count line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="vesselsCount"
              name="Vessels Count"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeOpacity={hiddenKeys["vesselsCount"] ? 0.2 : 1}
              dot
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
