/**
 * Emails oficiales por clasificatoria (públicos). Contraseña: JURADO_PASSWORD (solo si el acceso está activo).
 */
import { timingSafeEqual } from 'node:crypto'

export const JURADO_EMAILS: Record<number, string> = {
  1: 'jurado.1@masterstreet.cl',
  2: 'jurado.2@masterstreet.cl',
  3: 'jurado.3@masterstreet.cl',
}

/** Acceso jurado deshabilitado por defecto. Activa con JURADO_LOGIN_ENABLED=true en el servidor. */
export function isJuradoLoginEnabled(): boolean {
  return process.env.JURADO_LOGIN_ENABLED === 'true'
}

function timingSafeStringEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8')
    const bufB = Buffer.from(b, 'utf8')
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

/**
 * Valida email + contraseña. Si el login jurado está deshabilitado, siempre false.
 */
export function validateJuradoCredentials(
  clasificatoria: number,
  email: string,
  password: string
): boolean {
  if (!isJuradoLoginEnabled()) return false
  const expectedEmail = JURADO_EMAILS[clasificatoria]
  const secret = process.env.JURADO_PASSWORD
  if (!expectedEmail || !secret) return false
  if (expectedEmail !== email) return false
  return timingSafeStringEqual(password, secret)
}
