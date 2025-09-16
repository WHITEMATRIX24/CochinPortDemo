'use client';

import { Bell, Settings } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Card from '@/components/BerthTrackerCard';
import { useEffect, useState } from 'react';
import CargoStats from '@/components/CargoStats';
import ShipListModal from '@/components/ShipListModal';
import { ShipDetails, Berth, berthData } from '@/data/MockDashboardData';
import DashboardNotificationSidebar from '@/components/DashboardNotificationSidebar';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
const cargoTypes = [
  'All',
  'Containerised',
  'Liquid Bulk',
  'Non Cargo',
  'Dry Bulk Mechanical',
  'Break Bulk',
];

export default function HomePage() {
  console.log('hai');

  const router = useRouter();
  const [filter, setFilter] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedBerth, setSelectedBerth] = useState<Berth | null>(null);
  const [selectedShip, setSelectedShip] = useState<ShipDetails | null>(null);
  const [showShipListModal, setShowShipListModal] = useState(false);
  const [showShipDetailModal, setShowShipDetailModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log('Dashboard token check:', token);

    if (!token) {
      router.push('/login');
    }
  }, []);

  const countries = ['All', ...new Set(berthData.map((item) => item.country))];

  function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const isFilteringActive =
    filter !== 'All' ||
    selectedCountry !== 'All' ||
    startDate !== null ||
    endDate !== null;

  const filteredData = berthData.filter((item) => {
    const isCurrentlyDocked = item.shipDetails?.some((ship) => ship.isCurrent);

    // 🟡 If filtering is active, show only currently docked berths
    if (isFilteringActive && !isCurrentlyDocked) return false;
    const cargoMatch = filter === 'All' || item.cargoType === filter;
    const countryMatch = selectedCountry === 'All' || item.country === selectedCountry;

    const arrivalDate = normalizeDate(new Date(item.arrivalDate));
    const departureDate = normalizeDate(new Date(item.departureDate));
    const start = startDate ? normalizeDate(startDate) : null;
    const end = endDate ? normalizeDate(endDate) : null;
    const dateMatch =
      (!start || arrivalDate >= start) &&
      (!end || departureDate <= end);

    return cargoMatch && countryMatch && dateMatch;
  });

  const handleBerthClick = (berth: Berth) => {
    setSelectedBerth(berth);
    setShowShipListModal(true);
  };

  const closeModals = () => {
    setShowShipListModal(false);
    setSelectedShip(null);
    setSelectedBerth(null);
  };

  return (
    <div className="relative h-screen bg-gray-100  text-gray-900  ">
      <main className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex-shrink-0 p-4">
          <div className="mb-4 p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h5 className="text-2xl font-bold text-[#003049]">
                Welcome, <span className="text-[#8B0000]">John Doe</span>
              </h5>
              <div className="text-sm text-gray-500 mt-1">
                <span>Dashboard</span> <span className="mx-2">/</span> <span className="text-blue-600">Berth Tracker</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mr-2">
              {/* Notification Bell */}
              <button className="relative" onClick={() => setShowNotif(true)}>
                <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
              </button>

              {/* Settings Button */}
              <button
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => alert('Theme switch coming soon')}
              >
                <Settings className="w-6 h-6" />
              </button>
              {/* <ThemeToggle/> */}
            </div>
          </div>

          {/* Filter Section */}
          <div className="px-3 mt-4 flex justify-end">
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              <div className="flex flex-col w-full max-w-xs">
                <label className="text-sm font-semibold text-gray-700 mb-2">Cargo Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900 w-full"
                >
                  {cargoTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </select>
              </div>

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

              <div className="flex flex-col w-full max-w-xs">
                <label className="text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="dd-mm-yyyy"
                  isClearable
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900 w-full"
                />
              </div>

              <div className="flex flex-col w-full max-w-xs">
                <label className="text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="dd-mm-yyyy"
                  isClearable
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900 w-full"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Main Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredData.map((berth, index) => (
              <Card
                key={index}
                imageSrc={berth.imageSrc}
                currentShipId={berth.shipDetails.find(s => s.isCurrent)?.id}
                berthNumber={berth.berthNumber}
                countryFlag={berth.countryFlag}
                arrivalDate={berth.arrivalDate}
                departureDate={berth.departureDate}
                onClick={() => handleBerthClick(berth)}
              />
            ))}
          </div>

          <div className="mt-8">
            <CargoStats berthData={berthData} />
          </div>

          <ShipListModal
            berth={selectedBerth}
            isOpen={showShipListModal}
            onSelectShip={(ship) => {
              setSelectedShip(ship);
              setShowShipDetailModal(true);
            }}
            onClose={closeModals}
          />

          <DashboardNotificationSidebar
            show={showNotif}
            onClose={() => setShowNotif(false)}
          />
        </div>
      </main>
    </div>
  );
}
