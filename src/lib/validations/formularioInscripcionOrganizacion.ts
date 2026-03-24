import { z } from 'zod'

export const formularioInscripcionOrganizacionSchema = z.object({
  nombreOrganizacion: z
    .string()
    .min(2, 'Indica el nombre de la organización')
    .max(200, 'Nombre demasiado largo'),
  integrantes: z
    .string()
    .min(10, 'Describe a los integrantes (mínimo 10 caracteres)')
    .max(4000, 'Texto demasiado largo'),
  juradoOficial: z
    .string()
    .min(2, 'Nombra al menos un jurado oficial')
    .max(500, 'Texto demasiado largo'),
  linkRedSocial: z.string().url('Ingresa una URL válida (ej. https://instagram.com/...)'),
})

export type FormularioInscripcionOrganizacionInput = z.infer<
  typeof formularioInscripcionOrganizacionSchema
>
