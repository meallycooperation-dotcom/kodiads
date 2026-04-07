import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const DashboardLayout = () => (
  <div className="flex min-h-screen bg-slate-950 text-slate-900">
    <Sidebar />
    <div className="flex flex-1 flex-col bg-slate-100">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  </div>
)

export default DashboardLayout
