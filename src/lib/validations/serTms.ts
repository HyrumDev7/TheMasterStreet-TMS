import { z } from 'zod'
import { validarRut } from './rut'

const videoLinkSchema = z
  .string()
  .url('Ingresa una URL válida')
  .refine(
    (url) => {
      try {
        const u = new URL(url)
        const host = u.hostname.toLowerCase()
        return (
          host.includes('youtube.com') ||
          host.includes('youtu.be') ||
          host.includes('tiktok.com') ||
          host.includes('instagram.com')
        )
      } catch {
        return false
      }
    },
    { message: 'El enlace debe ser de YouTube, TikTok o Instagram' }
  )

export const serTmsSchema = z.object({
  nombre: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  apellidos: z
    .string()
    .min(2, 'Apellidos debe tener al menos 2 caracteres')
    .max(150, 'Apellidos muy largo'),
  rut: z.string().refine(validarRut, {
    message: 'RUT inválido',
  }),
  aka: z
    .string()
    .min(2, 'Aka debe tener al menos 2 caracteres')
    .max(80, 'Aka muy largo'),
  ciudadComuna: z
    .string()
    .min(2, 'Ciudad/Comuna debe tener al menos 2 caracteres')
    .max(120, 'Ciudad/Comuna muy largo'),
  edad: z.coerce
    .number({ invalid_type_error: 'Edad debe ser un número' })
    .min(1, 'Edad mínima 1')
    .max(120, 'Edad no válida'),
  linkVideo: videoLinkSchema,
})

export type SerTmsInput = z.infer<typeof serTmsSchema>
