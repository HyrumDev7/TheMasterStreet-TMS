import { NextResponse } from 'next/server'
import { getContentEditor } from '@/lib/cms/roles'
import { createAdminClient } from '@/lib/supabase/admin'
import { isCmsPanelId } from '@/lib/cms/panels'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const panelId = searchParams.get('panel')
    const admin = createAdminClient()
    let query = admin.from('panel_media').select('*').order('orden', { ascending: true })
    if (panelId) {
      query = query.eq('panel_id', panelId)
    }
    const { data, error } = await query
    if (error) {
      console.error(error)
      return NextResponse.json({ items: [] })
    }
    return NextResponse.json({ items: data || [] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(request: Request) {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const body = await request.json()
    const panelId = String(body.panel_id || '')
    if (!isCmsPanelId(panelId) || !body.url) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('panel_media')
      .insert({
        panel_id: panelId,
        url: String(body.url),
        pos_x: Number(body.pos_x ?? 10),
        pos_y: Number(body.pos_y ?? 10),
        ancho: Number(body.ancho ?? 80),
        alto: Number(body.alto ?? 50),
        rotacion: Number(body.rotacion ?? 0),
        orden: Number(body.orden ?? 0),
      })
      .select('*')
      .single()
    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'No se pudo agregar la imagen' }, { status: 500 })
    }
    return NextResponse.json({ item: data }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const body = await request.json()
    const items = Array.isArray(body.items) ? body.items : []
    const admin = createAdminClient()
    for (const item of items) {
      if (!item.id) continue
      const { error } = await admin
        .from('panel_media')
        .update({
          pos_x: Number(item.pos_x),
          pos_y: Number(item.pos_y),
          ancho: Number(item.ancho),
          alto: Number(item.alto),
          rotacion: Number(item.rotacion ?? 0),
          orden: Number(item.orden ?? 0),
        })
        .eq('id', item.id)
      if (error) {
        console.error(error)
        return NextResponse.json({ error: 'No se pudo guardar el diseño' }, { status: 500 })
      }
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Falta id' }, { status: 400 })
    }
    const admin = createAdminClient()
    const { error } = await admin.from('panel_media').delete().eq('id', id)
    if (error) {
      return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
