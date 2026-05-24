import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { getSupportedRoute, hasChildren } from '../features/menu/utils/menuHelpers'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

const pageTitles = {
  '/admin/avg-booking-value-report': 'Average Booking Value Report',
  '/admin/bookings/summary': 'Booking Summary Report',
  '/admin/account/daily-balance': 'Monthly Daily Balance',
  '/admin/high-cancellation-packages': 'High Cancellation Packages',
  '/admin/low-occupancy-report': 'Low Occupancy Report',
  '/admin/monthRunningBalance': 'Monthly Running Balance',
  '/admin/packages': 'Package Management',
  '/admin/refunds': 'Refund Management',
  '/admin/tickets': 'Ticket Management',
  '/admin/tripPerformance': 'Trip Performance',
  '/admin/vehicletrackingreport': 'Vehicle Tracking Report',
  '/admin/vehiclewiseseatreport': 'Vehicle Wise Seat Report',
  '/dashboard': 'Dashboard',
  '/routes': 'Routes',
  '/seats': 'Seat Management',
  '/trips': 'Trip Management',
  '/vehicles': 'Vehicles',
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { menu } = useAuthContext()
  const title =
    findMenuTitle([...menu.mainMenuItems, ...menu.bottomMenuItems], location.pathname) ??
    pageTitles[location.pathname] ??
    'Dashboard'

  return (
    <div className="flex min-h-dvh bg-[#100d0e] text-slate-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto bg-[#100d0e]">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}

function findMenuTitle(items, pathname) {
  for (const item of items) {
    if (getSupportedRoute(item.path) === pathname) {
      return item.title
    }

    if (hasChildren(item)) {
      const childTitle = findMenuTitle(item.children, pathname)

      if (childTitle) {
        return childTitle
      }
    }
  }

  return null
}
