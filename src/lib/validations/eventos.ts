import { z } from 'zod'

/**
 * Schema de validación para crear/actualizar evento
 */
export const eventoSchema = z.object({
  titulo: z.string().min(5, 'Título debe tener al menos 5 caracteres').max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug solo puede contener letras minúsculas, números y guiones'),
  descripcion: z.string().min(50, 'Descripción debe tener al menos 50 caracteres'),
  descripcion_corta: z.string().max(500).optional(),
  tipo: z.enum(['batalla', 'workshop', 'cypher', 'showcase']),
  fecha_inicio: z.string().datetime(),
  fecha_fin: z.string().datetime().optional(),
  lugar: z.string().min(3).max(200),
  direccion: z.string().max(500).optional(),
  ciudad: z.string().max(100).default('Concepción'),
  latitud: z.number().min(-90).max(90).optional(),
  longitud: z.number().min(-180).max(180).optional(),
  aforo_maximo: z.number().int().positive().optional(),
  precio_general: z.number().nonnegative().optional(),
  precio_vip: z.number().nonnegative().optional(),
  precio_early_bird: z.number().nonnegative().optional(),
  requiere_inscripcion: z.boolean().default(false),
  fecha_limite_inscripcion: z.string().datetime().optional(),
  estado: z.enum(['draft', 'published', 'cancelled', 'finished']).default('draft'),
  destacado: z.boolean().default(false),
})

export type EventoInput = z.infer<typeof eventoSchema>
