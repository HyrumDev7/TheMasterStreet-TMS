'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  formularioInscripcionOrganizacionSchema,
  type FormularioInscripcionOrganizacionInput,
} from '@/lib/validations/formularioInscripcionOrganizacion'
import styles from './page.module.css'

export default function FormularioInscripcionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioInscripcionOrganizacionInput>({
    resolver: zodResolver(formularioInscripcionOrganizacionSchema),
  })

  const onSubmit = async (data: FormularioInscripcionOrganizacionInput) => {
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/formulario-inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Error al enviar')
        return
      }
      setSuccess(true)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.heroBg}
        style={{ backgroundImage: 'url(/images/hero-definitivo.png)' }}
        aria-hidden
      />
      <div className={styles.heroBgOverlay} aria-hidden />
      <div className={styles.content}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Formulario de inscripción</h1>
          <p className={styles.subtitle}>
            Todos los campos son obligatorios.
          </p>
          {success ? (
            <p className={styles.alertSuccess}>
              Recibimos tu inscripción. Nos pondremos en contacto contigo.
            </p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              {error && <p className={styles.alertError}>{error}</p>}
              <div>
                <label htmlFor="nombreOrganizacion">Nombre de organización</label>
                <input
                  id="nombreOrganizacion"
                  type="text"
                  placeholder="Nombre de tu organización"
                  required
                  {...register('nombreOrganizacion')}
                />
                {errors.nombreOrganizacion && (
                  <p className={styles.error}>{errors.nombreOrganizacion.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="integrantes">Integrantes</label>
                <textarea
                  id="integrantes"
                  placeholder="Nombre y Apellidos"
                  required
                  rows={4}
                  {...register('integrantes')}
                />
                {errors.integrantes && (
                  <p className={styles.error}>{errors.integrantes.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="juradoOficial">Jurado oficial</label>
                <input
                  id="juradoOficial"
                  type="text"
                  placeholder="Nombra al menos un jurado oficial"
                  required
                  {...register('juradoOficial')}
                />
                {errors.juradoOficial && (
                  <p className={styles.error}>{errors.juradoOficial.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="linkRedSocial">Red social de la organización</label>
                <input
                  id="linkRedSocial"
                  type="url"
                  placeholder="https://instagram.com/..."
                  required
                  {...register('linkRedSocial')}
                />
                {errors.linkRedSocial && (
                  <p className={styles.error}>{errors.linkRedSocial.message}</p>
                )}
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          )}
          <p className={styles.backWrap}>
            <Link href="/" className={styles.backLink}>
              Volver a inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
