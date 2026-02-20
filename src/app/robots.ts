import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/utils/constants'

/**
 * Genera /robots.txt para priorizar el rastreo:
 * - Permite a todos los bots indexar la web
 * - Apunta al sitemap para que descubran todas las URLs
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = APP_URL.replace(/\/$/, '')
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/perfil/', '/ordenes/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
