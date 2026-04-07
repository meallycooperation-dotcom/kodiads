import type { Apartment } from '../apartments/types'
import type { Subscription } from '../subscriptions/types'
import type { Transaction } from '../transactions/types'

export type DashboardSnapshot = {
  totalApartments: number
  totalSubscriptions: number
  totalTransactions: number
  recentApartments: Apartment[]
  recentSubscriptions: Subscription[]
  recentTransactions: Transaction[]
}
