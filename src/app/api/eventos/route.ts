import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { eventoSchema } from '@/lib/validations/eventos'
import { z } from 'zod'

/**
 * GET /api/eventos
 * Obtiene la lista de eventos publicados
 * Query params: tipo, destacados, limit, offset
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const destacados = searchParams.get('destacados')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    
    const supabase = createServerClient()
    
    // Construir query base
    let query = supabase
      .from('eventos')
      .select('*')
      .eq('estado', 'published')
      .gte('fecha_inicio', new Date().toISOString())
      .order('fecha_inicio', { ascending: true })
    
    // Filtrar por tipo si se proporciona
    if (tipo) {
      query = query.eq('tipo', tipo)
    }
    
    // Filtrar destacados si se solicita
    if (destacados === 'true') {
      query = query.eq('destacado', true)
    }
    
    // Aplicar paginación
    if (limit) {
      const limitNum = parseInt(limit, 10)
      query = query.limit(limitNum)
      
      if (offset) {
        const offsetNum = parseInt(offset, 10)
        query = query.range(offsetNum, offsetNum + limitNum - 1)
      }
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error al obtener eventos:', error)
      return NextResponse.json(
        { error: 'Error al obtener eventos' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      eventos: data || [],
      total: data?.length || 0,
    })
  } catch (error) {
    console.error('Error en GET /api/eventos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/eventos
 * Crea un nuevo evento (requiere autenticación y rol admin)
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
    
    // Verificar que el usuario sea admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single()
    
    if (profile?.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador.' },
        { status: 403 }
      )
    }
    
    // Validar datos del evento
    const body = await request.json()
    const validatedData = eventoSchema.parse(body)
    
    // Generar slug si no se proporciona
    const slug = validatedData.slug || validatedData.titulo.toLowerCase().replace(/\s+/g, '-')
    
    // Verificar que el slug sea único
    const { data: existingEvent } = await supabase
      .from('eventos')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (existingEvent) {
      return NextResponse.json(
        { error: 'Ya existe un evento con ese slug' },
        { status: 400 }
      )
    }
    
    // Crear evento
    const { data: evento, error: createError } = await supabase
      .from('eventos')
      .insert({
        ...validatedData,
        slug,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (createError) {
      console.error('Error al crear evento:', createError)
      return NextResponse.json(
        { error: 'Error al crear el evento' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      {
        message: 'Evento creado exitosamente',
        evento,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    console.error('Error en POST /api/eventos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
