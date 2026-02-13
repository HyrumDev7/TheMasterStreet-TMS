'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registroSchema, type RegistroInput } from '@/lib/validations/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatearRut } from '@/lib/validations/rut'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegistroInput>({
    resolver: zodResolver(registroSchema),
  })

  // Auto-formatear RUT mientras escribe
  const rutValue = watch('rut')
  if (rutValue && rutValue.length > 0) {
    const formatted = formatearRut(rutValue)
    if (formatted !== rutValue && formatted.length > 0) {
      setValue('rut', formatted, { shouldValidate: false })
    }
  }

  const onSubmit = async (data: RegistroInput) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.details) {
          // Errores de validación de Zod
          setError(result.details.map((e: { message: string }) => e.message).join(', '))
        } else {
          setError(result.error || 'Error al registrar')
        }
        return
      }

      // Redirigir al login con mensaje de éxito
      router.push('/auth/login?registered=true')
    } catch (err) {
      setError('Error al crear la cuenta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Únete a The Master Street
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="space-y-4">
            <Input
              {...register('nombre')}
              type="text"
              label="Nombre Completo"
              placeholder="Juan Pérez"
              error={errors.nombre?.message}
              autoComplete="name"
            />

            <Input
              {...register('rut')}
              type="text"
              label="RUT"
              placeholder="12.345.678-9"
              error={errors.rut?.message}
              helperText="Formato: 12.345.678-9"
            />

            <Input
              {...register('alias')}
              type="text"
              label="Alias (AKA)"
              placeholder="MC_Flow"
              error={errors.alias?.message}
              helperText="Este será tu nombre artístico en la plataforma"
            />

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              autoComplete="email"
            />

            <Input
              {...register('password')}
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText="Mínimo 8 caracteres, una mayúscula y un número"
              autoComplete="new-password"
            />

            <Input
              {...register('confirmPassword')}
              type="password"
              label="Confirmar Contraseña"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            Registrarse
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-black hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
