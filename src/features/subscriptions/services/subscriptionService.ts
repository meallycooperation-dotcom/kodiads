import { supabaseClient } from '../../../lib/supabaseClient'
import type { Subscription } from '../types'

type SupabaseSubscription = Subscription & {
  profiles?: { full_name?: string | null } | null
}

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const { data, error } = await supabaseClient
    .from('subscriptions')
    .select('*, profiles!inner(id,full_name)')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (
    (data ?? []).map((item) => ({
      ...item,
      subscriber_name: item.profiles?.full_name ?? null,
    })) as Subscription[]
  )
}
