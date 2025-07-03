'use client';

import { useState } from 'react';
import {
  FiLogOut,
  FiMenu,
  FiGrid,
  FiMap,
  FiBox,
  FiFileText,
  FiFolder,
  FiBarChart2,
} from 'react-icons/fi';

export default function Sidebar() {
  const submenuLinks = [
    { label: 'BerthTracker', icon: <FiMap /> },
    { label: 'Sample', icon: <FiBox /> },
    { label: 'Sample1', icon: <FiFileText /> },
    { label: 'Sample2', icon: <FiFolder /> },
    { label: 'Sample3', icon: <FiBarChart2 /> },
  ];

  const [selected, setSelected] = useState('BerthTracker');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (item: string) => {
    setSelected(item);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex">
      {/* Hamburger menu for small screens */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-white"
        >
          <FiMenu />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transform transition-transform duration-300 ease-in-out 
        fixed md:static z-40 top-0 left-0 h-full w-64 
        bg-gradient-to-b from-[#014F86] via-[#006494] to-[#003049] 
        text-white shadow-xl md:flex flex-col justify-between py-6 px-4`}
      >
        {/* Top section */}
        <div>
          <h1 className="text-2xl font-extrabold text-center text-white mb-4 drop-shadow tracking-wide">
            KOCHI PORT
          </h1>
          <hr className="border-t border-white/30 mb-6" />

          <nav className="space-y-4">
            <a
              href="#"
              onClick={() => handleNavClick('Dashboard')}
              className={`flex items-center gap-3 text-lg py-2 px-3 rounded hover:bg-white/20 transition-all ${
                selected === 'Dashboard'
                  ? 'bg-white/20 text-white font-bold shadow'
                  : ''
              }`}
            >
              <FiGrid />
              Dashboard
            </a>

            <div className="ml-2 space-y-2 text-sm">
              {submenuLinks.map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  onClick={() => handleNavClick(label)}
                  className={`flex items-center gap-3 py-2 px-3 rounded transition-all ${
                    selected === label
                      ? 'bg-white/20 text-white font-semibold shadow'
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <button
              onClick={() => {
                console.log('Logging out...');
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors text-lg"
            >
              <FiLogOut />
              <span className="text-base font-medium">Logout</span>
            </button>
          </div>

          <hr className="border-t border-white/30 mb-2" />

          <div className="flex items-center space-x-3 justify-center">
            <img
              src="/images/users-icon.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-white shadow"
            />
            <span className="font-medium text-white">John Doe</span>
          </div>

          <hr className="border-t border-white/30 mb-8" />
        </div>
      </aside>
    </div>
  );
}
