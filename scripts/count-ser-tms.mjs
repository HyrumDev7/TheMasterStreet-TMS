/**
 * Cuenta inscripciones SÉ TMS (tabla ser_tms_postulaciones).
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
 *
 * Uso: node --env-file=.env.local scripts/count-ser-tms.mjs
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY (p. ej. en .env.local).'
  )
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { count, error } = await supabase
  .from('ser_tms_postulaciones')
  .select('*', { count: 'exact', head: true })

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

console.log(`Inscripciones SÉ TMS: ${count ?? 0}`)
