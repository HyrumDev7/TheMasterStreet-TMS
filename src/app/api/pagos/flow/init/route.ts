import { NextResponse } from 'next/server'
import { createPayment } from '@/lib/payments/flow'
import { createServerClient } from '@/lib/supabase/server'

/**
 * POST /api/pagos/flow/init
 * Inicializa un pago con Flow
 * Body: { ordenId: string }
 */
export async function POST(request: Request) {
  try {
    const { ordenId } = await request.json()

    if (!ordenId) {
      return NextResponse.json(
        { error: 'ID de orden requerido' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Obtener orden
    const { data: orden, error: ordenError } = await supabase
      .from('ordenes_compra')
      .select('*')
      .eq('id', ordenId)
      .single()

    if (ordenError || !orden) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la orden esté en estado pending
    if (orden.estado !== 'pending') {
      return NextResponse.json(
        { error: 'Esta orden ya fue procesada' },
        { status: 400 }
      )
    }

    // Crear pago en Flow
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const payment = await createPayment({
      amount: Math.round(orden.total), // Flow requiere enteros
      commerceOrder: orden.id,
      email: orden.email_comprador,
      subject: `Entradas Master Street - Orden ${orden.id.slice(0, 8)}`,
      urlConfirmation: `${appUrl}/api/pagos/flow/confirm`,
      urlReturn: `${appUrl}/ordenes/${orden.id}/confirmacion`,
    })

    // Actualizar orden con token de Flow
    const { error: updateError } = await supabase
      .from('ordenes_compra')
      .update({
        transaction_id: payment.token,
        metodo_pago: 'flow',
      })
      .eq('id', ordenId)

    if (updateError) {
      console.error('Error al actualizar orden:', updateError)
      // No fallar, el pago ya se creó en Flow
    }

    return NextResponse.json({
      url: `${payment.url}?token=${payment.token}`,
      token: payment.token,
    })
  } catch (error: any) {
    console.error('Error al inicializar pago:', error)
    return NextResponse.json(
      {
        error: error.message || 'Error al inicializar el pago',
      },
      { status: 500 }
    )
  }
}
