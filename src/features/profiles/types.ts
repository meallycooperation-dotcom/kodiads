export type Profile = {
  id: string
  full_name?: string | null
  email?: string | null
  phone_number?: string | null
  role: 'admin' | 'user' | string
  created_at?: string | null
}
