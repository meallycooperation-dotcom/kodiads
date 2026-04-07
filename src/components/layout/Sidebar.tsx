import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Apartments', to: '/apartments' },
  { label: 'Subscriptions', to: '/subscriptions' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Profiles', to: '/profiles' },
]

const Sidebar = () => (
  <aside className="flex w-64 flex-col gap-6 border-r border-slate-200 bg-white/80 px-6 py-8 shadow-sm backdrop-blur">
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Kodi</p>
      <h2 className="text-2xl font-semibold text-slate-900">Admin</h2>
    </div>
    <nav className="flex flex-1 flex-col gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default Sidebar
