import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import FullPageLoader from './components/common/FullPageLoader'
import { ToastProvider } from './components/common/Toaster'
import { APP_ROUTES } from './constants/routes'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { AppLayout } from './layout/AppLayout'

const Dashboard = lazy(() => import('./features/Dashboard/pages/DashboardPage'))
const RoutePage = lazy(() => import('./features/Routes/pages/RoutePage'))
const SeatManagementPage = lazy(() => import('./features/Seats/pages/SeatManagementPage'))
const TripsPage = lazy(() => import('./features/Trips/pages/TripsPage'))
const VehiclesPage = lazy(() => import('./features/Vehicles/pages/VehiclesPage'))
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'))

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
