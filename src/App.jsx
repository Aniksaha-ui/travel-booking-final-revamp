import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import FullPageLoader from './components/common/FullPageLoader'
import { ToastProvider } from './components/common/Toaster'
import { APP_ROUTES } from './constants/routes'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { AppLayout } from './layout/AppLayout'

const DailyBalancePage = lazy(() => import('./features/DailyBalance/page/DailyBalancePage'))
const Dashboard = lazy(() => import('./features/Dashboard/page/DashboardPage'))
const LowOccupancyReportPage = lazy(() => import('./features/LowOccupancyReport/page/LowOccupancyReportPage'))
const MonthRunningBalancePage = lazy(() => import('./features/MonthRunningBalance/page/MonthRunningBalancePage'))
const PackagesPage = lazy(() => import('./features/Packages/page/PackagesPage'))
const RefundsPage = lazy(() => import('./features/Refunds/page/RefundsPage'))
const RoutePage = lazy(() => import('./features/Routes/page/RoutePage'))
const SeatManagementPage = lazy(() => import('./features/Seats/page/SeatManagementPage'))
const TicketsPage = lazy(() => import('./features/Tickets/page/TicketsPage'))
const TripPerformancePage = lazy(() => import('./features/TripPerformance/page/TripPerformancePage'))
const TripsPage = lazy(() => import('./features/Trips/page/TripsPage'))
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
          path={APP_ROUTES.dailyBalance}
          element={
            <Suspense fallback={<FullPageLoader message="Loading daily balance..." />}>
              <DailyBalancePage />
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
          path={APP_ROUTES.monthRunningBalance}
          element={
            <Suspense fallback={<FullPageLoader message="Loading monthly running balance..." />}>
              <MonthRunningBalancePage />
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
