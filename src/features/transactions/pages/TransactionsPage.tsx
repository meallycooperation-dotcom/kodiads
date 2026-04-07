import { useEffect, useState } from 'react'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { fetchTransactions } from '../services/transactionService'
import type { Transaction } from '../types'

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions()
        if (mounted) {
          setTransactions(data)
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          setError('Unable to load transactions')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadTransactions()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Payments</p>
        <h1 className="text-3xl font-semibold text-slate-900">Transactions</h1>
        <p className="text-sm text-slate-500">Latest activity across system.</p>
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
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Paid at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading transactions…
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {transaction.payment_reference}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {transaction.user_name ?? 'Unknown user'}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{transaction.plan}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {formatCurrency(transaction.amount, transaction.currency ?? 'KES')}
                    </td>
                    <td className="px-4 py-4 uppercase text-xs tracking-[0.3em] text-slate-500">
                      {transaction.status ?? 'pending'}
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
      </div>
    </div>
  )
}

export default TransactionsPage
