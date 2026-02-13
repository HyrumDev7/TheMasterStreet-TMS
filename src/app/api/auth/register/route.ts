import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { registroSchema } from '@/lib/validations/auth'
import { z } from 'zod'

/**
 * POST /api/auth/register
 * Registra un nuevo usuario en el sistema
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar datos con Zod
    const validatedData = registroSchema.parse(body)
    
    const supabase = createServerClient()
    
    // Verificar que el alias no exista
    const { data: existingAlias } = await supabase
      .from('profiles')
      .select('alias')
      .eq('alias', validatedData.alias)
      .single()
    
    if (existingAlias) {
      return NextResponse.json(
        { error: 'El alias ya está en uso. Por favor elige otro.' },
        { status: 400 }
      )
    }
    
    // Verificar que el RUT no exista
    const { data: existingRut } = await supabase
      .from('profiles')
      .select('rut')
      .eq('rut', validatedData.rut)
      .single()
    
    if (existingRut) {
      return NextResponse.json(
        { error: 'Este RUT ya está registrado.' },
        { status: 400 }
      )
    }
    
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          nombre: validatedData.nombre,
          rut: validatedData.rut,
          alias: validatedData.alias,
        },
      },
    })
    
    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }
    
    if (!authData.user) {
      return NextResponse.json(
        { error: 'Error al crear el usuario' },
        { status: 500 }
      )
    }
    
    // Crear perfil en la tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        nombre: validatedData.nombre,
        rut: validatedData.rut,
        alias: validatedData.alias,
        email: validatedData.email,
        rol: 'competitor',
        estado: 'active',
      })
    
    if (profileError) {
      // Si falla la creación del perfil, intentar eliminar el usuario de auth
      // (opcional, depende de tu estrategia de manejo de errores)
      return NextResponse.json(
        { error: 'Error al crear el perfil: ' + profileError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          alias: validatedData.alias,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    // Error desconocido
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
