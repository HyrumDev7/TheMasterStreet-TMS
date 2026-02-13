import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { STORAGE_BUCKETS, MAX_VIDEO_SIZE_MB, ALLOWED_VIDEO_FORMATS } from '@/lib/utils/constants'

/**
 * POST /api/upload/video
 * Sube un video a Supabase Storage
 * Requiere autenticación
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener archivo del FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !ALLOWED_VIDEO_FORMATS.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: `Formato no permitido. Formatos permitidos: ${ALLOWED_VIDEO_FORMATS.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
      return NextResponse.json(
        {
          error: `El archivo es demasiado grande. Tamaño máximo: ${MAX_VIDEO_SIZE_MB}MB`,
        },
        { status: 400 }
      )
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = `${user.id}/${timestamp}_${randomString}.${fileExtension}`

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.VIDEOS)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error al subir video:', uploadError)
      return NextResponse.json(
        { error: 'Error al subir el archivo' },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKETS.VIDEOS).getPublicUrl(fileName)

    return NextResponse.json({
      message: 'Video subido exitosamente',
      url: publicUrl,
      fileName: uploadData.path,
      size: file.size,
    })
  } catch (error) {
    console.error('Error en POST /api/upload/video:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
