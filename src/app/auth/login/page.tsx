'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError('Email o contraseña incorrectos')
        return
      }

      // Redirigir al perfil o a la página anterior
      const redirectTo = searchParams.get('redirect') || '/perfil'
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa a tu cuenta de The Master Street
          </p>
        </div>

        {registered && (
          <Alert variant="success">
            Cuenta creada exitosamente. Ahora puedes iniciar sesión.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="space-y-4">
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
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/auth/recuperar"
              className="text-sm text-gray-600 hover:text-black"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            Iniciar Sesión
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              href="/auth/registro"
              className="font-medium text-black hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
