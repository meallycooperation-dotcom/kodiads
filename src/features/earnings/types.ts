import type { Transaction } from '../transactions/types'

export type EarningsSummary = {
  totalEarned: number
  currency: string
  recentTransactions: Transaction[]
}
