import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/auth'
import { z } from 'zod'

/**
 * POST /api/auth/login
 * Inicia sesión de un usuario existente
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validatedData = loginSchema.parse(body)
    
    const supabase = createServerClient()
    
    // Intentar iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })
    
    if (error) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      )
    }
    
    if (!data.user) {
      return NextResponse.json(
        { error: 'Error al iniciar sesión' },
        { status: 500 }
      )
    }
    
    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (profileError) {
      console.error('Error al obtener perfil:', profileError)
    }
    
    return NextResponse.json({
      message: 'Sesión iniciada exitosamente',
      user: {
        id: data.user.id,
        email: data.user.email,
        profile: profile || null,
      },
      session: data.session,
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
    
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
