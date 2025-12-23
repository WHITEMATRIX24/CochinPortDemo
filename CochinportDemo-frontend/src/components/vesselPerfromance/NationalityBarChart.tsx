"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";
import { serverUrl } from "@/services/serverUrl";

interface Props {
  startDate: string;
  endDate: string;
}

interface NationalityData {
  flag: string;
  Coastal: number;
  Foreign: number;
}

export default function NationalityChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<NationalityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${serverUrl}/api/vessel/nationality-stats?startDate=${startDate}&endDate=${endDate}`;
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching nationality chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 h-[450px] bg-white rounded-2xl shadow-md flex items-center justify-center">
        <p>Loading chart...</p>
      </div>
    );
  }

  // Convert to Sentence Case
  const formatSentenceCase = (value: any) => {
  if (typeof value !== "string") return String(value ?? "");
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

  // Custom label for totals at end of stacked bar
  const renderTotalLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width + 5}
        y={y + 14} // ⬅️ little lower
        fill="#6b7280" // light gray
        fontSize={12}
        fontWeight="bold"
        textAnchor="start"
      >
        {value.toLocaleString()}
      </text>
    );
  };
  if (data.length === 0) {
    return (
      <div className="w-full h-[320px] bg-white rounded-2xl p-4 shadow  items-center  ">
        <h2 className="text-lg text-black font-semibold mb-2">Nationality of Vessels</h2>
        <p className="text-gray-600 text-center flex items-center justify-center mt-25 ">
          No Data from {startDate} to {endDate}
        </p>
      </div>
    );
  }


  return (
    <div className="p-4 h-[320px] bg-white rounded-2xl shadow-md">
      <h2 className="text-md text-black font-semibold mb-4">Nationality of Vessels</h2>
      <ResponsiveContainer width="100%" height="95%">
        <BarChart
          layout="vertical"
          data={data.map((d) => ({
            ...d,
            total: d.Coastal + d.Foreign,
          }))}
          margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="flag"
            tickFormatter={formatSentenceCase}
            tick={{ fontSize: 14 }} // ⬅️ smaller labels
          />
          <Tooltip />

          {/* Stacked Bars */}
          <Bar dataKey="Coastal" fill="#94aed8ff" stackId="a" />
          <Bar dataKey="Foreign" fill="#3B82F6" stackId="a">
            {/* Add total label */}
            <LabelList dataKey="total" content={renderTotalLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
