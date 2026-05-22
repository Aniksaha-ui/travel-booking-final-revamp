import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastProvider } from './components/common/Toaster'
import { APP_ROUTES } from './constants/routes'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { AppLayout } from './layout/AppLayout'

const Dashboard = lazy(() => import('./features/Dashboard/Dashboard'))
const RoutePage = lazy(() => import('./features/Routes/RoutePage'))
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm font-semibold text-slate-500">
      Loading...
    </div>
  )
}

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
            <Suspense fallback={<PageLoader />}>
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
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path={APP_ROUTES.routes}
          element={
            <Suspense fallback={<PageLoader />}>
              <RoutePage />
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
