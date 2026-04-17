import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPaymentStatus } from '@/lib/payments/flow';
import { insertSerTmsIfPaid } from '@/lib/ser-tms/insertSerTms'; // tu lógica de negocio

// Flow envía un POST con application/x-www-form-urlencoded
export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const token = params.get('token');

    if (!token) {
      return new NextResponse('token missing', { status: 400 });
    }

    // 1. Obtener estado real desde Flow
    const status = await getPaymentStatus(token);

    const supabase = createAdminClient();

    // 2. Buscar orden por transaction_id = token
    const { data: orden, error } = await supabase
      .from('ordenes_compra')
      .select('*')
      .eq('transaction_id', token)
      .single();

    if (error || !orden) {
      console.error('Orden no encontrada para token:', token);
      return new NextResponse('orden not found', { status: 404 });
    }

    // 3. Validaciones de seguridad
    if (status.commerceOrder !== orden.id) {
      console.error('commerceOrder no coincide');
      return new NextResponse('validation error', { status: 400 });
    }
    if (Number(status.amount) !== Number(orden.total)) {
      console.error('Monto no coincide:', status.amount, '!=', orden.total);
      return new NextResponse('amount mismatch', { status: 400 });
    }

    // 4. Mapear estado Flow → estado de la orden
    // status.status: 1=pendiente, 2=pagado, 3=rechazado, 4=anulado
    const estadoMap: Record<number, string> = {
      1: 'pending',
      2: 'paid',
      3: 'rejected',
      4: 'cancelled',
    };
    const nuevoEstado = estadoMap[status.status] ?? 'unknown';

    await supabase
      .from('ordenes_compra')
      .update({ estado: nuevoEstado })
      .eq('id', orden.id);

    // 5. Lógica SÉ TMS si quedó pagado
    if (nuevoEstado === 'paid') {
      await insertSerTmsIfPaid(orden);
    }

    // Flow espera HTTP 200 para confirmar recepción del webhook
    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error('Confirm webhook error:', err);
    return new NextResponse('internal error', { status: 500 });
  }
}