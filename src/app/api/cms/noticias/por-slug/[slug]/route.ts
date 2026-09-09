import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('noticias')
      .select('*')
      .eq('slug', params.slug)
      .eq('publicado', true)
      .maybeSingle()
    if (error || !data) {
      return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    }
    return NextResponse.json({ noticia: data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
