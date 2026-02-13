import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/convocatorias
 * Obtiene la lista de convocatorias abiertas
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado') || 'open'
    
    const supabase = createServerClient()
    
    let query = supabase
      .from('convocatorias')
      .select(`
        *,
        eventos (
          id,
          titulo,
          slug,
          fecha_inicio,
          lugar
        )
      `)
      .eq('estado', estado)
      .order('fecha_apertura', { ascending: false })
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error al obtener convocatorias:', error)
      return NextResponse.json(
        { error: 'Error al obtener convocatorias' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      convocatorias: data || [],
      total: data?.length || 0,
    })
  } catch (error) {
    console.error('Error en GET /api/convocatorias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
