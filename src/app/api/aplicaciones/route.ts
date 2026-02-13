import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/aplicaciones
 * Obtiene las aplicaciones del usuario autenticado
 */
export async function GET(request: Request) {
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
    
    // Obtener aplicaciones del usuario
    const { data: aplicaciones, error } = await supabase
      .from('aplicaciones')
      .select(`
        *,
        convocatorias (
          id,
          titulo,
          fecha_cierre,
          estado,
          eventos (
            id,
            titulo,
            slug,
            fecha_inicio
          )
        )
      `)
      .eq('usuario_id', user.id)
      .order('fecha_aplicacion', { ascending: false })
    
    if (error) {
      console.error('Error al obtener aplicaciones:', error)
      return NextResponse.json(
        { error: 'Error al obtener aplicaciones' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      aplicaciones: aplicaciones || [],
      total: aplicaciones?.length || 0,
    })
  } catch (error) {
    console.error('Error en GET /api/aplicaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
