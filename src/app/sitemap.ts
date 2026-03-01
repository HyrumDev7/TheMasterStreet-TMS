import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/utils/constants'

/**
 * Genera /sitemap.xml para priorizar el rastreo.
 * Incluye las rutas públicas principales; en producción asegúrate de tener
 * NEXT_PUBLIC_APP_URL con tu dominio (ej. https://tms.cl).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = APP_URL.replace(/\/$/, '')
  const now = new Date()

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/eventos`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/convocatorias`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
