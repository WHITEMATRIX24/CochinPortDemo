"use client";

import Plot from "react-plotly.js";

const vesselData = [
  { vessel: "V001", trt: 37.0 },
  { vessel: "V002", trt: 21.3 },
  { vessel: "V003", trt: 45.0 },
  { vessel: "V004", trt: 108.0 },
  { vessel: "V005", trt: 62.4 },
  { vessel: "V006", trt: 680.0 }, // outlier
  { vessel: "V007", trt: 48.2 },
  { vessel: "V008", trt: 32.5 },
  { vessel: "V009", trt: 27.8 },
  { vessel: "V010", trt: 55.9 },
];

// Extract turnaround times
const trtValues = vesselData.map((d) => d.trt);

export default function VesselTRTBoxPlot() {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Vessel Turnaround Time Distribution
      </h2>
      <Plot
        data={[
          {
            y: trtValues,
            type: "box",
            name: "Turnaround Time (hrs)",
            boxpoints: "all", // shows all points + outliers
            jitter: 0.5,
            whiskerwidth: 0.2,
            marker: { size: 6, color: "#4F46E5" },
            line: { width: 1 },
          },
        ]}
        layout={{
          autosize: true,
          margin: { l: 60, r: 30, b: 50, t: 20 },
          yaxis: {
            title: "Turnaround Time (hrs)",
            zeroline: false,
          },
          showlegend: false,
        }}
        style={{ width: "100%", height: "400px" }}
        config={{ responsive: true }}
      />
    </div>
  );
}
