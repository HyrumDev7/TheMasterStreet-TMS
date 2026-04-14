import type { SupabaseClient } from '@supabase/supabase-js'
import { limpiarRut } from '@/lib/validations/rut'
import { serTmsPayloadSchema } from '@/lib/validations/serTms'
type OrdenRow = {
  id: string
  tipo: string | null
  /** JSON desde Supabase; se valida con serTmsPayloadSchema */
  ser_tms_datos: unknown
  email_comprador: string
  total: number
  transaction_id: string | null
  metodo_pago: string | null
}

/**
 * Tras pago aprobado: inserta postulación SÉ TMS desde payload de la orden (idempotente por RUT).
 */
export async function insertSerTmsIfPaid(
  supabase: SupabaseClient,
  orden: OrdenRow,
  idTransaccion: string
): Promise<{ ok: true; skipped?: string } | { ok: false; error: string }> {
  if (orden.tipo !== 'ser_tms' || !orden.ser_tms_datos) {
    return { ok: true, skipped: 'not_ser_tms' }
  }

  const parsed = serTmsPayloadSchema.safeParse(orden.ser_tms_datos)
  if (!parsed.success) {
    console.error('ser_tms_datos inválidos', parsed.error)
    return { ok: false, error: 'Payload de postulación inválido' }
  }
  const d = parsed.data
  const rutNormalizado = limpiarRut(d.rut)

  const { data: ya } = await supabase
    .from('ser_tms_postulaciones')
    .select('id')
    .eq('rut_normalizado', rutNormalizado)
    .maybeSingle()

  if (ya) {
    return { ok: true, skipped: 'already_registered' }
  }

  const { error } = await supabase.from('ser_tms_postulaciones').insert({
    nombre: d.nombre,
    apellidos: d.apellidos,
    rut: d.rut,
    rut_normalizado: rutNormalizado,
    aka: d.aka,
    ciudad_comuna: d.ciudadComuna,
    edad: d.edad,
    link_video: d.linkVideo,
    email: orden.email_comprador,
    orden_id: orden.id,
    pago_estado: 'paid',
    metodo_pago: orden.metodo_pago ?? 'unknown',
    id_transaccion: idTransaccion,
    comprobante_url: null,
  })

  if (error) {
    if (error.code === '23505') {
      return { ok: true, skipped: 'duplicate_rut' }
    }
    console.error('insertSerTmsIfPaid:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
