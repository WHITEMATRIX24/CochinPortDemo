"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from "recharts";
import { useEffect, useState } from "react";
import { serverUrl } from "@/services/serverUrl";

interface Props {
    startDate: string;
    endDate: string;
}

interface ChartData {
    year?: number;
    month?: string;
    swb: number;
    snwb: number;
    idling: number;
    shifting: number;
    imtime: number;
    omtime: number;
    pilotage: number;
    totalHours: number;
}

const COLORS = {
    working: "#13adc2ff",
    nonWorking: "#576ca5ff",

    idling: "#0952beff",
    shifting: "#2330e0ff",
    imtime: "#03a9f4",
    omtime: "#0288d1",
    pilotage: "#1e43e9ff",
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border p-2 rounded shadow-md text-sm text-gray-700">
                <p className="font-semibold">{label}</p>

                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toFixed(2)}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function OperationalTimeCompositionTwoCharts({
    startDate,
    endDate,
}: Props) {
    const [data, setData] = useState<any[]>([]);
    const [mode, setMode] = useState<"month" | "year">("year");

    const fetchData = async () => {
        let url = `${serverUrl}/api/y-o-y/operational-time-data?mode=${mode}`;
        if (mode === "month") {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        const res = await fetch(url);
        const json = await res.json();

        const formatted = json.map((d: ChartData) => ({
            name: mode === "year" ? d.year : d.month,

            // Chart 1 — Working vs Non-working
            Working: d.totalHours ? ((d.swb + d.snwb) / d.totalHours) * 100 : 0,
            NonWorking: d.totalHours
                ? (
                    (d.idling +
                        d.shifting +
                        d.imtime +
                        d.omtime +
                        d.pilotage) /
                    d.totalHours
                ) * 100
                : 0,

            // Chart 2 — Delay components
            Idling: d.totalHours ? (d.idling / d.totalHours) * 100 : 0,
            Shifting: d.totalHours ? (d.shifting / d.totalHours) * 100 : 0,
            IMTime: d.totalHours ? (d.imtime / d.totalHours) * 100 : 0,
            OMTime: d.totalHours ? (d.omtime / d.totalHours) * 100 : 0,
            Pilotage: d.totalHours ? (d.pilotage / d.totalHours) * 100 : 0,
        }));

        setData(formatted);
    };

    useEffect(() => {
        fetchData();
    }, [mode, startDate, endDate]);

    return (
        <div className=" bg-white rounded-2xl shadow-md mb-6">
            <div className="flex justify-between items-center m-3">
                <h2 className="text-md text-black font-semibold">
                    Vessel Time Utilization Breakdown  ({mode === "month" ? "Monthwise" : "Yearwise"})
                </h2>

                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "month" | "year")}
                    className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
                >
                    <option value="month">Monthwise</option>
                    <option value="year">Year-wise</option>
                </select>
            </div>
            <div className="grid grid-cols-10 gap-4  ">

                {/* FIRST CHART — PRODUCTIVE VS NON PRODUCTIVE */}
                <div className=" col-span-5 p-4 h-[350px] ">
                    <div className="flex flex-col mb-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-md text-black font-semibold">
                                Operational Time Composition
                            </h2>


                        </div>

                        {/* ----- CHART DESCRIPTION ----- */}
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="font-semibold text-green-700">Working</span> = SWB + SNWB &nbsp;&nbsp; | &nbsp;&nbsp;
                            <span className="font-semibold text-red-700">Non-Working</span> = Idling + Shifting + IM Time + OM Time + Pilotage
                        </p>
                    </div>


                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={data} stackOffset="expand" barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(v) => v + "%"} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            {/* Working */}
                            <Bar
                                dataKey="Working"
                                name="Working"
                                stackId="a"
                                fill={COLORS.working}
                            >
                                {data.map((_, idx) => <Cell key={idx} fill={COLORS.working} />)}
                            </Bar>

                            <Bar
                                dataKey="NonWorking"
                                name="Non-Working"
                                stackId="a"
                                fill={COLORS.nonWorking}
                            >
                                {data.map((_, idx) => <Cell key={idx} fill={COLORS.nonWorking} />)}
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* SECOND CHART — DELAY BREAKDOWN */}
                <div className=" col-span-5 p-4 h-[350px] ">
                    <h2 className="text-md text-black font-semibold mb-4">
                        Operational Delay Breakdown
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Breakdown of Non-Working Time into: Idling, Shifting, IM Time, OM Time, and Pilotage.
                    </p>


                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={data} stackOffset="expand" barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(v) => v + "%"} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            <Bar dataKey="Idling" stackId="b" fill={COLORS.idling}>
                                {data.map((_, idx) => <Cell key={idx} fill={COLORS.idling} />)}
                            </Bar>

                            <Bar dataKey="Shifting" stackId="b" fill={COLORS.shifting}>
                                {data.map((_, idx) => <Cell key={idx} fill={COLORS.shifting} />)}
                            </Bar>

                            <Bar dataKey="IMTime" stackId="b" fill={COLORS.imtime}>
                                {data.map((_, idx) => <Cell key={idx} fill={COLORS.imtime} />)}
                            </Bar>

                            <Bar dataKey="OMTime" stackId="b" fill={COLORS.omtime}>
                                {data.map((_, idx) => <Cell key={idx} fill={COLORS.omtime} />)}
                            </Bar>

                            <Bar dataKey="Pilotage" stackId="b" fill={COLORS.pilotage}>
                                {data.map((_, idx) => <Cell key={idx} fill={COLORS.pilotage} />)}
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
