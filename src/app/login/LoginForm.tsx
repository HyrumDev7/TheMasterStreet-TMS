'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import styles from '@/app/admin/admin.module.css'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }
    const dest = next.startsWith('/') ? next : '/'
    router.replace(dest)
    router.refresh()
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Iniciar sesión</h1>
      <form onSubmit={submit}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className={styles.label} htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        ¿No tenés cuenta? <Link href="/registro">Registrate</Link>
      </p>
    </div>
  )
}
