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
  ReferenceArea,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

type ChartMode = "month" | "year";

interface IdleTimeData {
  year: number;
  month?: number;
  idlePercent: number;
  totalIdle: number;
}

export default function IdleTimeChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<IdleTimeData[]>([]);
  const [mode, setMode] = useState<ChartMode>("year");

  /* ---------- Fill missing months / years ---------- */
  const fillMissing = useCallback(
    (
      raw: IdleTimeData[],
      chartMode: ChartMode,
      start: string,
      end: string
    ): IdleTimeData[] => {
      const startDt = new Date(start);
      const endDt = new Date(end);
      const map: Record<string, IdleTimeData> = {};

      raw.forEach((d) => {
        const key =
          chartMode === "month" ? `${d.year}-${d.month}` : `${d.year}`;
        map[key] = d;
      });

      const result: IdleTimeData[] = [];

      if (chartMode === "month") {
        const current = new Date(startDt.getFullYear(), startDt.getMonth(), 1);
        while (current <= endDt) {
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
        const endYear = endDt.getFullYear();
        for (let y = endYear - 4; y <= endYear; y++) {
          result.push(
            map[`${y}`] || {
              year: y,
              idlePercent: 0,
              totalIdle: 0,
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
        `${serverUrl}/api/y-o-y/idle-time-yoy?mode=${chartMode}&startDate=${startDate}&endDate=${endDate}`
      );
      const result: IdleTimeData[] = await res.json();
      setData(fillMissing(result, chartMode, startDate, endDate));
    },
    [startDate, endDate, fillMissing]
  );

  useEffect(() => {
    fetchData(mode);
  }, [fetchData, mode]);

  /* ---------- Dynamic background zones (based on Idle %) ---------- */
  const { zones, percentMax } = useMemo(() => {
    const values = data.map((d) => d.idlePercent);
    const max = Math.max(...values, 0);
    const paddedMax = Math.ceil(max * 1.2 || 10);

    return {
      percentMax: paddedMax,
      zones: {
        greenMax: paddedMax * 0.33,
        yellowMax: paddedMax * 0.66,
      },
    };
  }, [data]);

  const COLORS = {
    idlePercent: "#EF4444",
    totalIdle: "#2563EB",
  };

  return (
    <div className="w-full h-[350px] p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-black font-semibold">
          Idle Time at Berth ({mode === "month" ? "Monthwise" : "Yearwise"})
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
                mode === "month" && data[idx]?.year
                  ? new Date(data[idx].year, Number(val) - 1).toLocaleString(
                      "default",
                      { month: "short", year: "numeric" }
                    )
                  : val
              }
            />

            {/* Left axis → Idle Hours */}
            <YAxis
              yAxisId="left"
              label={{
                value: "Idle Hours",
                angle: -90,
                position: "insideLeft",
              }}
            />

            {/* Right axis → Idle % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, percentMax]}
              label={{
                value: "Idle %",
                angle: -90,
                position: "insideRight",
              }}
            />

            <Tooltip
              formatter={(v?: number, name?: string) =>
                name === "Idle %"
                  ? `${v?.toFixed(2)} %`
                  : `${v?.toFixed(2)} hrs`
              }
            />

            <Legend />

            {/* 🟢🟡🔴 Background zones (Idle %) */}
            <ReferenceArea
              yAxisId="right"
              y1={0}
              y2={zones.greenMax}
              fill="#DCFCE7"
            />
            <ReferenceArea
              yAxisId="right"
              y1={zones.greenMax}
              y2={zones.yellowMax}
              fill="#FEF9C3"
            />
            <ReferenceArea
              yAxisId="right"
              y1={zones.yellowMax}
              y2={percentMax}
              fill="#f5c6c6ff"
            />

            {/* 🔵 Idle Hours */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalIdle"
              stroke={COLORS.totalIdle}
              strokeWidth={2}
              dot
              name="Idle Hours"
            />

            {/* 🔴 Idle % */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="idlePercent"
              stroke={COLORS.idlePercent}
              strokeWidth={2}
              dot
              name="Idle %"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
