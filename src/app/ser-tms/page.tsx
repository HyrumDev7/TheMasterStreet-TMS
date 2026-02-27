'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serTmsSchema, type SerTmsInput } from '@/lib/validations/serTms'
import { formatearRut } from '@/lib/validations/rut'
import styles from './page.module.css'

export default function SerTmsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SerTmsInput>({
    resolver: zodResolver(serTmsSchema),
    defaultValues: { edad: undefined },
  })

  const rutValue = watch('rut')
  if (rutValue && rutValue.length > 0) {
    const formatted = formatearRut(rutValue)
    if (formatted !== rutValue && formatted.length > 0) {
      setValue('rut', formatted, { shouldValidate: false })
    }
  }

  const onSubmit = async (data: SerTmsInput) => {
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/ser-tms', {
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
          <h1 className={styles.title}>Sé TMS</h1>
          <p className={styles.subtitle}>
            Completa el formulario con tu información y enlace de video (YouTube, TikTok o
            Instagram).
          </p>
          {success ? (
            <p className={styles.alertSuccess}>
              Recibimos tu postulación. Nos pondremos en contacto contigo.
            </p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              {error && <p className={styles.alertError}>{error}</p>}
              <div>
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  {...register('nombre')}
                />
                {errors.nombre && (
                  <p className={styles.error}>{errors.nombre.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  id="apellidos"
                  type="text"
                  placeholder="Tus apellidos"
                  {...register('apellidos')}
                />
                {errors.apellidos && (
                  <p className={styles.error}>{errors.apellidos.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="rut">RUT</label>
                <input
                  id="rut"
                  type="text"
                  placeholder="12.345.678-9"
                  {...register('rut')}
                />
                {errors.rut && (
                  <p className={styles.error}>{errors.rut.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="aka">Aka</label>
                <input
                  id="aka"
                  type="text"
                  placeholder="Tu nombre artístico"
                  {...register('aka')}
                />
                {errors.aka && (
                  <p className={styles.error}>{errors.aka.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="ciudadComuna">Ciudad / Comuna</label>
                <input
                  id="ciudadComuna"
                  type="text"
                  placeholder="Ej: Santiago, Concepción"
                  {...register('ciudadComuna')}
                />
                {errors.ciudadComuna && (
                  <p className={styles.error}>{errors.ciudadComuna.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="edad">Edad</label>
                <input
                  id="edad"
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Ej: 25"
                  {...register('edad', { valueAsNumber: true })}
                />
                {errors.edad && (
                  <p className={styles.error}>{errors.edad.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="linkVideo">Link de video (YouTube, TikTok o Instagram)</label>
                <input
                  id="linkVideo"
                  type="url"
                  placeholder="https://..."
                  {...register('linkVideo')}
                />
                {errors.linkVideo && (
                  <p className={styles.error}>{errors.linkVideo.message}</p>
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
        </div>
      </div>
    </div>
  )
}
