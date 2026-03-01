'use client'

import { useState, useEffect } from 'react'
import styles from './CookieConsent.module.css'

const STORAGE_KEY = 'tms-cookie-consent'

type Choice = 'accepted' | 'rejected' | null

export function CookieConsent() {
  const [choice, setChoice] = useState<Choice>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY) as Choice | null
    if (stored === 'accepted' || stored === 'rejected') {
      setChoice(stored)
    }
  }, [mounted])

  const handleConservar = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, 'accepted')
    setChoice('accepted')
  }

  const handleEliminar = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, 'rejected')
    setChoice('rejected')
  }

  if (!mounted || choice !== null) return null

  return (
    <aside
      className={styles.banner}
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
    >
      <div className={styles.inner}>
        <p id="cookie-title" className={styles.title}>
          Uso de cookies
        </p>
        <p id="cookie-desc" className={styles.desc}>
          Utilizamos cookies para mejorar tu experiencia. Puedes conservarlas o eliminarlas.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnAccept}
            onClick={handleConservar}
            aria-label="Conservar cookies"
          >
            Conservar cookies
          </button>
          <button
            type="button"
            className={styles.btnReject}
            onClick={handleEliminar}
            aria-label="Eliminar cookies"
          >
            Eliminar cookies
          </button>
        </div>
      </div>
    </aside>
  )
}
