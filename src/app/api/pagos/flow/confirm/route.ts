import { NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/payments/flow'
import { createServerClient } from '@/lib/supabase/server'
import { generateQRCode } from '@/lib/qr/generator'

/**
 * POST /api/pagos/flow/confirm
 * Webhook de confirmación de pago desde Flow
 * Flow llama a esta URL cuando se completa un pago
 */
export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }

    // Obtener estado del pago desde Flow
    const paymentStatus = await getPaymentStatus(token)

    const supabase = createServerClient()

    // Buscar orden por token
    const { data: orden, error: ordenError } = await supabase
      .from('ordenes_compra')
      .select('*')
      .eq('transaction_id', token)
      .single()

    if (ordenError || !orden) {
      console.error('Orden no encontrada para token:', token)
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que el monto coincida
    if (paymentStatus.amount !== Math.round(orden.total)) {
      console.error('Monto no coincide:', paymentStatus.amount, orden.total)
      return NextResponse.json(
        { error: 'Monto no coincide' },
        { status: 400 }
      )
    }

    // Determinar estado según respuesta de Flow
    // Flow status: 1 = Pagado, 2 = Rechazado, 3 = Anulado, 4 = Reembolsado
    let nuevoEstado: 'paid' | 'failed' | 'refunded' = 'failed'

    if (paymentStatus.status === 1) {
      nuevoEstado = 'paid'
    } else if (paymentStatus.status === 4) {
      nuevoEstado = 'refunded'
    }

    // Actualizar orden
    const { error: updateError } = await supabase
      .from('ordenes_compra')
      .update({
        estado: nuevoEstado,
      })
      .eq('id', orden.id)

    if (updateError) {
      console.error('Error al actualizar orden:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar orden' },
        { status: 500 }
      )
    }

    // Si el pago fue exitoso, generar entradas y códigos QR
    if (nuevoEstado === 'paid') {
      // Obtener entradas de la orden
      const { data: entradas, error: entradasError } = await supabase
        .from('entradas')
        .select('*')
        .eq('orden_id', orden.id)

      if (!entradasError && entradas) {
        // Generar códigos QR para cada entrada
        for (const entrada of entradas) {
          if (!entrada.codigo_qr) {
            const qrCode = await generateQRCode(entrada.id)
            
            await supabase
              .from('entradas')
              .update({ codigo_qr: qrCode })
              .eq('id', entrada.id)
          }
        }

        // TODO: Enviar email con entradas y QR codes
      }
    }

    return NextResponse.json({
      success: true,
      ordenId: orden.id,
      estado: nuevoEstado,
    })
  } catch (error: any) {
    console.error('Error al confirmar pago:', error)
    return NextResponse.json(
      {
        error: error.message || 'Error al confirmar el pago',
      },
      { status: 500 }
    )
  }
}
