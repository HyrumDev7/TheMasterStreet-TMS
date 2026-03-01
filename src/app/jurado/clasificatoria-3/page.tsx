'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { PasswordField } from '@/components/jurado/PasswordField'
import styles from './page.module.css'

export default function JuradoClasificatoria3Page() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/jurado/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clasificatoria: 3, email, password }),
      })
      const data = await res.json()
      if (!data.valid) {
        setError(data.error || 'Credenciales incorrectas')
        setLoading(false)
        return
      }
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError(authError.message || 'Error al iniciar sesión')
        setLoading(false)
        return
      }
      router.push('/jurado')
      router.refresh()
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Jurado – Clasificatoria 3</h1>
        <p className={styles.subtitle}>Ingresa tus credenciales</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label className={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
          </label>
          <PasswordField
            id="password-clasificatoria-3"
            label="Contraseña"
            value={password}
            onChange={setPassword}
          />
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <Link href="/" className={styles.back}>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
