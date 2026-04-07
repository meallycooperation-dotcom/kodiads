import { useEffect, useState } from 'react'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import {
  fetchSubscriptions,
  updateSubscription,
} from '../services/subscriptionService'
import type { Subscription } from '../types'

const statusOptions = ['active', 'trialing', 'past_due', 'canceled', 'expired']

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftStatus, setDraftStatus] = useState('')
  const [draftEndsAt, setDraftEndsAt] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  const toInputDate = (value?: string | null) => {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return date.toISOString().split('T')[0]
  }

  const resetEditing = () => {
    setEditingId(null)
    setDraftStatus('')
    setDraftEndsAt('')
  }

  const handleStartEditing = (subscription: Subscription) => {
    setEditingId(subscription.id)
    setDraftStatus(subscription.status ?? statusOptions[0])
    setDraftEndsAt(toInputDate(subscription.ends_at))
    setError(null)
  }

  const handleSave = async (subscription: Subscription) => {
    const statusValue = draftStatus || statusOptions[0]
    const endsAtIso = draftEndsAt ? new Date(draftEndsAt).toISOString() : null

    setSavingId(subscription.id)
    try {
      await updateSubscription({
        id: subscription.id,
        status: statusValue,
        ends_at: endsAtIso,
      })

      setSubscriptions((prev) =>
        prev.map((item) =>
          item.id === subscription.id
            ? {
                ...item,
                status: statusValue,
                ends_at: endsAtIso,
              }
            : item,
        ),
      )

      resetEditing()
    } catch (err) {
      console.error(err)
      setError('Unable to update subscription')
    } finally {
      setSavingId(null)
    }
  }

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
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => {
                  const isEditing = editingId === subscription.id
                  return (
                    <tr key={subscription.id}>
                      <td className="px-4 py-4 text-slate-700">
                        {subscription.subscriber_name ?? 'Unknown user'}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {subscription.plan_name}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        Apt {subscription.max_apartments} / Airbnb {subscription.max_airbnbs} / Rentals {subscription.max_rentals}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {formatCurrency(subscription.amount_paid)}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 focus:border-slate-400 focus:outline-none"
                            value={draftStatus}
                            onChange={(event) => setDraftStatus(event.target.value)}
                          >
                            {statusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="uppercase text-xs tracking-[0.3em] text-slate-500">
                            {subscription.status ?? 'active'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <input
                            type="date"
                            value={draftEndsAt}
                            onChange={(event) => setDraftEndsAt(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
                          />
                        ) : (
                          <span className="text-slate-500">
                            {formatDate(subscription.ends_at)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleSave(subscription)}
                              disabled={savingId === subscription.id}
                              className="rounded-xl border border-slate-900 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {savingId === subscription.id ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={resetEditing}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEditing(subscription)}
                            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:text-slate-900"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsPage
