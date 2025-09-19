import { serverUrl } from "@/services/serverUrl";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1E40AF", "#3B82F6", "#60A5FA", "#93C5FD", "#2563EB"];

interface Props {
  startDate: string;
  endDate: string;
}

interface CargoData {
  name: string;
  value: number;
}

export default function CargoMixPieChart({ startDate, endDate }: Props) {
  const [data, setData] = useState<CargoData[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<string[]>([]);

  useEffect(() => {
    fetch(
      `${serverUrl}/api/cargo/cargo-mix?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((fetchedData) => {
        const chartData: CargoData[] = fetchedData.map(
          (item: { cargoType: string; totalVolume: number }) => ({
            name: item.cargoType || "Unknown",
            value: item.totalVolume || 0,
          })
        );
        setData(chartData);
        setSelectedCargo([]); // reset filters when new data loads
      });
  }, [startDate, endDate]);

  // ✅ Step 1: calculate total
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // ✅ Step 2: filter out <1% and 0 values
  const validData = data.filter(
    (d) => d.value > 0 && (d.value / total) * 100 >= 1
  );

  // ✅ Step 3: apply checkbox filter
  const filteredData =
    selectedCargo.length > 0
      ? validData.filter((d) => selectedCargo.includes(d.name))
      : validData;

  return (
    <div className="w-full h-85 p-4 bg-white shadow rounded-2xl">
      <h2 className="text-md text-black font-semibold mb-4">Cargo Mix</h2>

      {/* Filter checkboxes */}
      {validData.length > 0 && (
        <div className="flex gap-4 mb-4 flex-wrap">
          {validData.map((item) => (
            <label key={item.name} className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={
                  selectedCargo.length === 0 ||
                  selectedCargo.includes(item.name)
                }
                onChange={() => {
                  if (selectedCargo.includes(item.name)) {
                    setSelectedCargo(
                      selectedCargo.filter((c) => c !== item.name)
                    );
                  } else {
                    setSelectedCargo([...selectedCargo, item.name]);
                  }
                }}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      )}

      {filteredData.length === 0 ? (
        <p className="text-black text-center mt-20">
          No Data from {startDate} to {endDate}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent = 0 }) =>
                percent >= 0.01 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
              }
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
{/*             <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 0 }} />
 */}          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
