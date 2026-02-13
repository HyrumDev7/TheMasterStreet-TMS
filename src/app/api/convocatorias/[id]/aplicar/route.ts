import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { aplicarConvocatoriaSchema } from '@/lib/validations/aplicaciones'
import { z } from 'zod'
import { STORAGE_BUCKETS, MAX_VIDEO_SIZE_MB } from '@/lib/utils/constants'

/**
 * POST /api/convocatorias/[id]/aplicar
 * Aplica a una convocatoria (requiere autenticación)
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para aplicar' },
        { status: 401 }
      )
    }
    
    // Verificar que la convocatoria existe y está abierta
    const { data: convocatoria, error: convError } = await supabase
      .from('convocatorias')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (convError || !convocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      )
    }
    
    if (convocatoria.estado !== 'open') {
      return NextResponse.json(
        { error: 'Esta convocatoria no está abierta para aplicaciones' },
        { status: 400 }
      )
    }
    
    // Verificar fecha de cierre
    const fechaCierre = new Date(convocatoria.fecha_cierre)
    if (fechaCierre < new Date()) {
      return NextResponse.json(
        { error: 'El plazo para aplicar a esta convocatoria ha expirado' },
        { status: 400 }
      )
    }
    
    // Verificar que no haya aplicado antes
    const { data: existingApplication } = await supabase
      .from('aplicaciones')
      .select('id')
      .eq('convocatoria_id', params.id)
      .eq('usuario_id', user.id)
      .single()
    
    if (existingApplication) {
      return NextResponse.json(
        { error: 'Ya aplicaste a esta convocatoria' },
        { status: 400 }
      )
    }
    
    // Verificar límite de participantes
    if (convocatoria.maximo_participantes) {
      const { count } = await supabase
        .from('aplicaciones')
        .select('*', { count: 'exact', head: true })
        .eq('convocatoria_id', params.id)
        .eq('estado', 'accepted')
      
      if ((count || 0) >= convocatoria.maximo_participantes) {
        return NextResponse.json(
          { error: 'Esta convocatoria ha alcanzado el máximo de participantes' },
          { status: 400 }
        )
      }
    }
    
    // Procesar FormData (para upload de video)
    const formData = await request.formData()
    const videoFile = formData.get('video') as File | null
    const mensajeMotivacion = formData.get('mensaje_motivacion') as string | null
    const experiencia = formData.get('experiencia') as string | null
    
    if (!videoFile) {
      return NextResponse.json(
        { error: 'El video de audición es requerido' },
        { status: 400 }
      )
    }
    
    // Validar tamaño del video
    const fileSizeMB = videoFile.size / (1024 * 1024)
    if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
      return NextResponse.json(
        { error: `El video no puede pesar más de ${MAX_VIDEO_SIZE_MB}MB` },
        { status: 400 }
      )
    }
    
    // Subir video a Supabase Storage
    const videoFileName = `${user.id}/${params.id}/${Date.now()}_${videoFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.VIDEOS)
      .upload(videoFileName, videoFile, {
        cacheControl: '3600',
        upsert: false,
      })
    
    if (uploadError) {
      console.error('Error al subir video:', uploadError)
      return NextResponse.json(
        { error: 'Error al subir el video. Intenta nuevamente.' },
        { status: 500 }
      )
    }
    
    // Obtener URL pública del video
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKETS.VIDEOS).getPublicUrl(videoFileName)
    
    // Obtener redes sociales del perfil del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('instagram, youtube, spotify')
      .eq('id', user.id)
      .single()
    
    const redesSociales = profile
      ? {
          instagram: profile.instagram || undefined,
          youtube: profile.youtube || undefined,
          spotify: profile.spotify || undefined,
        }
      : undefined
    
    // Crear aplicación
    const { data: aplicacion, error: appError } = await supabase
      .from('aplicaciones')
      .insert({
        convocatoria_id: params.id,
        usuario_id: user.id,
        video_audicion_url: publicUrl,
        mensaje_motivacion: mensajeMotivacion || undefined,
        experiencia: experiencia || undefined,
        redes_sociales: redesSociales,
        estado: 'pending',
      })
      .select()
      .single()
    
    if (appError) {
      // Si falla, intentar eliminar el video subido
      await supabase.storage
        .from(STORAGE_BUCKETS.VIDEOS)
        .remove([videoFileName])
      
      console.error('Error al crear aplicación:', appError)
      return NextResponse.json(
        { error: 'Error al crear la aplicación' },
        { status: 500 }
      )
    }
    
    // TODO: Enviar email de confirmación
    
    return NextResponse.json(
      {
        message: 'Aplicación enviada exitosamente',
        aplicacion,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/convocatorias/[id]/aplicar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
