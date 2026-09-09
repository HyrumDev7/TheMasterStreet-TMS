import { NextResponse } from 'next/server'
import { getContentEditor } from '@/lib/cms/roles'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === '1'
    const admin = createAdminClient()
    let query = admin.from('noticias').select('*').order('created_at', { ascending: false })
    if (all) {
      const editor = await getContentEditor()
      if (!editor) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }
    } else {
      query = query.eq('publicado', true)
    }
    const { data, error } = await query
    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Error al listar noticias' }, { status: 500 })
    }
    return NextResponse.json({ noticias: data || [] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const body = await request.json()
    const titulo = String(body.titulo || '').trim()
    const cuerpo = String(body.cuerpo || '')
    if (!titulo) {
      return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })
    }
    const admin = createAdminClient()
    const { data: existing } = await admin.from('noticias').select('slug')
    const slug = generateUniqueSlug(
      slugify(String(body.slug || titulo)) || `noticia-${Date.now()}`,
      (existing || []).map((row: { slug: string }) => row.slug)
    )
    const { data, error } = await admin
      .from('noticias')
      .insert({
        titulo,
        slug,
        extracto: String(body.extracto || '').slice(0, 500),
        cuerpo,
        imagen_url: body.imagen_url || null,
        imagen_x: Number(body.imagen_x ?? 50),
        imagen_y: Number(body.imagen_y ?? 50),
        imagen_escala: Number(body.imagen_escala ?? 100),
        publicado: body.publicado !== false,
        updated_by: editor.profile.id,
      })
      .select('*')
      .single()
    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'No se pudo crear la noticia' }, { status: 500 })
    }
    return NextResponse.json({ noticia: data }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
