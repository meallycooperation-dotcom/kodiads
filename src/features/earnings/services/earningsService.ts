import { supabaseClient } from '../../../lib/supabaseClient'
import type { Transaction } from '../../transactions/types'
import type { EarningsSummary } from '../types'

const toNumber = (value: unknown) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export const fetchEarningsSummary = async (): Promise<EarningsSummary> => {
  const [summaryResult, recentResult] = await Promise.all([
    supabaseClient
      .from<Transaction>('transactions')
      .select('amount,status')
      .eq('status', 'success'),
    supabaseClient
      .from<Transaction>('transactions')
      .select('payment_reference,amount,currency,paid_at,status')
      .eq('status', 'success')
      .order('paid_at', { ascending: false })
      .limit(5),
  ])

  const { data: summaryData, error: summaryError } = summaryResult
  const { data: recentData, error: recentError } = recentResult

  if (summaryError) {
    throw summaryError
  }

  if (recentError) {
    throw recentError
  }

  const totalEarned = (summaryData ?? []).reduce(
    (sum, item) => sum + toNumber(item.amount),
    0,
  )

  const currency =
    recentData?.find((item) => item.currency)?.currency ?? 'KES'

  return {
    totalEarned,
    currency,
    recentTransactions: recentData ?? [],
  }
}
