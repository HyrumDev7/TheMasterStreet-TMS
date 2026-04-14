import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/ser-tms/orden-estado?ordenId=
 * Estado de pago para la pantalla de retorno (solo orden SÉ TMS).
 */
export async function GET(request: Request) {
  const ordenId = new URL(request.url).searchParams.get('ordenId')
  if (!ordenId) {
    return NextResponse.json({ error: 'ordenId requerido' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('ordenes_compra')
    .select('estado, tipo')
    .eq('id', ordenId)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ estado: null }, { status: 404 })
  }

  if (data.tipo !== 'ser_tms') {
    return NextResponse.json({ error: 'Orden no válida' }, { status: 400 })
  }

  return NextResponse.json({ estado: data.estado })
}
