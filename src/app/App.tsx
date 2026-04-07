import { useAuth } from '../features/auth/hooks/useAuth'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ApartmentsPage from '../features/apartments/pages/ApartmentsPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LoginPage from '../features/auth/pages/LoginPage'
import ProfilePage from '../features/profiles/pages/ProfilePage'
import SubscriptionsPage from '../features/subscriptions/pages/SubscriptionsPage'
import TransactionsPage from '../features/transactions/pages/TransactionsPage'
import AuthProvider from './providers/AuthProvider'
import ThemeProvider from './providers/ThemeProvider'
import DashboardLayout from '../components/layout/DashboardLayout'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="apartments" element={<ApartmentsPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="profiles" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
