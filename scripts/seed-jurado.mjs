/**
 * Seed: crea los 3 usuarios jurado en Supabase Auth y sus perfiles en public.profiles.
 *
 * La contraseña de los tres usuarios es la misma: JURADO_PASSWORD (misma que en Vercel / .env.local).
 *
 * Uso (desde la raíz del proyecto TMS):
 *   node --env-file=.env.local scripts/seed-jurado.mjs
 *
 * O:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... JURADO_PASSWORD=... node scripts/seed-jurado.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const JURADO_PASSWORD = process.env.JURADO_PASSWORD

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Uso:')
  console.error('  node --env-file=.env.local scripts/seed-jurado.mjs')
  process.exit(1)
}

if (!JURADO_PASSWORD) {
  console.error('Falta JURADO_PASSWORD (misma clave que valida /api/jurado/login).')
  process.exit(1)
}

const jurados = [
  { clasificatoria: 1, email: 'jurado.1@masterstreet.cl', nombre: 'Jurado Clasificatoria 1', rut: '11111111-1', alias: 'Jurado C1' },
  { clasificatoria: 2, email: 'jurado.2@masterstreet.cl', nombre: 'Jurado Clasificatoria 2', rut: '22222222-2', alias: 'Jurado C2' },
  { clasificatoria: 3, email: 'jurado.3@masterstreet.cl', nombre: 'Jurado Clasificatoria 3', rut: '33333333-3', alias: 'Jurado C3' },
]

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  for (const j of jurados) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: j.email,
      password: JURADO_PASSWORD,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message?.includes('already been registered') || authError.message?.includes('already exists')) {
        console.log(`Usuario ya existe: ${j.email} – omitido`)
      } else {
        console.error(`Error creando ${j.email}:`, authError.message)
      }
      continue
    }

    const userId = authData.user?.id
    if (!userId) {
      console.error(`No se obtuvo id de usuario para ${j.email}`)
      continue
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      nombre: j.nombre,
      rut: j.rut,
      alias: j.alias,
      email: j.email,
      rol: 'judge',
      estado: 'active',
    })

    if (profileError) {
      if (profileError.code === '23505') {
        console.log(`Perfil ya existe para ${j.email} – omitido`)
      } else {
        console.error(`Error creando perfil para ${j.email}:`, profileError.message)
      }
    } else {
      console.log(`Creado: ${j.email} (Clasificatoria ${j.clasificatoria})`)
    }
  }
  console.log('Seed jurado finalizado.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
