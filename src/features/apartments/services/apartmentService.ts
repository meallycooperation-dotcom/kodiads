import { supabaseClient } from '../../../lib/supabaseClient'
import type { Apartment } from '../types'

export const fetchApartments = async (): Promise<Apartment[]> => {
  const { data, error } = await supabaseClient
    .from('apartments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}
