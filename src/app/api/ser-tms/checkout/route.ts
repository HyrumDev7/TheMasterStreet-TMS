import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin'; // ajusta el path
import { createPayment } from '@/lib/payments/flow';
import { SER_TMS_PRECIO_CLP } from '@/lib/utils/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, ...datosTms } = body;

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
        ser_tms_datos: datosTms,
      })
      .select()
      .single();

    if (error || !orden) {
      console.error('Error creando orden:', error);
      return NextResponse.json({ error: 'Error creando orden' }, { status: 500 });
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
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}