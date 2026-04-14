import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getPaymentStatus,
  flowStatusToOrderEstado,
} from '@/lib/payments/flow'
import { parseFlowConfirmationToken } from '@/lib/payments/flowConfirmation'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateQRCode } from '@/lib/qr/generator'
import { insertSerTmsIfPaid } from '@/lib/ser-tms/completeInscription'

type OrdenRow = {
  id: string
  tipo: string | null
  ser_tms_datos: unknown
  email_comprador: string
  total: number
  transaction_id: string | null
}

/**
 * POST /api/pagos/flow/confirm
 * Webhook urlConfirmation: Flow envía el token (POST urlencoded); hay que llamar payment/getStatus.
 * Responder HTTP 200 en menos de 15 s (recomendado entre 1 y 10 s).
 *
 * @see https://developers.flow.cl/docs/tutorial-basics/order-confirmation
 */
export async function POST(request: Request) {
  try {
    const token = await parseFlowConfirmationToken(request)

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    const paymentStatus = await getPaymentStatus(token)
    const supabase = createAdminClient()

    const { data: orden, error: ordenError } = await supabase
      .from('ordenes_compra')
      .select('*')
      .eq('transaction_id', token)
      .single()

    if (ordenError || !orden) {
      console.error('Orden no encontrada para token:', token)
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    const ordenRow = orden as OrdenRow

    const commerceOrder = String(paymentStatus.commerceOrder ?? '').trim()
    if (
      !commerceOrder ||
      commerceOrder.toLowerCase() !== String(ordenRow.id).toLowerCase()
    ) {
      console.error(
        'commerceOrder no coincide con la orden:',
        commerceOrder,
        ordenRow.id
      )
      return NextResponse.json(
        { error: 'La orden del pago no coincide' },
        { status: 400 }
      )
    }

    if (paymentStatus.amount !== Math.round(Number(ordenRow.total))) {
      console.error('Monto no coincide:', paymentStatus.amount, ordenRow.total)
      return NextResponse.json({ error: 'Monto no coincide' }, { status: 400 })
    }

    const nuevoEstado = flowStatusToOrderEstado(paymentStatus.status)

    const { error: updateError } = await supabase
      .from('ordenes_compra')
      .update({ estado: nuevoEstado })
      .eq('id', ordenRow.id)

    if (updateError) {
      console.error('Error al actualizar orden:', updateError)
      return NextResponse.json({ error: 'Error al actualizar orden' }, { status: 500 })
    }

    if (nuevoEstado === 'paid') {
      await procesarPostPagoFlow(supabase, ordenRow, token)
    }

    return NextResponse.json({
      success: true,
      ordenId: ordenRow.id,
      estado: nuevoEstado,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error al confirmar el pago'
    console.error('Error al confirmar pago:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

async function procesarPostPagoFlow(
  supabase: SupabaseClient,
  orden: OrdenRow,
  token: string
) {
  if (orden.tipo === 'ser_tms' && orden.ser_tms_datos) {
    await insertSerTmsIfPaid(supabase, { ...orden, metodo_pago: 'flow' }, token)
    return
  }

  const { data: entradas, error: entradasError } = await supabase
    .from('entradas')
    .select('*')
    .eq('orden_id', orden.id)

  if (entradasError || !entradas?.length) return

  for (const entrada of entradas) {
    if (entrada.codigo_qr) continue
    const qrCode = await generateQRCode(entrada.id)
    await supabase.from('entradas').update({ codigo_qr: qrCode }).eq('id', entrada.id)
  }
}
