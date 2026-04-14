'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serTmsSchema, serTmsCheckoutSchema, type SerTmsInput } from '@/lib/validations/serTms'
import { formatearRutSinPuntos } from '@/lib/validations/rut'
import { SER_TMS_PRECIO_CLP } from '@/lib/utils/constants'
import styles from './page.module.css'

export default function SerTmsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
  useEffect(() => {
    if (!rutValue || rutValue.length === 0) return
    const formatted = formatearRutSinPuntos(rutValue)
    if (formatted !== rutValue) {
      setValue('rut', formatted, { shouldValidate: false })
    }
  }, [rutValue, setValue])

  const pagar = async (data: SerTmsInput) => {
    setError('')
    const parsed = serTmsCheckoutSchema.safeParse(data)
    if (!parsed.success) {
      setError('Revisa los campos del formulario.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ser-tms/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'No se pudo iniciar el pago')
        return
      }
      if (result.redirectUrl && typeof result.redirectUrl === 'string') {
        globalThis.location.href = result.redirectUrl
        return
      }
      setError('Respuesta inválida del servidor')
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
          <h1 className={styles.title}>SÉ TMS</h1>
          <p className={styles.subtitle}>
            Inscripción {SER_TMS_PRECIO_CLP.toLocaleString('es-CL')} CLP. Una sola postulación por
            RUT. Pago seguro con Flow.
          </p>
          <form
            className={styles.form}
            onSubmit={(e) => e.preventDefault()}
          >
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
              {errors.nombre && <p className={styles.error}>{errors.nombre.message}</p>}
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
              {errors.apellidos && <p className={styles.error}>{errors.apellidos.message}</p>}
            </div>
            <div>
              <label htmlFor="rut">RUT</label>
              <input
                id="rut"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="12345678-9"
                title="Solo números, guión antes del dígito verificador, sin puntos"
                pattern="\d{7,8}-[0-9kK]"
                aria-describedby="rut-hint"
                required
                {...register('rut')}
              />
              <p id="rut-hint" className={styles.hint}>
                Sin puntos, con guión (ej. <strong>12345678-9</strong>).
              </p>
              {errors.rut && <p className={styles.error}>{errors.rut.message}</p>}
            </div>
            <div>
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.cl"
                required
                {...register('email')}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
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
              {errors.aka && <p className={styles.error}>{errors.aka.message}</p>}
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
              {errors.edad && <p className={styles.error}>{errors.edad.message}</p>}
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
              {errors.linkVideo && <p className={styles.error}>{errors.linkVideo.message}</p>}
            </div>

            <section
              className={styles.bankTransfer}
              aria-labelledby="pay-info-heading"
            >
              <h2 id="pay-info-heading" className={styles.bankTransferTitle}>
                Titular y datos de cobro (referencia)
              </h2>
              <p className={styles.bankTransferIntro}>
                El cobro de {SER_TMS_PRECIO_CLP.toLocaleString('es-CL')} CLP lo procesarás con
                <strong> Flow</strong> (tarjeta débito/crédito u otros medios que Flow habilite). Los
                datos siguientes son los mismos titulares de la cuenta corporativa:
              </p>
              <dl className={styles.bankTransferDl}>
                <div className={styles.bankTransferRow}>
                  <dt>Beneficiario</dt>
                  <dd>THE MASTER STREET SpA</dd>
                </div>
                <div className={styles.bankTransferRow}>
                  <dt>RUT</dt>
                  <dd>
                    <span className={styles.bankTransferValue}>78279129-K</span>
                  </dd>
                </div>
                <div className={styles.bankTransferRow}>
                  <dt>Banco</dt>
                  <dd>Banco de Chile — Cuenta Vista</dd>
                </div>
                <div className={styles.bankTransferRow}>
                  <dt>Número de cuenta</dt>
                  <dd>
                    <span className={styles.bankTransferValue}>171826042</span>
                  </dd>
                </div>
              </dl>
            </section>

            <div className={styles.payActions}>
              <button
                type="button"
                className={styles.submitBtn}
                disabled={loading}
                onClick={handleSubmit(pagar)}
              >
                {loading ? 'Redirigiendo…' : `Pagar con Flow — $${SER_TMS_PRECIO_CLP.toLocaleString('es-CL')}`}
              </button>
            </div>
          </form>
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
