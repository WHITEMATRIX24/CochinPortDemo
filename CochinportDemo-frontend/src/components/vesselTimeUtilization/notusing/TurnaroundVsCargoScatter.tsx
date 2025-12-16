"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

export default function TurnaroundVsCargoScatter({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${serverUrl}/api/vessels/time-utilization/turnaround-vs-cargo?startDate=${startDate}&endDate=${endDate}`
        );
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.error("Error fetching turnaround vs cargo:", err);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="w-full h-96 p-4 bg-white shadow rounded-2xl">
      <h2 className="text-md font-semibold text-black mb-4">
        Turnaround Time vs Cargo Size
      </h2>

      {data.length === 0 ? (
        <p className="text-black text-center">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis
              type="number"
              dataKey="cargo"
              name="Cargo Handled (MT)"
            />
            <YAxis
              type="number"
              dataKey="turnaroundHours"
              name="Turnaround Time (Hours)"
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) =>
                name === "turnaroundHours"
                  ? [`${value} hrs`, "TAT"]
                  : [`${value}`, "Cargo"]
              }
            />
            <Scatter data={data} fill="#6366F1" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
