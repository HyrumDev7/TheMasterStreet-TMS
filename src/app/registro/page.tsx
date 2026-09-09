'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatearRutSinPuntos } from '@/lib/validations/rut'
import styles from '@/app/admin/admin.module.css'

export default function RegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [rut, setRut] = useState('')
  const [alias, setAlias] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        rut,
        alias,
        email,
        password,
        confirmPassword,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'No se pudo registrar')
      return
    }
    router.push('/login')
  }

  return (
    <div className={styles.shell} style={{ paddingTop: '6rem' }}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p>Todas las cuentas se crean como usuario. El panel de contenido no se elige aquí.</p>
        <form onSubmit={submit}>
          <label className={styles.label}>Nombre</label>
          <input className={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <label className={styles.label}>RUT</label>
          <input
            className={styles.input}
            value={rut}
            onChange={(e) => setRut(formatearRutSinPuntos(e.target.value))}
            required
          />
          <label className={styles.label}>Alias</label>
          <input className={styles.input} value={alias} onChange={(e) => setAlias(e.target.value)} required />
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className={styles.label}>Contraseña (8+ caracteres, mayúscula, minúscula y número)</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className={styles.label}>Confirmar contraseña</label>
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error ? <p className={styles.error}>{error}</p> : null}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creando…' : 'Registrarme'}
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          ¿Ya tenés cuenta? <Link href="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
