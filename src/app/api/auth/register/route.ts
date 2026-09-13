import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { registroSchema } from '@/lib/validations/auth'
import { formatearRutSinPuntos } from '@/lib/validations/rut'
import { z } from 'zod'

/**
 * Registro público: siempre usuario normal. El rol no se acepta del cliente.
 * Crea el usuario confirmado para poder iniciar sesión de inmediato con su contraseña.
 */
export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const { rol: _ignoredRol, ...safeBody } = raw as Record<string, unknown>
    const validatedData = registroSchema.parse(safeBody)
    const email = validatedData.email.trim().toLowerCase()
    const rut = formatearRutSinPuntos(validatedData.rut)
    const admin = createAdminClient()

    const { data: existingAlias } = await admin
      .from('profiles')
      .select('alias')
      .eq('alias', validatedData.alias)
      .maybeSingle()

    if (existingAlias) {
      return NextResponse.json({ error: 'El alias ya está en uso. Por favor elige otro.' }, { status: 400 })
    }

    const { data: existingRut } = await admin.from('profiles').select('rut').eq('rut', rut).maybeSingle()
    if (existingRut) {
      return NextResponse.json({ error: 'Este RUT ya está registrado.' }, { status: 400 })
    }

    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: {
        nombre: validatedData.nombre,
        rut,
        alias: validatedData.alias,
      },
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || 'No se pudo crear el usuario' },
        { status: 400 }
      )
    }

    const { error: profileError } = await admin.from('profiles').insert({
      id: authData.user.id,
      nombre: validatedData.nombre,
      rut,
      alias: validatedData.alias,
      email,
      rol: 'competitor',
      estado: 'active',
    } as never)

    if (profileError) {
      await admin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: 'Error al crear el perfil: ' + profileError.message }, { status: 500 })
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Error en registro:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
