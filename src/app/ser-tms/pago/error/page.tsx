'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from '../../page.module.css'

function ErrorContent() {
  const searchParams = useSearchParams()
  const motivo = searchParams.get('motivo')

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
          <h1 className={styles.title}>No se pudo completar el pago</h1>
          <p className={styles.subtitle}>
            {motivo === 'rechazado'
              ? 'La pasarela rechazó o anuló la operación.'
              : 'Hubo un problema al confirmar el pago. Intenta de nuevo o prueba otro método.'}
          </p>
          <p className={styles.backWrap}>
            <Link href="/ser-tms" className={styles.backLink}>
              Volver a SÉ TMS
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SerTmsPagoErrorPage() {
  return (
    <Suspense fallback={<div className={styles.root} style={{ minHeight: '40vh' }} />}>
      <ErrorContent />
    </Suspense>
  )
}
