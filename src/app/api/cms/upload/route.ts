import { NextResponse } from 'next/server'
import { getContentEditor } from '@/lib/cms/roles'
import { createAdminClient } from '@/lib/supabase/admin'
import { STORAGE_BUCKETS, MAX_IMAGE_SIZE_MB, ALLOWED_IMAGE_FORMATS } from '@/lib/utils/constants'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const editor = await getContentEditor()
    if (!editor) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No hay archivo' }, { status: 400 })
    }
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_IMAGE_FORMATS.includes(ext)) {
      return NextResponse.json({ error: 'Formato no permitido' }, { status: 400 })
    }
    if (file.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) {
      return NextResponse.json({ error: `Máximo ${MAX_IMAGE_SIZE_MB}MB` }, { status: 400 })
    }
    const path = `cms/${editor.profile.id}/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`
    const admin = createAdminClient()
    const { error: uploadError } = await admin.storage.from(STORAGE_BUCKETS.IMAGES).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadError) {
      console.error(uploadError)
      return NextResponse.json({ error: 'Error al subir' }, { status: 500 })
    }
    const {
      data: { publicUrl },
    } = admin.storage.from(STORAGE_BUCKETS.IMAGES).getPublicUrl(path)
    return NextResponse.json({ url: publicUrl, path })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
