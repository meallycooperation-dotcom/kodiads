import { supabaseClient } from '../../../lib/supabaseClient'
import type { Transaction } from '../types'

type ProfileRef = {
  id: string
  full_name?: string | null
}

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  const transactions = data ?? []
  const userIds = Array.from(
    new Set(transactions.map((transaction) => transaction.user_id).filter(Boolean)),
  )

  const nameMap = new Map<string, string | null>()
  if (userIds.length > 0) {
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id,full_name')
      .in('id', userIds)

    if (profileError) {
      throw profileError
    }

    ;(profileData ?? []).forEach((profile) => {
      nameMap.set(profile.id, profile.full_name ?? null)
    })
  }

  return transactions.map((item) => ({
    ...item,
    user_name: nameMap.get(item.user_id) ?? null,
  }))
}
