import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './cors.tsx'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export async function getUserProfile(userId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Get profile with pharmacy info using service role to bypass RLS
    const { data, error } = await supabase
      .from('profils')
      .select(`
        id,
        user_id,
        pharmacy_id,
        nom,
        telephone,
        role_id,
        pharmacies!inner(
          id,
          nom,
          ville,
          pays,
          adresse,
          telephone
        )
      `)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Database error fetching profile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    throw error
  }
}
