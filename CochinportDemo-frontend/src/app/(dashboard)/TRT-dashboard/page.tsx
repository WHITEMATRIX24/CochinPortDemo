'use client';

import { useState } from "react";
import TRTComparisons from "@/components/TRTDashboard/TRTComparisons";
import TRTDataTable from "@/components/TRTDashboard/TRTDataTable";
import TRTFilters from "@/components/TRTDashboard/TRTFilters";
import TRTSummaryCards from "@/components/TRTDashboard/TRTSummaryCards";
import TRTTrendsChart from "@/components/TRTDashboard/TRTTrendsChart";
import { mockData, TRTData } from '@/data/TRTDashboardMockData';
import TrtGraphs from "@/components/TRTDashboard/TrtGraphs";


export default function TRTDashboardPage() {
    const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
    const [selectedMonth, setSelectedMonth] = useState<string | 'All'>('All');
    const filteredData: TRTData[] = mockData.filter((item) => {
        const matchYear = selectedYear === 'All' || item.year === selectedYear;
        const matchMonth = selectedMonth === 'All' || item.month === selectedMonth;
        return matchYear && matchMonth;
    });


    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans">

            {/* Sticky Header + Summary Cards */}
            <div className="sticky top-0 z-10 bg-white p-4 ">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        TRT Dashboard
                        <span className="text-sm ms-2 text-gray-500">
                            (Turnaround Time summary and Trends)
                        </span>
                    </h1>
                    <div className="text-sm text-gray-500">
                        <span>Dashboard</span>
                        <span className="mx-2">/</span>
                        <span className="text-blue-600">TRT Dashboard</span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mt-4">
                    <TRTSummaryCards />
                </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                {/* Charts: Trends & Comparisons */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TRTTrendsChart />
                    <TRTComparisons />
                </div>

                {/* TRT vs GRT/NRT/Deadweight Graphs */}
                <div>
                    <TrtGraphs />
                </div>

                {/* Filters + Data Table */}
                <div className="space-y-4">
                    <TRTFilters
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                        years={[...new Set(mockData.map((d) => d.year))]}
                        selectedMonth={selectedMonth}
                        onMonthChange={setSelectedMonth}
                    />
                    <TRTDataTable data={filteredData} />
                </div>
            </div>

        </div>
    );
}
