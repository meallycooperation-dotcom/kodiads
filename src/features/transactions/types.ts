export type Transaction = {
  id: string
  user_id: string
  payment_reference: string
  payment_method?: string | null
  amount: number
  currency?: string | null
  plan: string
  status?: string | null
  gateway_response?: string | null
  paid_at?: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string | null
  updated_at?: string | null
  user_name?: string | null
}
