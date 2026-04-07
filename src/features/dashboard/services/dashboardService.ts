import { supabaseClient } from '../../../lib/supabaseClient'
import type { Apartment } from '../../apartments/types'
import type { Subscription } from '../../subscriptions/types'
import type { Transaction } from '../../transactions/types'
import type { DashboardSnapshot } from '../types'

const countRows = async (table: string): Promise<number> => {
  const { count, error } = await supabaseClient
    .from(table)
    .select('id', { count: 'exact', head: true })

  if (error) {
    throw error
  }

  return count ?? 0
}

const fetchLatest = async <T>(table: string, limit = 5): Promise<T[]> => {
  const { data, error } = await supabaseClient
    .from<T>(table)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data ?? []
}

export const fetchDashboardSnapshot = async (): Promise<DashboardSnapshot> => {
  const [totalApartments, totalSubscriptions, totalTransactions] =
    await Promise.all([
      countRows('apartments'),
      countRows('subscriptions'),
      countRows('transactions'),
    ])

  const [recentApartments, recentSubscriptions, recentTransactions] =
    await Promise.all([
      fetchLatest<Apartment>('apartments'),
      fetchLatest<Subscription>('subscriptions'),
      fetchLatest<Transaction>('transactions'),
    ])

  return {
    totalApartments,
    totalSubscriptions,
    totalTransactions,
    recentApartments,
    recentSubscriptions,
    recentTransactions,
  }
}
