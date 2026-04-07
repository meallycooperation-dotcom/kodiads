import { useEffect, useState } from 'react'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { fetchEarningsSummary } from '../services/earningsService'
import type { EarningsSummary } from '../types'

const EarningsPage = () => {
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadSummary = async () => {
      try {
        const data = await fetchEarningsSummary()
        if (mounted) {
          setSummary(data)
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          setError('Unable to load earnings')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSummary()

    return () => {
      mounted = false
    }
  }, [])

  const recentTransactions = summary?.recentTransactions ?? []
  const total = summary
    ? formatCurrency(summary.totalEarned, summary.currency)
    : formatCurrency(null)
  const currency = summary?.currency ?? 'KES'

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Earnings</p>
        <h1 className="text-3xl font-semibold text-slate-900">Revenue</h1>
        <p className="text-sm text-slate-500">
          Total successful transactions calculated from the payments table.
        </p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <article className="flex-1 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total earned</p>
          <p className="mt-1 text-4xl font-semibold text-slate-900">{total}</p>
              <p className="text-sm text-slate-500">
                {loading ? 'Refreshing…' : `${recentTransactions.length} recent successes`}
              </p>
        </article>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Paid at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    Loading earnings…
                  </td>
                </tr>
              ) : recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    No successful transactions yet
                  </td>
                </tr>
              ) : (
                recentTransactions.map((transaction) => (
                  <tr key={transaction.payment_reference}>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {transaction.payment_reference}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {formatCurrency(transaction.amount, transaction.currency ?? currency)}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(transaction.paid_at ?? transaction.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default EarningsPage
