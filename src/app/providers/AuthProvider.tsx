import { createContext, useCallback, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { supabaseClient } from '../../lib/supabaseClient'

type Session = {
  user: string
}

type AuthContextValue = {
  user: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useLocalStorage<Session | null>(
    'kodi-auth-session',
    null,
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const {
        data,
        error: authError,
      } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      const userId = data.user?.id
      if (!userId) {
        throw new Error('Authenticated user missing id')
      }

      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (profileError) {
        throw profileError
      }

      if (!profile || profile.role !== 'admin') {
        await supabaseClient.auth.signOut()
        throw new Error('You must be an admin to access this app')
      }

      setSession({ user: email })
    },
    [setSession],
  )

  const logout = useCallback(() => {
    supabaseClient.auth.signOut().finally(() => {
      setSession(null)
    })
  }, [setSession])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      login,
    logout,
      isAuthenticated: Boolean(session?.user),
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

export default AuthProvider
