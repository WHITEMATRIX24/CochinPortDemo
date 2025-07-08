'use client';

import { useState } from 'react';
import { MoreVertical, Search } from 'lucide-react';

const payments = [
  {
    id: '#P8723',
    vessel: 'MV Jag Ratan',
    berth: 'Q2',
    amount: '₹45,000',
    method: 'Online',
    status: 'Paid',
    paidOn: '2025-07-06 15:30',
  },
  {
    id: '#P8724',
    vessel: 'MT Saraswati',
    berth: 'Q1',
    amount: '₹28,500',
    method: 'NEFT',
    status: 'Pending',
    paidOn: '2025-07-01 01:00',
  },
  {
    id: '#P8725',
    vessel: 'MV Subhiksha',
    berth: 'Q3',
    amount: '₹72,000',
    method: 'Cash',
    status: 'Paid',
    paidOn: '2025-07-05 11:20',
  },
  {
    id: '#P8726',
    vessel: 'MT Ocean Pearl',
    berth: 'T1',
    amount: '₹39,000',
    method: 'Online',
    status: 'Failed',
    paidOn: '-',
  },
  {
    id: '#P8729',
    vessel: 'MT Ocean ',
    berth: 'Q!',
    amount: '₹39,000',
    method: 'Online',
    status: 'Paid',
    paidOn: '2025-07-08 15:50',
  },
  {
    id: '#P8723',
    vessel: 'MV Jag Ratan',
    berth: 'Q2',
    amount: '₹45,000',
    method: 'Online',
    status: 'Paid',
    paidOn: '2025-07-06 15:30',
  },
  {
    id: '#P8724',
    vessel: 'MT Saraswati',
    berth: 'Q1',
    amount: '₹28,500',
    method: 'NEFT',
    status: 'Pending',
    paidOn: '-',
  },
  {
    id: '#P8725',
    vessel: 'MV Subhiksha',
    berth: 'Q3',
    amount: '₹72,000',
    method: 'Cash',
    status: 'Paid',
    paidOn: '2025-07-05 11:20',
  },
  {
    id: '#P8726',
    vessel: 'MT Ocean Pearl',
    berth: 'T1',
    amount: '₹39,000',
    method: 'Online',
    status: 'Failed',
    paidOn: '-',
  },
  {
    id: '#P8729',
    vessel: 'MT Ocean ',
    berth: 'Q!',
    amount: '₹39,000',
    method: 'Online',
    status: 'Paid',
    paidOn: '2025-07-08 15:50',
  },
];

const statusColors: Record<string, string> = {
  Paid: 'bg-green-100 text-green-600',
  Pending: 'bg-yellow-100 text-yellow-600',
  Failed: 'bg-red-100 text-red-600',
};

const tabs = ['All', 'Paid', 'Pending', 'Failed'];

export default function PaymentTable() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBerth, setSelectedBerth] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPayments = payments.filter((payment) => {
    const matchesTab = selectedTab === 'All' || payment.status === selectedTab;
    const matchesSearch =
      payment.vessel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBerth = selectedBerth === 'All' || payment.berth === selectedBerth;

    const paidTime = new Date(payment.paidOn).getTime();
    const from = fromDate ? new Date(fromDate).getTime() : 0;
    const to = toDate ? new Date(toDate).getTime() + 86400000 : Infinity;

    const matchesDate = paidTime >= from && paidTime <= to;

    return matchesTab && matchesSearch && matchesBerth && matchesDate;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const dateA = new Date(a.paidOn).getTime();
    const dateB = new Date(b.paidOn).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const uniqueBerths = ['All', ...new Set(payments.map((p) => p.berth))];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md m-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between mb-5 gap-4">
        <div className="flex gap-6 text-lg font-bold">
          {tabs.map((tab) => (
            <span
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`cursor-pointer pb-2 transition-colors ${
                selectedTab === tab
                  ? 'text-[#014F86] font-bold border-b-2 border-[#014F86]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="flex items-center flex-wrap gap-5">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Vessel or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md border text-sm border-gray-300"
            />
          </div>

          <select
            value={selectedBerth}
            onChange={(e) => setSelectedBerth(e.target.value)}
            className="px-2 py-2 border rounded-md text-sm"
          >
            {uniqueBerths.map((berth) => (
              <option key={berth} value={berth}>
                {berth}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-2 py-1 border rounded-md text-sm"
          />
          <span className="text-sm">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-2 py-1 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[calc(100vh-380px)] m-5">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-[#014F86] text-white">
            <tr>
              <th className="px-4 py-3">Payment ID</th>
              <th className="px-4 py-3">Vessel</th>
              <th className="px-4 py-3">Berth</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              >
                <span className="flex items-center gap-1">
                  Paid On {sortOrder === 'asc' ? '▲' : '▼'}
                </span>
              </th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment, index) => (
                <tr
                  key={index}
                  className="bg-gray-100 border-b hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3">{payment.id}</td>
                  <td className="px-4 py-3">{payment.vessel}</td>
                  <td className="px-4 py-3">{payment.berth}</td>
                  <td className="px-4 py-3">{payment.amount}</td>
                  <td className="px-4 py-3">{payment.method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{payment.paidOn}</td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === index ? null : index)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenu === index && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                          View Receipt
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                          Message
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4 px-2">
        <div className="text-sm">
          Show{' '}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 px-2 py-1 rounded-md text-sm ml-1"
          >
            {[5, 10, 20, 50].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>{' '}
          entries per page
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-[#014F86] text-[#014F86] hover:bg-[#014F86] hover:text-white transition disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md border transition ${
                currentPage === page
                  ? 'bg-[#014F86] text-white border-[#014F86]'
                  : 'border-gray-300 text-[#014F86] hover:bg-[#014F86] hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-[#014F86] text-[#014F86] hover:bg-[#014F86] hover:text-white transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
