'use client';

import { Bell, Settings } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BerthTrackerCard from '@/components/BerthTracker';
import { useEffect, useState } from 'react';
import DashboardNotificationSidebar from '@/components/DashboardNotificationSidebar';
import { useRouter } from 'next/navigation';
import { serverUrl } from '@/services/serverUrl';

export interface Vessel {
  _id: string;
  VslID: string;
  Berth: string;
  CargoType: string;
  FlagCountry: string;
  ATA?: string | null;
  ATD?: string | null;
  // other fields...
}

export interface BerthStatus {
  berthId: string;
  isOccupied: boolean;
  currentVessel: Vessel | null;
}

export default function HomePage() {
  const router = useRouter();

  // Filters
  const [filter, setFilter] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  // Data
  const [berthData, setBerthData] = useState<BerthStatus[]>([]);
  const [cargoTypesList, setCargoTypesList] = useState<string[]>(['All']);
  const [countries, setCountries] = useState<string[]>(['All']);

  // UI states
  const [showNotif, setShowNotif] = useState(false);

  // ✅ Check token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  // ✅ Fetch berth data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('date', startDate.toISOString());

        const res = await fetch(`${serverUrl}/api/berthData/get-berth-data?${params.toString()}`);
        const data: BerthStatus[] = await res.json();
        setBerthData(data);

       // Compute dropdowns from fetched data
const cargoSet: string[] = Array.from(
  new Set(
    data
      .map(b => b.currentVessel?.CargoType)
      .filter((c): c is string => !!c) // filter out undefined/null
  )
);

const countrySet: string[] = Array.from(
  new Set(
    data
      .map(b => b.currentVessel?.FlagCountry)
      .filter((c): c is string => !!c) // filter out undefined/null
  )
);

setCargoTypesList(['All', ...cargoSet]);
setCountries(['All', ...countrySet]);

      } catch (err) {
        console.error('Error fetching berth data:', err);
      }
    };

    fetchData();
  }, [startDate]);

  // ✅ Frontend filtering based on dropdowns
  const filteredData = berthData.filter(b => {
    const cargoMatch = filter === 'All' || b.currentVessel?.CargoType === filter;
    const countryMatch = selectedCountry === 'All' || b.currentVessel?.FlagCountry === selectedCountry;
    return cargoMatch && countryMatch;
  });

  // ✅ Handle berth click
  const handleBerthClick = (berth: BerthStatus) => {
    if (berth.isOccupied && berth.currentVessel) {
      alert(`Ship at berth ${berth.berthId}: ${berth.currentVessel.VslID}`);
    } else {
      alert(`Berth ${berth.berthId} is available`);
    }
  };

  // ✅ Reset filters
  const handleReset = () => {
    setFilter('All');
    setSelectedCountry('All');
    setStartDate(new Date());
  };

  return (
    <div className="relative h-screen bg-gray-100 text-gray-900">
      <main className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-4">
          <div className="mb-4 p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h5 className="text-2xl font-bold text-[#003049]">
                Welcome, <span className="text-[#8B0000]">John Doe</span>
              </h5>
              <div className="text-sm text-gray-500 mt-1">
                <span>Dashboard</span> <span className="mx-2">/</span>{' '}
                <span className="text-blue-600">Berth Tracker</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mr-2">
              <button className="relative" onClick={() => setShowNotif(true)}>
                <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
              </button>
              <button className="text-gray-700 hover:text-blue-600 transition" onClick={() => alert('Theme switch coming soon')}>
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-3 mt-4 flex flex-col sm:flex-row gap-6 w-full">
            {/* Cargo Type */}
            <div className="flex flex-col w-full max-w-xs">
              <label className="text-sm font-semibold text-gray-700 mb-2">Cargo Type</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900 w-full"
              >
                {cargoTypesList.map((type, i) => (
                  <option key={i} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="flex flex-col w-full max-w-xs">
              <label className="text-sm font-semibold text-gray-700 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900 w-full"
              >
                {countries.map((country, i) => (
                  <option key={i} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col w-full max-w-xs">
              <label className="text-sm font-semibold text-gray-700 mb-2">Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                isClearable
                className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900 w-full"
              />
            </div>

            {/* Reset Button */}
            <div className="">
              <button
                onClick={handleReset}
                className="px-4 py-2 mt-7 rounded-lg text-sm font-medium border border-[#003049] text-black hover:bg-[#01497c] hover:text-white active:scale-95 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Berth Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredData.map((berth, index) => (
              <BerthTrackerCard
                key={index}
                berth={berth}
                onClick={() => handleBerthClick(berth)}
              />
            ))}
          </div>
        </div>
      </main>

      <DashboardNotificationSidebar
        show={showNotif}
        onClose={() => setShowNotif(false)}
      />
    </div>
  );
}
