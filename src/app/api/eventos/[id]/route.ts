import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { eventoSchema } from '@/lib/validations/eventos'
import { z } from 'zod'

/**
 * GET /api/eventos/[id]
 * Obtiene un evento específico por ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data: evento, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error || !evento) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }
    
    // Solo permitir ver eventos publicados (a menos que sea admin)
    if (evento.estado !== 'published') {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('rol')
          .eq('id', user.id)
          .single()
        
        if (profile?.rol !== 'admin') {
          return NextResponse.json(
            { error: 'Evento no encontrado' },
            { status: 404 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Evento no encontrado' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json({ evento })
  } catch (error) {
    console.error('Error en GET /api/eventos/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/eventos/[id]
 * Actualiza un evento existente (requiere autenticación y rol admin)
 */
export async function PATCH(
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
        { error: 'No autorizado' },
        { status: 403 }
      )
    }
    
    // Verificar que el evento existe
    const { data: existingEvent } = await supabase
      .from('eventos')
      .select('id')
      .eq('id', params.id)
      .single()
    
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }
    
    // Validar datos
    const body = await request.json()
    const validatedData = eventoSchema.partial().parse(body)
    
    // Actualizar evento
    const { data: evento, error: updateError } = await supabase
      .from('eventos')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error al actualizar evento:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar el evento' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Evento actualizado exitosamente',
      evento,
    })
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
    
    console.error('Error en PATCH /api/eventos/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/eventos/[id]
 * Elimina un evento (requiere autenticación y rol admin)
 */
export async function DELETE(
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
        { error: 'No autorizado' },
        { status: 403 }
      )
    }
    
    // Eliminar evento
    const { error: deleteError } = await supabase
      .from('eventos')
      .delete()
      .eq('id', params.id)
    
    if (deleteError) {
      console.error('Error al eliminar evento:', deleteError)
      return NextResponse.json(
        { error: 'Error al eliminar el evento' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Evento eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error en DELETE /api/eventos/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
