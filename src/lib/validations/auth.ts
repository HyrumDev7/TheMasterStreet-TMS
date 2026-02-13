import { z } from 'zod'
import { validarRut } from './rut'

/**
 * Schema de validación para registro de usuario
 */
export const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'Nombre debe tener al menos 2 caracteres')
      .max(100, 'Nombre muy largo'),
    rut: z.string().refine(validarRut, {
      message: 'RUT inválido',
    }),
    alias: z
      .string()
      .min(2, 'Alias debe tener al menos 2 caracteres')
      .max(50, 'Alias muy largo')
      .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'Contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegistroInput = z.infer<typeof registroSchema>

/**
 * Schema de validación para login
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Schema de validación para recuperación de contraseña
 */
export const recuperarPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export type RecuperarPasswordInput = z.infer<typeof recuperarPasswordSchema>

/**
 * Schema de validación para actualizar perfil
 */
export const actualizarPerfilSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  telefono: z.string().max(15).optional(),
  fecha_nacimiento: z.string().optional(),
  ciudad: z.string().max(100).optional(),
  biografia: z.string().max(2000).optional(),
  instagram: z.string().max(100).optional(),
  youtube: z.string().max(100).optional(),
  spotify: z.string().max(100).optional(),
})

export type ActualizarPerfilInput = z.infer<typeof actualizarPerfilSchema>
