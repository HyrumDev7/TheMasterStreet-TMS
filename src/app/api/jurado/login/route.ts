import { NextResponse } from 'next/server'
import { validateJuradoCredentials } from '@/lib/jurado-credentials'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clasificatoria, email, password } = body as {
      clasificatoria?: number
      email?: string
      password?: string
    }
    if (
      typeof clasificatoria !== 'number' ||
      clasificatoria < 1 ||
      clasificatoria > 3 ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return NextResponse.json(
        { valid: false, error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    const valid = validateJuradoCredentials(clasificatoria, email, password)
    if (!valid) {
      return NextResponse.json(
        { valid: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }
    return NextResponse.json({ valid: true })
  } catch {
    return NextResponse.json(
      { valid: false, error: 'Error en la solicitud' },
      { status: 500 }
    )
  }
}
