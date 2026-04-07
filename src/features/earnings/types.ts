export type EarningsSummary = {
  totalEarned: number
  currency: string
  recentTransactions: EarningsTransaction[]
}

export type EarningsTransaction = {
  payment_reference: string
  amount: number
  currency?: string | null
  paid_at?: string | null
  status?: string | null
  created_at?: string | null
}
