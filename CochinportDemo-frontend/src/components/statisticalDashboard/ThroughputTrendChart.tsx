"use client";

import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,

  ResponsiveContainer,
} from "recharts";

interface Props {
  startDate: string;
  endDate: string;
}

export default function ThroughputTrendChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [isData, setIsData] = useState(false)
  const [cargoTypes, setCargoTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const COLORS = [
    "#1E40AF",
    "#3B82F6",
    "#60A5FA",
    "#F97316",
    "#10B981",
    "#D946EF",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${serverUrl}/api/cargo/throughput-trend-cargo?startDate=${startDate}&endDate=${endDate}`
        );
        const result = await res.json();
        setData(result.data)
        if (result.message === "Success") {
          setIsData(true)
        }
        else {
          setIsData(false)
        }
        console.log(result);


        // Extract cargos
        const cargos = new Set<string>();
        result.data.forEach((item: any) => {
          Object.keys(item).forEach((key) => {
            if (key !== "month") cargos.add(key);
          });
        });
        const cargoList = Array.from(cargos);
        setCargoTypes(cargoList);
        setSelectedTypes(cargoList); // ✅ select all by default
      } catch (error) {
        console.error("Error fetching throughput trend:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ toggle legend click
  const toggleCargoType = (cargo: string) => {
    setSelectedTypes((prev) =>
      prev.includes(cargo)
        ? prev.filter((c) => c !== cargo)
        : [...prev, cargo]
    );
  };

  if (!isData) {
    return (
      <div className="w-full h-80 p-4 bg-white shadow rounded-2xl " >
        <h2 className="text-md text-black font-semibold mb-4">
          Throughput Trend by Cargo Type
        </h2>
        <div className="w-full h-full p-4  flex items-center justify-center">

          <p className="text-black text-center">
            No Data from {startDate} to {endDate}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 p-4 bg-white shadow rounded-2xl">
      <h2 className="text-md text-black font-semibold mb-4">
        Throughput Trend by Cargo Type
      </h2>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => {
              // value looks like "Jan-2025"
              if (typeof value === "string" && value.includes("-")) {
                const [month, year] = value.split("-");
                return `${month}-${year.slice(-2)}`; // Jan-25
              }
              return value;
            }}
          />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
              if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
              return value;
            }}
          />
          {/* ✅ Tooltip with unit */}
          <Tooltip
            formatter={(value?: number) =>
              value != null ? `${value.toLocaleString()} MT` : ""
            }
            contentStyle={{ color: "gray" }}
          />


          {/* Legend replaced by clickable buttons */}
          {selectedTypes.map((cargo, index) => (
            <Line
              key={cargo}
              type="monotone"
              dataKey={cargo}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={cargo}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* ✅ Custom Clickable Legend */}
      <div className="flex justify-center gap-6 mt-3 flex-wrap">
        {cargoTypes.map((cargo, idx) => {
          const isActive = selectedTypes.includes(cargo);
          return (
            <button
              key={cargo}
              onClick={() => toggleCargoType(cargo)}
              className={`flex items-center gap-2 text-xs cursor-pointer transition ${isActive ? "opacity-100 font-medium" : "opacity-40"
                }`}
            >
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              ></span>
              {cargo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
