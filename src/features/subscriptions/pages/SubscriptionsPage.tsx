import { useEffect, useState } from 'react'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { fetchSubscriptions } from '../services/subscriptionService'
import type { Subscription } from '../types'

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadSubscriptions = async () => {
      try {
        const data = await fetchSubscriptions()
        if (mounted) {
          setSubscriptions(data)
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          setError('Unable to load subscriptions')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSubscriptions()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Plans</p>
        <h1 className="text-3xl font-semibold text-slate-900">Subscriptions</h1>
        <p className="text-sm text-slate-500">
          The current subscription records.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Subscriber</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Limits</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ends at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading subscriptions…
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-4 py-4 text-slate-700">
                      {subscription.subscriber_name ?? 'Unknown user'}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {subscription.plan_name}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      Apt {subscription.max_apartments} · Airbnb {subscription.max_airbnbs} ·
                      Rentals {subscription.max_rentals}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {formatCurrency(subscription.amount_paid)}
                    </td>
                    <td className="px-4 py-4 uppercase text-xs tracking-[0.3em] text-slate-500">
                      {subscription.status ?? 'active'}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(subscription.ends_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsPage
