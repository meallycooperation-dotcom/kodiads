import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      setError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-slate-200 backdrop-blur">
        <header className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-500">
            Only admins may access the dashboard. Please use your official account.
          </p>
        </header>
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <LoginForm onSubmit={handleSubmit} loading={loading} />
      </section>
    </div>
  )
}

export default LoginPage
