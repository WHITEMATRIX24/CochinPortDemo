'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { dummyTrtData } from '@/data/dummyTrtData';

// Modified Chart component to accept `color` prop
const Chart = ({
  xKey,
  xLabel,
  color,
}: {
  xKey: string;
  xLabel: string;
  color: string;
}) => (
  <div className="bg-white p-4 rounded-xl shadow border">
    <h3 className="text-sm font-semibold text-black mb-4 text-center">{`TRT vs ${xLabel}`}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid />

        <XAxis
          dataKey={xKey}
          name={xLabel}
          type="number"
          interval="preserveStartEnd"
          angle={-30}
          tickLine={false}
          tick={{ fontSize: 10 }}
        >
          <Label
            value={xLabel}
            offset={-5}
            position="insideBottom"
            style={{ textAnchor: 'middle' }}
          />
        </XAxis>


        <YAxis dataKey="trt_total" name="TRT (hrs)" type="number">
          <Label
            value="TRT (Total)"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>

        <Tooltip />
        <Scatter data={dummyTrtData} fill={color} />
      </ScatterChart>
    </ResponsiveContainer>
  </div>
);

// Pass colors from parent
export default function TrtGraphs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <Chart xKey="grt" xLabel="GRT" color="#4f46e5" />         {/* Indigo */}
      <Chart xKey="nrt" xLabel="NRT" color="#10b981" />         {/* Green */}
      <Chart xKey="deadweight" xLabel="Deadweight" color="#f43f5e" />  {/* Rose */}
    </div>
  );
}
