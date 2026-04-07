import { useAuth } from '../../features/auth/hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Hello,
        </p>
        <p className="text-base font-semibold text-slate-900">{user ?? 'Admin'}</p>
      </div>
      <button
        onClick={logout}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
      >
        Sign out
      </button>
    </header>
  )
}

export default Navbar
