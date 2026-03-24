/**
 * Elimina filas de prueba marcadas con prefijo TEST_TMS_ en Supabase.
 * Requiere SUPABASE_SERVICE_ROLE_KEY.
 *
 * Uso (Node 20+):
 *   npm run test:cleanup-db
 */

import { createClient } from '@supabase/supabase-js'

const PREFIX = 'TEST_TMS_'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.log(
    '[cleanup-test-data] Omitido: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local'
  )
  process.exit(0)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function deleteByPrefix(table, column) {
  const { data: rows, error: selErr } = await supabase
    .from(table)
    .select('id')
    .like(column, `${PREFIX}%`)

  if (selErr) {
    console.error(`[cleanup] select ${table}:`, selErr.message)
    return 0
  }
  if (!rows?.length) return 0

  const ids = rows.map((r) => r.id)
  const { error: delErr } = await supabase.from(table).delete().in('id', ids)
  if (delErr) {
    console.error(`[cleanup] delete ${table}:`, delErr.message)
    return 0
  }
  return ids.length
}

const n1 = await deleteByPrefix('inscripciones_organizacion', 'nombre_organizacion')
const n2 = await deleteByPrefix('ser_tms_postulaciones', 'nombre')

console.log(
  `[cleanup-test-data] Eliminadas ${n1} fila(s) inscripciones_organizacion y ${n2} fila(s) ser_tms_postulaciones (${PREFIX}*)`
)
