'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from '../../page.module.css'

function ExitoContent() {
  const searchParams = useSearchParams()
  const ordenId = searchParams.get('ordenId')
  const [estado, setEstado] = useState<string | null>(null)
  const [polls, setPolls] = useState(0)

  useEffect(() => {
    if (!ordenId) return

    let cancelled = false
    const tick = async () => {
      try {
        const res = await fetch(`/api/ser-tms/orden-estado?ordenId=${encodeURIComponent(ordenId)}`)
        const data = await res.json()
        if (!cancelled && data.estado) setEstado(data.estado)
      } catch {
        /* ignore */
      }
    }

    tick()
    const id = setInterval(() => {
      setPolls((p) => p + 1)
      tick()
    }, 2500)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [ordenId])

  const paid = estado === 'paid'
  const failed = estado === 'failed'

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
          <h1 className={styles.title}>Pago SÉ TMS</h1>
          {!ordenId && (
            <p className={styles.alertError}>Falta el identificador de la orden.</p>
          )}
          {ordenId && !paid && !failed && polls < 24 && (
            <p className={styles.subtitle}>
              Confirmando tu pago con el proveedor… Esto puede tardar unos segundos.
            </p>
          )}
          {paid && (
            <p className={styles.alertSuccess}>
              ¡Listo! Tu inscripción quedó registrada. Te contactaremos pronto.
            </p>
          )}
          {failed && (
            <p className={styles.alertError}>
              El pago no se completó o fue rechazado. Puedes volver al formulario e intentar de
              nuevo.
            </p>
          )}
          {ordenId && !paid && !failed && polls >= 24 && (
            <p className={styles.subtitle}>
              Aún no vemos la confirmación automática. Si ya pagaste, guarda tu comprobante del
              banco o del correo de Flow y escríbenos.
            </p>
          )}
          <p className={styles.backWrap}>
            <Link href="/ser-tms" className={styles.backLink}>
              Volver a SÉ TMS
            </Link>
            {' · '}
            <Link href="/" className={styles.backLink}>
              Inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SerTmsPagoExitoPage() {
  return (
    <Suspense fallback={<div className={styles.root} style={{ minHeight: '40vh' }} />}>
      <ExitoContent />
    </Suspense>
  )
}
