import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import FullPageLoader from './components/common/FullPageLoader'
import { ToastProvider } from './components/common/Toaster'
import { APP_ROUTES } from './constants/routes'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { AppLayout } from './layout/AppLayout'

const AvgBookingValueReportPage = lazy(() => import('./features/AvgBookingValueReport/page/AvgBookingValueReportPage'))
const AccountBalancePage = lazy(() => import('./features/AccountBalance/page/AccountBalancePage'))
const AccountHistoryPage = lazy(() => import('./features/AccountHistory/page/AccountHistoryPage'))
const BookingsPage = lazy(() => import('./features/Bookings/page/BookingsPage'))
const BookingSummaryPage = lazy(() => import('./features/BookingSummary/page/BookingSummaryPage'))
const CustomerValueReportPage = lazy(() => import('./features/CustomerValueReport/page/CustomerValueReportPage'))
const DailyBalancePage = lazy(() => import('./features/DailyBalance/page/DailyBalancePage'))
const Dashboard = lazy(() => import('./features/Dashboard/page/DashboardPage'))
const FinancialReportPage = lazy(() => import('./features/FinancialReport/page/FinancialReportPage'))
const HighCancellationPackagesPage = lazy(() => import('./features/HighCancellationPackages/page/HighCancellationPackagesPage'))
const LowOccupancyReportPage = lazy(() => import('./features/LowOccupancyReport/page/LowOccupancyReportPage'))
const LowPerformingPackagesPage = lazy(() => import('./features/LowPerformingPackages/page/LowPerformingPackagesPage'))
const MonitoringPage = lazy(() => import('./features/Monitoring/page/MonitoringPage'))
const MonthRunningBalancePage = lazy(() => import('./features/MonthRunningBalance/page/MonthRunningBalancePage'))
const OverallSalesReportPage = lazy(() => import('./features/OverallSalesReport/page/OverallSalesReportPage'))
const PackagesPage = lazy(() => import('./features/Packages/page/PackagesPage'))
const RefundsPage = lazy(() => import('./features/Refunds/page/RefundsPage'))
const RoutePage = lazy(() => import('./features/Routes/page/RoutePage'))
const RouteWiseSalesReportPage = lazy(() => import('./features/RouteWiseSalesReport/page/RouteWiseSalesReportPage'))
const SeatManagementPage = lazy(() => import('./features/Seats/page/SeatManagementPage'))
const TicketStatusReportPage = lazy(() => import('./features/TicketStatusReport/page/TicketStatusReportPage'))
const TicketsPage = lazy(() => import('./features/Tickets/page/TicketsPage'))
const TransactionsPage = lazy(() => import('./features/Transactions/page/TransactionsPage'))
const TripPerformancePage = lazy(() => import('./features/TripPerformance/page/TripPerformancePage'))
const TripsPage = lazy(() => import('./features/Trips/page/TripsPage'))
const VisaCountriesPage = lazy(() => import('./features/VisaCountries/page/VisaCountriesPage'))
const VisaTypesPage = lazy(() => import('./features/VisaTypes/page/VisaTypesPage'))
const VehicleTrackingReportPage = lazy(() => import('./features/VehicleTrackingReport/page/VehicleTrackingReportPage'))
const VehicleWiseSeatReportPage = lazy(() => import('./features/VehicleWiseSeatReport/page/VehicleWiseSeatReportPage'))
const VehiclesPage = lazy(() => import('./features/Vehicles/page/VehiclesPage'))
const LoginPage = lazy(() => import('./features/auth/page/LoginPage'))

function ProtectedRoute({ children }) {
  const {
    auth: { isAuthenticated },
  } = useAuthContext()

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  return children
}

function GuestRoute({ children }) {
  const {
    auth: { isAuthenticated },
  } = useAuthContext()

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return children
}

