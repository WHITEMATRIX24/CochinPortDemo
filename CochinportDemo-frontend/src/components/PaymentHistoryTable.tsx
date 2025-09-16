'use client';

import { useState } from 'react';
import { CalendarDays, MoreVertical, Search } from 'lucide-react';


type Payment = {
  id: string;
  vessel: string;
  berth: string;
  amount: string;
  method: string;
  status: string;
  paidOn: string;
};

const payments = [
  {
    id: '#P8723',
    vessel: 'MV Jag Ratan',
    berth: 'Q2',
    amount: '₹45,000',
    method: 'UPI',
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
    method: 'Credit Card',
    status: 'Paid',
    paidOn: '2025-07-05 11:20',
  },
  {
    id: '#P8726',
    vessel: 'MT Ocean Pearl',
    berth: 'T1',
    amount: '₹39,000',
    method: 'UPI',
    status: 'Failed',
    paidOn: '-',
  },
  {
    id: '#P8729',
    vessel: 'MT Ocean ',
    berth: 'Q1',
    amount: '₹39,000',
    method: 'Credit Card',
    status: 'Paid',
    paidOn: '2025-07-08 15:50',
  },
  {
    id: '#P8723',
    vessel: 'MV Jag Ratan',
    berth: 'Q2',
    amount: '₹45,000',
    method: 'NEFT',
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
    method: 'UPI',
    status: 'Paid',
    paidOn: '2025-07-05 11:20',
  },
  {
    id: '#P8726',
    vessel: 'MT Ocean Pearl',
    berth: 'T1',
    amount: '₹39,000',
    method: 'NEFT',
    status: 'Failed',
    paidOn: '-',
  },
  {
    id: '#P8729',
    vessel: 'MT Ocean ',
    berth: 'Q1',
    amount: '₹39,000',
    method: 'UPI',
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

export default function PaymentHistoryTable() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBerth, setSelectedBerth] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPayments = payments.filter((payment) => {
  const matchesTab =
    selectedTab === 'All' || payment.status === selectedTab;

  const matchesSearch =
    payment.vessel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesBerth =
    selectedBerth === 'All' || payment.berth === selectedBerth;

  // 🗓️ Date filter logic
  const paidDate = new Date(payment.paidOn);
  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;

  const matchesDate =
    (!from || paidDate >= from) &&
    (!to || paidDate <= new Date(to.getTime() + 86400000 - 1)); // include end of day

  return matchesTab && matchesSearch && matchesBerth && matchesDate;
});

  
const sortedPayments = [...filteredPayments].sort((a, b) => {
  const dateA = new Date(a.paidOn).getTime() || 0;
  const dateB = new Date(b.paidOn).getTime() || 0;
  return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
});

const paginatedPayments = sortedPayments.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const uniqueBerths = ['All', ...new Set(payments.map((p) => p.berth))];

 
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
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
                  ? 'text-[#014F86] font-bold px-2 border-b-2 border-[#014F86]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="flex items-center flex-wrap gap-5">
          <div className="relative me-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Vessel or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md border text-sm border-gray-300 dark:border-gray-600 dark:bg-[#1c2232] dark:text-white"
            />
          </div>

          <select
            value={selectedBerth}
            onChange={(e) => setSelectedBerth(e.target.value)}
            className="px-2 py-2 border rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-[#1c2232] dark:text-white me-3"
          >
            {uniqueBerths.map((berth) => (
              <option key={berth} value={berth}>
                {berth}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-[#1c2232] dark:text-white"
            />
          </label>
          <span className="text-sm text-gray-700 dark:text-gray-300">to</span>
          <label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-[#1c2232] dark:text-white"
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto h-auto overflow-y-auto " style={{ height: 'calc(100vh - 380px)' }}>
        <div className="sticky top-0 z-10 grid grid-cols-8 bg-[#014F86] text-white text-sm font-semibold rounded-md mb-4 px-4 py-3">
          <div className="">Payment ID</div>
          <div className="">Vessel</div>
          <div className="">Berth</div>
          <div className="">Amount</div>
          <div className="">Method</div>
          <div className="">Status</div>
<div
  className="cursor-pointer flex items-center gap-1"
  onClick={() =>
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }
>
  Paid On
  <span className="text-xs">
    {sortOrder === 'asc' ? '▲' : '▼'}
  </span>
</div>
          <div className="">Action</div>
        </div>

        <div className="space-y-4">
          {paginatedPayments.length > 0 ? (
            paginatedPayments.map((payment, index) => (
              <div
                key={index}
                className="grid grid-cols-8 items-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 hover:border-blue-500 transition-colors"
              >
                <div className="text-sm text-gray-800 dark:text-white">{payment.id}</div>
                <div className="text-sm text-gray-800 dark:text-white">{payment.vessel}</div>
                <div className="text-sm text-gray-800 dark:text-white">{payment.berth}</div>
                <div className="text-sm text-gray-800  dark:text-white">{payment.amount}</div>
                <div className="text-sm text-gray-800 dark:text-white">{payment.method}</div>
                <div className=''>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[payment.status]}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-800 dark:text-white">{payment.paidOn}</div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === index ? null : index)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenu === index && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10">
                      <button
  onClick={() => {
    setSelectedPayment(payment);
    setOpenMenu(null);
  }}
  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
>
  View Receipt
</button>


                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 mt-4">No payments found.</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center items-center gap-2 text-sm">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    className="px-3 py-1 rounded-md border border-[#014F86] text-[#014F86] hover:bg-[#014F86] hover:text-white transition disabled:opacity-50"
    disabled={currentPage === 1}
  >
    Prev
  </button>

  {/* Page Numbers */}
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
    className="px-3 py-1 rounded-md border border-[#014F86] text-[#014F86] hover:bg-[#014F86] hover:text-white transition disabled:opacity-50"
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>
<div className="flex justify-between items-center mt-6 px-2">
  <div className="text-sm">
    Show{' '}
    <select
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page
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
</div>
{selectedPayment && (
  <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/30">
    <div className="bg-white dark:bg-[#1c2232] rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
      <button
        onClick={() => setSelectedPayment(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white"
      >
        ✕
      </button>

      <h2 className="text-lg font-bold mb-4 text-center border-b pb-2">
        Payment Receipt
      </h2>

      <div className="text-sm space-y-3 text-gray-700 dark:text-gray-200">
        <div className="flex justify-between">
          <span className="font-medium">Payment ID</span>
          <span>{selectedPayment.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Vessel</span>
          <span>{selectedPayment.vessel}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Berth</span>
          <span>{selectedPayment.berth}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Cargo Type</span>
          <span>Containerised</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Amount</span>
          <span>{selectedPayment.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Payment Method</span>
          <span>{selectedPayment.method}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status</span>
          <span className={`font-semibold ${statusColors[selectedPayment.status]}`}>
            {selectedPayment.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Paid On</span>
          <span>{selectedPayment.paidOn}</span>
        </div>
      </div>
    </div>
  </div>
)}




    </div>
  );
}
