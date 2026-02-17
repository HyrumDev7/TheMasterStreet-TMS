'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recuperarPasswordSchema, type RecuperarPasswordInput } from '@/lib/validations/auth'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import styles from './page.module.css'

export default function RecuperarPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarPasswordInput>({
    resolver: zodResolver(recuperarPasswordSchema),
  })

  const onSubmit = async (data: RecuperarPasswordInput) => {
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/auth/nueva-password`,
        }
      )

      if (authError) {
        setError('Error al enviar el email. Intenta nuevamente.')
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Error al procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`${styles.root} flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12`}>
        <div className={`${styles.form} w-full max-w-md space-y-8 text-center`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revisa tu Email</h1>
            <p className="mt-4 text-gray-600">
              Te hemos enviado un enlace para restablecer tu contraseña.
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="inline-block text-sm font-medium text-black hover:underline"
          >
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.root} flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12`}>
      <div className={`${styles.form} w-full max-w-md space-y-8`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && <Alert variant="error">{error}</Alert>}

          <Input
            {...register('email')}
            type="email"
            label="Email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            autoComplete="email"
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Enviar enlace
          </Button>

          <p className="text-center text-sm text-gray-600">
            <Link
              href="/auth/login"
              className="font-medium text-black hover:underline"
            >
              Volver al login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
