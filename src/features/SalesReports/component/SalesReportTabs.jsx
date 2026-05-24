import { CircleDollarSign, Route, Ticket } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { APP_ROUTES } from '../../../constants/routes'

const SALES_REPORT_TABS = [
  {
    icon: CircleDollarSign,
    label: 'Overall Sales',
    to: APP_ROUTES.overallSales,
  },
  {
    icon: Route,
    label: 'Route Wise Sales',
    to: APP_ROUTES.routeWiseSales,
  },
  {
    icon: Ticket,
    label: 'Ticket Status Analysis',
    to: APP_ROUTES.ticketStatusReport,
  },
]

export function SalesReportTabs() {
  return (
    <nav className="sales-report-tabs" aria-label="Sales report navigation">
      {SALES_REPORT_TABS.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sales-report-tab ${isActive ? 'is-active' : ''}`}
          >
            <Icon size={15} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
