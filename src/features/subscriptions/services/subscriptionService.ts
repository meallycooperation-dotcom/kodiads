import { supabaseClient } from '../../../lib/supabaseClient'
import type { Subscription } from '../types'

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
