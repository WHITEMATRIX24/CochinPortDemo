"use client";

import { useEffect, useState } from "react";
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
  LegendPayload,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

export default function BerthOccupancyChartYoy({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [mode, setMode] = useState<"month" | "year">("year");
  const [hiddenKeys, setHiddenKeys] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${serverUrl}/api/y-o-y/berth-occupancy-yoy?startDate=${startDate}&endDate=${endDate}&mode=${mode}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, mode]);

  const handleLegendClick = (entry: LegendPayload) => {
    const key = entry.dataKey;
    if (!key || typeof key === "object") return;
    const keyStr = String(key);

    setHiddenKeys(prev => ({
      ...prev,
      [keyStr]: !prev[keyStr],
    }));
  };

  const renderTooltip = (value: any, name: string) => {
    if (name === "Berth Occupancy (%)") return value.toFixed(2) + "%";
    return value.toString();
  };

  return (
    <div className="w-full h-[350px] p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md  text-black font-semibold">
          Berth Occupancy Trend ({mode === "month" ? "Monthwise" : "Yearwise"})
        </h2>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "month" | "year")}
          className="border rounded px-2 py-1 text-sm text-black"
        >
          <option value="month">Monthwise</option>
          <option value="year">Yearwise</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-center mt-20">No Data from {startDate} to {endDate}</p>
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
              tickFormatter={(v) => v.toFixed(1) + "%"}
            />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={renderTooltip}  contentStyle={{ color: "gray" }}/>
            <Legend onClick={handleLegendClick} />

            <Bar
              yAxisId="left"
              dataKey="occupancyPercent"
              name="Berth Occupancy (%)"
              fill="#3B82F6"
              barSize={20}
              opacity={hiddenKeys["occupancyPercent"] ? 0.2 : 1} // fade if hidden
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="vesselsCount"
              name="Vessels Count"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeOpacity={hiddenKeys["vesselsCount"] ? 0.2 : 1} // fade if hidden
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