function AppRoutes() {
  const {
    auth: { isAuthenticated },
  } = useAuthContext()

  return (
    <Routes>
      <Route
        path={APP_ROUTES.login}
        element={
          <GuestRoute>
            <Suspense fallback={<FullPageLoader message="Loading login..." />}>
              <LoginPage />
            </Suspense>
          </GuestRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to={APP_ROUTES.dashboard} replace />} />
        <Route
          path={APP_ROUTES.accountBalance}
          element={
            <Suspense fallback={<FullPageLoader message="Loading account balance..." />}>
              <AccountBalancePage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.accountHistory}
          element={
            <Suspense fallback={<FullPageLoader message="Loading account history..." />}>
              <AccountHistoryPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.avgBookingValueReport}
          element={
            <Suspense fallback={<FullPageLoader message="Loading average booking value report..." />}>
              <AvgBookingValueReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.bookings}
          element={
            <Suspense fallback={<FullPageLoader message="Loading bookings..." />}>
              <BookingsPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.customerValueReport}
          element={
            <Suspense fallback={<FullPageLoader message="Loading customer value report..." />}>
              <CustomerValueReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.bookingSummary}
          element={
            <Suspense fallback={<FullPageLoader message="Loading booking summary..." />}>
              <BookingSummaryPage />
            </Suspense>
          }
        />
        <Route path="/admin/booking-summary" element={<Navigate to={APP_ROUTES.bookingSummary} replace />} />
        <Route
          path={APP_ROUTES.dailyBalance}
          element={
            <Suspense fallback={<FullPageLoader message="Loading daily balance..." />}>
              <DailyBalancePage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.financialReport}
          element={
            <Suspense fallback={<FullPageLoader message="Loading financial report..." />}>
              <FinancialReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.overallSales}
          element={
            <Suspense fallback={<FullPageLoader message="Loading overall sales..." />}>
              <OverallSalesReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.routeWiseSales}
          element={
            <Suspense fallback={<FullPageLoader message="Loading route wise sales..." />}>
              <RouteWiseSalesReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.ticketStatusReport}
          element={
            <Suspense fallback={<FullPageLoader message="Loading ticket status report..." />}>
              <TicketStatusReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.highCancellationPackages}
          element={
            <Suspense fallback={<FullPageLoader message="Loading high cancellation packages..." />}>
              <HighCancellationPackagesPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.lowOccupancyReport}
          element={
            <Suspense fallback={<FullPageLoader message="Loading low occupancy report..." />}>
              <LowOccupancyReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.lowPerformingPackages}
          element={
            <Suspense fallback={<FullPageLoader message="Loading low-performing packages..." />}>
              <LowPerformingPackagesPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.monthRunningBalance}
          element={
            <Suspense fallback={<FullPageLoader message="Loading monthly running balance..." />}>
              <MonthRunningBalancePage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.monitoring}
          element={
            <Suspense fallback={<FullPageLoader message="Loading monitoring..." />}>
              <MonitoringPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.refunds}
          element={
            <Suspense fallback={<FullPageLoader message="Loading refunds..." />}>
              <RefundsPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.packages}
          element={
            <Suspense fallback={<FullPageLoader message="Loading packages..." />}>
              <PackagesPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.transactions}
          element={
            <Suspense fallback={<FullPageLoader message="Loading transactions..." />}>
              <TransactionsPage />
            </Suspense>
          }
        />
        <Route path="/admin/transaction" element={<Navigate to={APP_ROUTES.transactions} replace />} />
        <Route
          path={APP_ROUTES.tickets}
          element={
            <Suspense fallback={<FullPageLoader message="Loading tickets..." />}>
              <TicketsPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.tripPerformance}
          element={
            <Suspense fallback={<FullPageLoader message="Loading trip performance..." />}>
              <TripPerformancePage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.visaCountries}
          element={
            <Suspense fallback={<FullPageLoader message="Loading visa countries..." />}>
              <VisaCountriesPage />
            </Suspense>
          }
        />
        <Route path="/admin/visa/countries/add" element={<Navigate to={APP_ROUTES.visaCountries} replace />} />
        <Route path="/admin/visa/countries/update/:id" element={<Navigate to={APP_ROUTES.visaCountries} replace />} />
        <Route
          path={APP_ROUTES.visaTypes}
          element={
            <Suspense fallback={<FullPageLoader message="Loading visa types..." />}>
              <VisaTypesPage />
            </Suspense>
          }
        />
        <Route path="/admin/visa/types/add" element={<Navigate to={APP_ROUTES.visaTypes} replace />} />
        <Route path="/admin/visa/types/update/:id" element={<Navigate to={APP_ROUTES.visaTypes} replace />} />
        <Route
          path={APP_ROUTES.vehicleTrackingReport}
          element={
            <Suspense fallback={<FullPageLoader message="Loading vehicle tracking report..." />}>
              <VehicleTrackingReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.vehicleWiseSeatReport}
          element={
            <Suspense fallback={<FullPageLoader message="Loading vehicle wise seat report..." />}>
              <VehicleWiseSeatReportPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.dashboard}
          element={
            <Suspense fallback={<FullPageLoader message="Loading dashboard..." />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.routes}
          element={
            <Suspense fallback={<FullPageLoader message="Loading routes..." />}>
              <RoutePage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.vehicles}
          element={
            <Suspense fallback={<FullPageLoader message="Loading vehicles..." />}>
              <VehiclesPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.seats}
          element={
            <Suspense fallback={<FullPageLoader message="Loading seats..." />}>
              <SeatManagementPage />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.trips}
          element={
            <Suspense fallback={<FullPageLoader message="Loading trips..." />}>
              <TripsPage />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? APP_ROUTES.dashboard : APP_ROUTES.login} replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
