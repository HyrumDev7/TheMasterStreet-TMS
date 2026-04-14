import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serTmsCheckoutSchema } from '@/lib/validations/serTms'
import { limpiarRut } from '@/lib/validations/rut'
import { createPayment } from '@/lib/payments/flow'
import { SER_TMS_PRECIO_CLP, APP_URL } from '@/lib/utils/constants'

/**
 * POST /api/ser-tms/checkout
 * Crea orden $1.500 CLP y devuelve URL de pago Flow.
 * @see https://developers.flow.cl/
 */
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = serTmsCheckoutSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const rutNormalizado = limpiarRut(data.rut)
    const supabase = createAdminClient()

    const { data: yaInscrito } = await supabase
      .from('ser_tms_postulaciones')
      .select('id')
      .eq('rut_normalizado', rutNormalizado)
      .maybeSingle()

    if (yaInscrito) {
      return NextResponse.json(
        { error: 'Ya existe una inscripción pagada con este RUT.' },
        { status: 400 }
      )
    }

    const payload = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      rut: data.rut,
      aka: data.aka,
      ciudadComuna: data.ciudadComuna,
      edad: data.edad,
      linkVideo: data.linkVideo,
    }

    const { data: orden, error: ordenErr } = await supabase
      .from('ordenes_compra')
      .insert({
        email_comprador: data.email,
        nombre_comprador: `${data.nombre} ${data.apellidos}`.slice(0, 200),
        rut_comprador: data.rut,
        total: SER_TMS_PRECIO_CLP,
        estado: 'pending',
        tipo: 'ser_tms',
        ser_tms_datos: payload,
        metodo_pago: 'flow',
      })
      .select('id')
      .single()

    if (ordenErr || !orden) {
      console.error('ser-tms checkout orden:', ordenErr)
      return NextResponse.json(
        { error: 'No se pudo crear la orden de pago. Revisa la tabla ordenes_compra (columnas tipo, ser_tms_datos).' },
        { status: 500 }
      )
    }

    const ordenId = orden.id
    const appUrl = APP_URL.replace(/\/$/, '')
    const returnUserUrl = `${appUrl}/ser-tms/pago/exito?ordenId=${ordenId}`

    try {
      const payment = await createPayment({
        amount: SER_TMS_PRECIO_CLP,
        commerceOrder: ordenId,
        email: data.email,
        subject: `Inscripción SÉ TMS — ${ordenId.slice(0, 8)}`,
        urlConfirmation: `${appUrl}/api/pagos/flow/confirm`,
        urlReturn: returnUserUrl,
      })

      await supabase
        .from('ordenes_compra')
        .update({
          transaction_id: payment.token,
          metodo_pago: 'flow',
        })
        .eq('id', ordenId)

      return NextResponse.json({
        redirectUrl: `${payment.url}?token=${payment.token}`,
        ordenId,
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al iniciar Flow'
      console.error('Flow ser-tms:', e)
      return NextResponse.json({ error: msg }, { status: 500 })
    }
  } catch (err) {
    console.error('ser-tms checkout:', err)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 400 })
  }
}
