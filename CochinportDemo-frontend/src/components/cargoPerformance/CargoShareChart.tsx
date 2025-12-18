"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { serverUrl } from "@/services/serverUrl";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8B5CF6", "#F87171"];

interface Props {
  startDate: string;
  endDate: string;
}

export default function CargoShareChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${serverUrl}/api/cargo/cargo-share?startDate=${startDate}&endDate=${endDate}`
        );
        const result = await res.json();
        setData(result);
        setSelectedTypes(result.map((d: any) => d.name)); // ✅ select all initially
      } catch (err) {
        console.error("Error fetching cargo share:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter data for selected types only
  const filteredData = data.filter((d) => selectedTypes.includes(d.name));

  const toggleCargoType = (cargo: string) => {
    setSelectedTypes((prev) =>
      prev.includes(cargo)
        ? prev.filter((c) => c !== cargo) // remove
        : [...prev, cargo] // add
    );
  };

  return (
    <div className="p-4 w-full  bg-white rounded-2xl shadow-md flex flex-col" style={{height:"100%"}}>
      <h2 className="text-md font-semibold mb-2">Cargo Share by Type</h2>

      {data.length === 0 ? (
        <p className="text-black text-center flex items-center justify-center mt-25">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <>
          {/* ✅ Pie Chart */}
          <ResponsiveContainer width="100%" height="95%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
                nameKey="name"
                paddingAngle={5}
                label
              >
                {filteredData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) =>
                  `${new Intl.NumberFormat().format(val as number)} MT`
                }
              />
            </PieChart>
          </ResponsiveContainer>

          {/* ✅ Clickable Legend */}
          <div className="flex justify-center gap- mt-2 flex-wrap">
            {data.map((d, idx) => {
              const isActive = selectedTypes.includes(d.name);
              return (
                <button
                  key={d.name}
                  onClick={() => toggleCargoType(d.name)}
                  className={`flex items-center gap-2 text-sm cursor-pointer transition ${
                    isActive ? "opacity-100 font-medium" : "opacity-40"
                  }`}
                >
                  <span
                    className="inline-block w-1 h-3 rounded-sm"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></span>
                  {d.name}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
