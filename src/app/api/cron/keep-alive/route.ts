import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/keep-alive?key=TU_CRON_SECRET
 *
 * Llama a Supabase (una lectura mínima) para que el proyecto no se considere
 * inactivo y no se pause. Usar con un cron externo cada 5–6 días.
 * Sin la key correcta responde 401.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const secret = process.env.CRON_SECRET

  if (!secret || key !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServerClient()
    await supabase.from('profiles').select('id').limit(1).maybeSingle()
    return NextResponse.json({ ok: true, at: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Supabase ping failed' }, { status: 500 })
  }
}
