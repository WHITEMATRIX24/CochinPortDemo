'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Optional: to delay render

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
      // Show session expired only if redirected after logout
      localStorage.setItem('sessionExpired', 'true');
      router.replace('/login');
    } else {
      setLoading(false); // allow rendering if authenticated
    }
  }, [router]);

  

  if (loading) return null; // Prevent flash before auth check

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 0, background: 'white', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
