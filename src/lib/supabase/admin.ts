import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase con la service role (solo en el servidor).
 * Omite Row Level Security; usar únicamente en API Routes o Server Actions de confianza.
 * Tipado relajado: el esquema completo no está en `Database` (regenerar con `supabase gen types`).
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY para el cliente admin.'
    )
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
