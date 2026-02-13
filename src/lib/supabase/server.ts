import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

/**
 * Crea un cliente de Supabase para uso en Server Components y API Routes
 * Este cliente tiene acceso a las cookies de la sesión del usuario
 */
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

/**
 * Obtiene el usuario autenticado actual en el servidor
 */
export async function getServerUser() {
  const supabase = createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Verifica si el usuario está autenticado
 */
export async function requireAuth() {
  const user = await getServerUser()

  if (!user) {
    throw new Error('No autenticado')
  }

  return user
}
