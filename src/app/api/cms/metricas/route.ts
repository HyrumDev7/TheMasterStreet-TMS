import { NextResponse } from 'next/server'
import { getContentEditor } from '@/lib/cms/roles'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const ruta = String(body.ruta || '/').slice(0, 300)
    if (ruta.startsWith('/admin') || ruta.startsWith('/api')) {
      return NextResponse.json({ ok: true })
    }
    const admin = createAdminClient()
    const dia = new Date().toISOString().slice(0, 10)
    const { data } = await admin
      .from('site_visit_days')
      .select('visitas')
      .eq('dia', dia)
      .eq('ruta', ruta)
      .maybeSingle()
    if (data) {
      await admin
        .from('site_visit_days')
        .update({ visitas: (data.visitas || 0) + 1 })
        .eq('dia', dia)
        .eq('ruta', ruta)
    } else {
      await admin.from('site_visit_days').insert({ dia, ruta, visitas: 1 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}

export async function GET() {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const admin = createAdminClient()
    const from = new Date()
    from.setUTCDate(from.getUTCDate() - 30)
    const { data, error } = await admin
      .from('site_visit_days')
      .select('*')
      .gte('dia', from.toISOString().slice(0, 10))
      .order('dia', { ascending: false })
    if (error) {
      return NextResponse.json({ error: 'Sin métricas aún', rows: [] }, { status: 200 })
    }
    const rows = data || []
    const total = rows.reduce((sum: number, row: { visitas: number }) => sum + (row.visitas || 0), 0)
    const byDay: Record<string, number> = {}
    const byPath: Record<string, number> = {}
    for (const row of rows) {
      byDay[row.dia] = (byDay[row.dia] || 0) + row.visitas
      byPath[row.ruta] = (byPath[row.ruta] || 0) + row.visitas
    }
    return NextResponse.json({ total, byDay, byPath, rows })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
