'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiLogOut,
  FiMenu,
  FiGrid,
  FiMap,
  FiBox,
  FiFileText,
  FiFolder,
  FiBarChart2,
  FiChevronDown,
  FiChevronRight,
  FiUsers,
  FiCalendar,
  FiArchive,
  FiMapPin,
  FiActivity,
  FiClock,
} from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    // Auto-expand the parent menu if a submenu matches the current pathname
    menuItems.forEach((item) => {
      if (item.children?.some((sub) => sub.href === pathname) && item.label !== "Dashboard") {
        setExpandedMenu(item.label);
      }
    });
  }, [pathname]);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <FiGrid />,
      children: [
        { label: 'Statistical Dashboard', icon: <FiActivity />, href: '/statistical-dashboard' },
        { label: 'Cargo Performance', icon: <FiArchive />, href: '/cargo-performance' },
        { label: 'Vessel Performance', icon: <FiBox />, href: '/vessel-performance' },
        { label: 'Vessel Time Utilization ', icon: <FiClock />, href: '/vessel-time-utilization' },
        { label: 'Year-on-Year Comparison', icon: <FiCalendar />, href: '/year-on-year' },
        { label: 'Berth Tracker', icon: <FiMap />, href: '/dashboard' },
        { label: 'Ship Movement Summary', icon: <FiFileText />, href: '/ship-movement-summary' },
        { label: 'TRT Dashboard', icon: <FaCalculator />, href: '/TRT-dashboard' },
        { label: 'Notification', icon: <FiFolder />, href: '#' }
      ],
    },
    {
      label: 'Ship Management',
      icon: <FiBox />,
      children: [
        { label: 'Ship Visit Tracker', icon: <FiActivity />, href: '/ship-visit-history' },
      ],
    },
    { label: 'Berth Management', icon: <FiMap />, href: '/berth-management' },
    { label: 'Cargo Management', icon: <FiArchive />, href: '#' },
    { label: 'User Management', icon: <FiUsers />, href: '#' },
    { label: 'Port Schedule', icon: <FiCalendar />, href: '#' },
    {
      label: 'Payment Management',
      icon: <FiFileText />,
      children: [
        { label: 'Payment History', icon: <FiFileText />, href: '/berth-payment-history' },
      ],
    },
    { label: 'Reports & Analytics', icon: <FiBarChart2 />, href: '#' },
    { label: 'Live Shipping Tracking', icon: <FiMapPin />, href: '#' },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('existingUser');
    sessionStorage.removeItem('isLoggedIn');
    if (window.innerWidth < 768) setSidebarOpen(false);
    window.location.href = '/login'; 
  };

  if (!isMounted) return null;

  return (
    <div className="flex">
      {/* Hamburger for small screens */}
      <div className="md:hidden p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl text-white">
          <FiMenu />
        </button>
      </div>

      <aside
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transform transition-transform duration-300 ease-in-out 
          fixed md:static z-40 top-0 left-0 h-screen overflow-y-auto w-70 
          bg-gradient-to-b from-[#014F86] via-[#006494] to-[#003049] 
          text-white shadow-xl md:flex flex-col justify-between py-6 px-4`}
      >
        {/* Top */}
        <div>
          <h1 className="text-2xl font-extrabold text-center mb-4 tracking-wide flex items-center justify-center gap-3">
            <img
              src="/images/cochinporticon.jpg"
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full"
            />
            PORTRAC
          </h1>

          <hr className="border-white/30 mb-6" />

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.label}>
                {/* Dashboard is always expanded */}
                {item.label === 'Dashboard' ? (
                  <div>
                    <div className="w-full flex items-center gap-3 px-3 py-2 font-semibold">
                      {item.icon}
                      {item.label}
                    </div>
                    <div className="ml-6 mt-1 space-y-1 text-sm">
                      {item.children?.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href || '#'}
                          onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                          className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded transition-all ${
                            pathname === sub.href
                              ? 'bg-white/20 text-white font-semibold shadow'
                              : 'hover:bg-white/10 text-white'
                          }`}
                        >
                          {sub.icon}
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : item.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/20 transition-all"
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      {expandedMenu === item.label ? <FiChevronDown /> : <FiChevronRight />}
                    </button>
                    {expandedMenu === item.label && (
                      <div className="ml-6 mt-1 space-y-1 text-sm">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href || '#'}
                            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                            className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded transition-all ${
                              pathname === sub.href
                                ? 'bg-white/20 text-white font-semibold shadow'
                                : 'hover:bg-white/10 text-white'
                            }`}
                          >
                            {sub.icon}
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/20 transition-all ${
                      pathname === item.href ? 'bg-white/20 font-bold shadow' : ''
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/20 transition-all"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="space-y-3 space-x-3">
          <hr className="border-white/30 mb-2 mt-2" />
          <div className="flex items-center space-x-3 justify-center">
            <img
              src="/images/users-icon.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-white shadow"
            />
            <span className="font-medium">John Doe</span>
          </div>
          <hr className="border-white/30 mb-8" />
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-5 hover:text-yellow-300 transition-colors text-lg"
            >
              <FiLogOut />
              <span className="text-base font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
