import { NextResponse } from 'next/server'
import { getContentEditor } from '@/lib/cms/roles'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify'

export const dynamic = 'force-dynamic'

type Ctx = { params: { id: string } }

export async function GET(_request: Request, { params }: Ctx) {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.from('noticias').select('*').eq('id', params.id).maybeSingle()
    if (error || !data) {
      return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    }
    if (!data.publicado) {
      const editor = await getContentEditor()
      if (!editor) {
        return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
      }
    }
    return NextResponse.json({ noticia: data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const body = await request.json()
    const admin = createAdminClient()
    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updated_by: editor.profile.id,
    }
    if (body.titulo != null) patch.titulo = String(body.titulo).trim()
    if (body.extracto != null) patch.extracto = String(body.extracto).slice(0, 500)
    if (body.cuerpo != null) patch.cuerpo = String(body.cuerpo)
    if (body.imagen_url !== undefined) patch.imagen_url = body.imagen_url || null
    if (body.imagen_x != null) patch.imagen_x = Number(body.imagen_x)
    if (body.imagen_y != null) patch.imagen_y = Number(body.imagen_y)
    if (body.imagen_escala != null) patch.imagen_escala = Number(body.imagen_escala)
    if (body.publicado != null) patch.publicado = Boolean(body.publicado)
    if (body.slug != null || body.titulo) {
      const { data: existing } = await admin.from('noticias').select('id, slug')
      const base = slugify(String(body.slug || body.titulo || '')) || `noticia-${Date.now()}`
      patch.slug = generateUniqueSlug(
        base,
        (existing || [])
          .filter((row: { id: string }) => row.id !== params.id)
          .map((row: { slug: string }) => row.slug)
      )
    }
    const { data, error } = await admin.from('noticias').update(patch).eq('id', params.id).select('*').single()
    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })
    }
    return NextResponse.json({ noticia: data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const admin = createAdminClient()
    const { error } = await admin.from('noticias').delete().eq('id', params.id)
    if (error) {
      return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
