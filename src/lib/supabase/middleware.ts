import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database'

/**
 * Middleware para manejar autenticación en rutas protegidas
 */
export async function updateSession(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req: request, res })

  // Refrescar sesión si es necesario
  await supabase.auth.getSession()

  return res
}
