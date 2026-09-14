import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { areFlowPaymentsEnabled, createPayment } from '@/lib/payments/flow'
import { isAxiosError } from 'axios'
import { SER_TMS_PRECIO_CLP } from '@/lib/utils/constants'

const FLOW_STANDBY = {
  error: 'Los pagos con Flow están en pausa. La inscripción SÉ TMS se reactivará pronto.',
}

export async function POST(req: NextRequest) {
  try {
    if (!areFlowPaymentsEnabled()) {
      return NextResponse.json(FLOW_STANDBY, { status: 503 })
    }

    const body = await req.json();
    const { email, ...datosTms } = body;
    const { nombre, apellidos, rut } = body;

    const supabase = createAdminClient();
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, '');

    // 1. Crear orden en Supabase
    const { data: orden, error } = await supabase
      .from('ordenes_compra')
      .insert({
        tipo: 'ser_tms',
        estado: 'pending',
        total: SER_TMS_PRECIO_CLP,
        email_comprador: email,
        nombre_comprador: `${nombre} ${apellidos}`.trim(),
        rut_comprador: rut,
        ser_tms_datos: datosTms,
      })
      .select()
      .single();

    if (error || !orden) {
      console.error('Error creando orden:', error)
      const ordenMsg = error?.message ? `: ${error.message}` : ''
      return NextResponse.json(
        {
          error: `Error creando orden${ordenMsg}`,
          details: error?.details ?? null,
          hint: error?.hint ?? null,
          code: error?.code ?? null,
        },
        { status: 500 }
      )
    }

    // 2. Crear pago en Flow
    const payment = await createPayment({
      amount: SER_TMS_PRECIO_CLP,
      commerceOrder: orden.id, // UUID de la orden
      email,
      subject: 'SÉ TMS - Inscripción',
      urlConfirmation: `${APP_URL}/api/pagos/flow/confirm`,
      urlReturn: `${APP_URL}/ser-tms/pago/exito?ordenId=${orden.id}`,
    });

    // 3. Guardar token de Flow en la orden
    await supabase
      .from('ordenes_compra')
      .update({ transaction_id: payment.token })
      .eq('id', orden.id);

    // 4. Devolver URL de redireccionamiento al front
    return NextResponse.json({
      redirectUrl: `${payment.url}?token=${payment.token}`,
    });
  } catch (err) {
    console.error('Checkout error:', err);
    if (isAxiosError(err)) {
      const flowMsg =
        err.response?.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
          ? String((err.response.data as { message?: unknown }).message)
          : err.message;
      return NextResponse.json(
        { error: 'Flow rechazó o no respondió la creación del pago', flowMessage: flowMsg },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
