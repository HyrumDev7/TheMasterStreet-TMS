/** Rutas accesibles sin sesión. El resto del sitio exige login. */
export const PUBLIC_PATHS = [
  '/login',
  '/registro',
  '/api/auth/register',
  '/api/auth/login',
  '/api/pagos/flow/confirm',
  '/robots.txt',
  '/sitemap.xml',
] as const

export const PUBLIC_PATH_PREFIXES = ['/api/cron/'] as const

export function isPublicPath(pathname: string): boolean {
  const path = pathname.toLowerCase()
  if (PUBLIC_PATHS.some((exact) => path === exact)) return true
  return PUBLIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
}
