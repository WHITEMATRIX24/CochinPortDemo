"use client";

import { serverUrl } from "@/services/serverUrl";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LegendPayload,
  ReferenceArea,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

type ChartMode = "month" | "year";
type TRTKey = "meanOverall" | "medianOverall" | "containerAvg";

interface VesselTurnaroundData {
  year: number;
  month?: number;
  meanOverall: number;
  medianOverall: number;
  containerAvg: number;
}

export default function VesselTurnaroundChartYoy({
  startDate,
  endDate,
}: Props) {
  const [data, setData] = useState<VesselTurnaroundData[]>([]);
  const [mode, setMode] = useState<ChartMode>("year");
  const [inactiveKeys, setInactiveKeys] = useState<TRTKey[]>([]);

  /* ---------- Fill missing months / years ---------- */
  const fillMissing = useCallback(
    (
      raw: VesselTurnaroundData[],
      chartMode: ChartMode,
      start: string,
      end: string
    ): VesselTurnaroundData[] => {
      const startDt = new Date(start);
      const endDt = new Date(end);
      const map: Record<string, VesselTurnaroundData> = {};

      raw.forEach((d) => {
        const key =
          chartMode === "month" ? `${d.year}-${d.month}` : `${d.year}`;
        map[key] = d;
      });

      const result: VesselTurnaroundData[] = [];

      if (chartMode === "month") {
        const current = new Date(startDt.getFullYear(), startDt.getMonth(), 1);
        while (current <= endDt) {
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
        const endYear = endDt.getFullYear();
        for (let y = endYear - 4; y <= endYear; y++) {
          result.push(
            map[`${y}`] || {
              year: y,
              meanOverall: 0,
              medianOverall: 0,
              containerAvg: 0,
            }
          );
        }
      }

      return result;
    },
    []
  );

  /* ---------- Fetch data ---------- */
  const fetchData = useCallback(
    async (chartMode: ChartMode) => {
      const res = await fetch(
        `${serverUrl}/api/y-o-y/turnaround-trend-yoy?mode=${chartMode}&startDate=${startDate}&endDate=${endDate}`
      );
      const result: VesselTurnaroundData[] = await res.json();
      setData(fillMissing(result, chartMode, startDate, endDate));
    },
    [startDate, endDate, fillMissing]
  );

  useEffect(() => {
    fetchData(mode);
  }, [fetchData, mode]);

  /* ---------- COLORS ---------- */
  const COLORS: Record<TRTKey, string> = {
    meanOverall: "#1E40AF",
    medianOverall: "#F59E0B",
    containerAvg: "#10B981",
  };

  /* ---------- Legend toggle ---------- */
  const handleLegendClick = (entry: LegendPayload) => {
    const key = entry.dataKey as TRTKey;
    setInactiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  /* ---------- Dynamic Risk Zones ---------- */
  const { zones, yAxisMax } = useMemo(() => {
    const allValues = data.flatMap((d) => [
      d.meanOverall,
      d.medianOverall,
      d.containerAvg,
    ]);

    const max = Math.max(...allValues, 0);
    const paddedMax = Math.ceil(max * 1.2 || 10);
    const range = paddedMax;

    return {
      zones: {
        greenMax: range * 0.33,
        yellowMax: range * 0.66,
      },
      yAxisMax: paddedMax,
    };
  }, [data]);

  return (
    <div className="w-full h-[350px] p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-black font-semibold">
          Vessel Turn Round Time Trend (
          {mode === "month" ? "Monthwise" : "Yearwise"})
        </h2>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as ChartMode)}
          className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
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
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey={mode === "month" ? "month" : "year"}
              tickFormatter={(val, idx) =>
                mode === "month"
                  ? new Date(
                      data[idx].year,
                      Number(val) - 1
                    ).toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })
                  : val
              }
            />

            <YAxis domain={[0, yAxisMax]} />

            <Tooltip
              formatter={(v?: number) =>
                v != null ? `${v.toFixed(1)} hrs` : "—"
              }
            />

            <Legend onClick={handleLegendClick} />

            {/* 🟢🟡🔴 Background Risk Zones */}
            <ReferenceArea y1={0} y2={zones.greenMax} fill="#DCFCE7" />
            <ReferenceArea
              y1={zones.greenMax}
              y2={zones.yellowMax}
              fill="#FEF9C3"
            />
            <ReferenceArea
              y1={zones.yellowMax}
              y2={yAxisMax}
              fill="#f5c6c6ff"
            />

            {/* 🔵 Lines */}
            <Line
              type="monotone"
              dataKey="meanOverall"
              stroke={COLORS.meanOverall}
              strokeWidth={2}
              strokeOpacity={
                inactiveKeys.includes("meanOverall") ? 0.2 : 1
              }
              dot
              name="Mean TRT (Overall)"
            />

            <Line
              type="monotone"
              dataKey="medianOverall"
              stroke={COLORS.medianOverall}
              strokeWidth={2}
              strokeOpacity={
                inactiveKeys.includes("medianOverall") ? 0.2 : 1
              }
              dot
              name="Median TRT"
            />

            <Line
              type="monotone"
              dataKey="containerAvg"
              stroke={COLORS.containerAvg}
              strokeWidth={2}
              strokeOpacity={
                inactiveKeys.includes("containerAvg") ? 0.2 : 1
              }
              dot
              name="Avg TRT (Container)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
