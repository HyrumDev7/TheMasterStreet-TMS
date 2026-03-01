/**
 * Credenciales de jurado por clasificatoria (solo validación server-side).
 * No exponer en cliente.
 */
export const JURADO_CREDENTIALS: Record<
  number,
  { email: string; password: string }
> = {
  1: { email: 'jurado.1@masterstreet.cl', password: 'juradoclasificatoria' },
  2: { email: 'jurado.2@masterstreet.cl', password: 'juradoclasificatoria2' },
  3: { email: 'jurado.3@masterstreet.cl', password: 'juradoclasificatoria3' },
}

export function validateJuradoCredentials(
  clasificatoria: number,
  email: string,
  password: string
): boolean {
  const cred = JURADO_CREDENTIALS[clasificatoria]
  if (!cred) return false
  return cred.email === email && cred.password === password
}
