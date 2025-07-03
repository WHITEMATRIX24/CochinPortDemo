import Sidebar from '@/components/Sidebar'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 12, background: 'white', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}
