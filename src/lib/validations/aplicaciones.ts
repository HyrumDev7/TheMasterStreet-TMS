import { z } from 'zod'

/**
 * Schema de validación para aplicar a convocatoria
 */
export const aplicarConvocatoriaSchema = z.object({
  convocatoria_id: z.string().uuid('ID de convocatoria inválido'),
  video_audicion_url: z.string().url('URL de video inválida'),
  mensaje_motivacion: z.string().max(2000).optional(),
  experiencia: z.string().max(2000).optional(),
  redes_sociales: z
    .object({
      instagram: z.string().max(100).optional(),
      youtube: z.string().max(100).optional(),
      spotify: z.string().max(100).optional(),
    })
    .optional(),
})

export type AplicarConvocatoriaInput = z.infer<typeof aplicarConvocatoriaSchema>

/**
 * Schema de validación para evaluar aplicación (admin/jueces)
 */
export const evaluarAplicacionSchema = z.object({
  aplicacion_id: z.string().uuid(),
  estado: z.enum(['accepted', 'rejected', 'waitlist']),
  puntuacion: z.number().int().min(0).max(100).optional(),
  notas_jurado: z.string().max(2000).optional(),
})

export type EvaluarAplicacionInput = z.infer<typeof evaluarAplicacionSchema>
