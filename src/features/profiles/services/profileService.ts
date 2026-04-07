import { supabaseClient } from '../../../lib/supabaseClient'
import type { Profile } from '../types'

export const fetchProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id,full_name,email,phone_number,role,created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}
