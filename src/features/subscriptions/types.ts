export type Subscription = {
  id: string
  user_id: string
  plan_name: string
  max_apartments: number
  max_airbnbs: number
  max_rentals: number
  amount_paid: number
  payment_reference: string
  payment_method?: string | null
  status?: string | null
  created_at?: string | null
  ends_at?: string | null
  last_payment_at?: string | null
  creator_id: string
  subscriber_name?: string | null
}
