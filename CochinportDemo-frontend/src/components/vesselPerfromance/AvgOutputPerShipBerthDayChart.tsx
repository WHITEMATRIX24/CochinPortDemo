"use client";

import {
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { serverUrl } from "@/services/serverUrl";

interface Props {
    startDate: string;
    endDate: string;
}

interface ChartData {
    month: string;
    avgOutput: number;
    vesselCount: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border p-2 rounded shadow-md text-sm">
                <p><strong>{label}</strong></p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}:{" "}
                        {typeof entry.value === "number"
                            ? entry.value.toFixed(2) // 👉 2 decimal places
                            : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


export default function AvgOutputPerShipBerthDayChart({ startDate, endDate }: Props) {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${serverUrl}/api/vessel/avg-output?startDate=${startDate}&endDate=${endDate}`
                );
                const json = await res.json();                
                setData(json);
            } catch (err) {
                console.error("Error fetching Avg Output chart:", err);
            }
        };
        fetchData();
    }, []);
    if (data.length === 0) {
    return (
      <div className="w-full h-[320px] bg-white rounded-2xl p-4 shadow  items-center  ">
        <h2 className="text-lg font-semibold mb-2">Avg Output per Ship Berth Day</h2>
        <p className="text-gray-600 text-center flex items-center justify-center mt-25 ">
          No Data from {startDate} to {endDate}
        </p>
      </div>
    );
  }

    return (
        <div className="p-4 h-[320px] bg-white rounded-2xl shadow-md">
            <h2 className="text-md font-semibold mb-4">
                Avg Output per Ship Berth Day
            </h2>
            <ResponsiveContainer width="100%" height="95%">
                <BarChart data={data} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        label={{ value: "Avg Output (MT/Day)", angle: -90, position: "insideLeft", offset:"-5"}}
                        tickFormatter={(val) => {
                            if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
                            if (val >= 1000) return (val / 1000).toFixed(1) + "K";
                            return val.toFixed(0);
                        }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: "Vessels", angle: -90, position: "insideRight" }}
                    />
                    <Tooltip content={CustomTooltip} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgOutput" fill="#3B82F6" name="Avg Output (MT/Day)" barSize={30} />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="vesselCount"
                        stroke="#042b68ff"
                        name="Vessel Count"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
