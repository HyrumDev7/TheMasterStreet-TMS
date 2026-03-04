'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serTmsSchema, type SerTmsInput } from '@/lib/validations/serTms'
import { formatearRut } from '@/lib/validations/rut'
import { ALLOWED_COMPROBANTE_FORMATS, MAX_COMPROBANTE_SIZE_MB } from '@/lib/utils/constants'
import styles from './page.module.css'

export default function SerTmsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const comprobanteRef = useRef<HTMLInputElement>(null)

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
    const file = comprobanteRef.current?.files?.[0]
    if (!file || file.size === 0) {
      setError('Debes subir el comprobante de pago de tu inscripción.')
      return
    }
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_COMPROBANTE_FORMATS.includes(ext)) {
      setError(`Formato no permitido. Permitidos: ${ALLOWED_COMPROBANTE_FORMATS.join(', ')}`)
      return
    }
    if (file.size > MAX_COMPROBANTE_SIZE_MB * 1024 * 1024) {
      setError(`El comprobante no puede pesar más de ${MAX_COMPROBANTE_SIZE_MB}MB`)
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const formData = new FormData()
      formData.set('nombre', data.nombre)
      formData.set('apellidos', data.apellidos)
      formData.set('rut', data.rut)
      formData.set('aka', data.aka)
      formData.set('ciudadComuna', data.ciudadComuna)
      formData.set('edad', String(data.edad))
      formData.set('linkVideo', data.linkVideo)
      formData.set('comprobante', file)

      const res = await fetch('/api/ser-tms', {
        method: 'POST',
        body: formData,
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
            Todos los campos son obligatorios. Solo una inscripción por persona.
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                  {...register('linkVideo')}
                />
                {errors.linkVideo && (
                  <p className={styles.error}>{errors.linkVideo.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="comprobante">Comprobante de pago de la inscripción</label>
                <input
                  ref={comprobanteRef}
                  id="comprobante"
                  type="file"
                  accept={ALLOWED_COMPROBANTE_FORMATS.map((f) => `.${f}`).join(',')}
                  required
                  aria-describedby="comprobante-hint"
                />
                <p id="comprobante-hint" className={styles.hint}>
                  PDF, JPG, PNG o WebP. Máximo {MAX_COMPROBANTE_SIZE_MB}MB.
                </p>
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
