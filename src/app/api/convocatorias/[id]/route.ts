import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/convocatorias/[id]
 * Obtiene una convocatoria específica por ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data: convocatoria, error } = await supabase
      .from('convocatorias')
      .select(`
        *,
        eventos (
          id,
          titulo,
          slug,
          fecha_inicio,
          lugar,
          ciudad
        )
      `)
      .eq('id', params.id)
      .single()
    
    if (error || !convocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      )
    }
    
    // Obtener número de aplicaciones recibidas
    const { count } = await supabase
      .from('aplicaciones')
      .select('*', { count: 'exact', head: true })
      .eq('convocatoria_id', params.id)
    
    return NextResponse.json({
      convocatoria: {
        ...convocatoria,
        aplicaciones_recibidas: count || 0,
      },
    })
  } catch (error) {
    console.error('Error en GET /api/convocatorias/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
