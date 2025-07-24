'use client';

import { useEffect } from "react";


type TRTFiltersProps = {
    selectedYear: number | 'All';
    onYearChange: (year: number | 'All') => void;
    years: number[];
    selectedMonth: string | 'All'; // <== use string
    onMonthChange: (month: string | 'All') => void; // <== use string
};


export default function TRTFilters({
    selectedYear,
    onYearChange,
    years,
    selectedMonth,
    onMonthChange
}: TRTFiltersProps) {

      useEffect(() => {
    console.log('Selected Month prop received:', selectedMonth);
  }, [selectedMonth]);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Year Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedYear}
                    onChange={(e) => {
                        const value = e.target.value === 'All' ? 'All' : parseInt(e.target.value);
                        onYearChange(value);
                    }}
                >
                    <option value="All">All</option>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Month Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                    className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-700 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value === 'All' ? 'All' : e.target.value)}
                >
                    <option value="All">All</option>
                    {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December',
                    ].map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>

            </div>

        </div>
    );
}

