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

type UpdateSubscriptionPayload = {
  id: string
  status?: string | null
  ends_at?: string | null
}

export const updateSubscription = async (payload: UpdateSubscriptionPayload): Promise<Subscription> => {
  const { data, error } = await supabaseClient
    .from('subscriptions')
    .update({
      status: payload.status,
      ends_at: payload.ends_at,
    })
    .eq('id', payload.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Subscription
}
