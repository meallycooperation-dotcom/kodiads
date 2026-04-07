import { useEffect, useState } from 'react'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { fetchDashboardSnapshot } from '../services/dashboardService'
import type { DashboardSnapshot } from '../types'

const DashboardPage = () => {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadSnapshot = async () => {
      try {
        const data = await fetchDashboardSnapshot()
        if (!mounted) {
          return
        }
        setSnapshot(data)
      } catch (err) {
        console.error(err)
        if (mounted) {
          setError('Unable to load dashboard statistics')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSnapshot()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Overview</p>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          High-level metrics pulled straight from your Supabase tables.
        </p>
      </header>

      {loading && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-600">
          Loading dashboard data…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && snapshot && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Apartments</p>
              <p className="text-4xl font-semibold text-slate-900">
                {snapshot.totalApartments}
              </p>
              <p className="text-sm text-slate-500">Total apartment records</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Subscriptions
              </p>
              <p className="text-4xl font-semibold text-slate-900">
                {snapshot.totalSubscriptions}
              </p>
              <p className="text-sm text-slate-500">Active subscriptions</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Payments</p>
              <p className="text-4xl font-semibold text-slate-900">
                {snapshot.totalTransactions}
              </p>
              <p className="text-sm text-slate-500">Total transactions</p>
            </article>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Recent apartments</h2>
              <p className="text-sm text-slate-500">Last 5 apartments created</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              {snapshot.recentApartments.length === 0 ? (
                <p className="text-sm text-slate-500">No apartments yet</p>
              ) : (
                <ul className="space-y-3">
                  {snapshot.recentApartments.map((apartment) => (
                    <li
                      key={apartment.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{apartment.name}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          {apartment.location ?? 'Unknown location'}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(apartment.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <article className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">Subscriptions</h2>
                <p className="text-sm text-slate-500">Latest subscription updates</p>
              </div>
              {snapshot.recentSubscriptions.length === 0 ? (
                <p className="text-sm text-slate-500">No subscriptions yet</p>
              ) : (
                <div className="space-y-2">
                  {snapshot.recentSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {subscription.plan_name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          {subscription.status ?? 'pending'}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatCurrency(subscription.amount_paid)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
                <p className="text-sm text-slate-500">Recent payments</p>
              </div>
              {snapshot.recentTransactions.length === 0 ? (
                <p className="text-sm text-slate-500">No transactions yet</p>
              ) : (
                <div className="space-y-2">
                  {snapshot.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {transaction.payment_reference}
                        </p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          {transaction.plan}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatCurrency(transaction.amount, transaction.currency ?? 'KES')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  )
}

export default DashboardPage
