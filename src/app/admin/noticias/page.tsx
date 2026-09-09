'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../admin.module.css'

type Noticia = {
  id: string
  titulo: string
  slug: string
  publicado: boolean
}

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [error, setError] = useState('')

  const load = () => {
    fetch('/api/cms/noticias?all=1')
      .then(async (res) => {
        const data = await res.json()
        if (res.status === 403 || res.status === 401) {
          window.location.href = '/admin/login'
          return
        }
        if (data.error) setError(data.error)
        setNoticias(data.noticias || [])
      })
      .catch(() => setError('No se pudieron cargar las noticias'))
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta noticia?')) return
    const res = await fetch(`/api/cms/noticias/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      setError('No se pudo eliminar')
      return
    }
    load()
  }

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <h1 className={styles.title}>Noticias</h1>
        <Link href="/admin/noticias/nueva" className={styles.btn}>
          Agregar
        </Link>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <ul className={styles.list}>
        {noticias.map((n) => (
          <li key={n.id}>
            <span>
              {n.titulo} {n.publicado ? '' : '(oculta)'}
            </span>
            <span className={styles.row}>
              <Link href={`/admin/noticias/${n.id}`}>Editar</Link>
              <button type="button" className={styles.btnGhost} onClick={() => remove(n.id)}>
                Eliminar
              </button>
            </span>
          </li>
        ))}
      </ul>
      {noticias.length === 0 ? <p>Todavía no hay noticias.</p> : null}
    </div>
  )
}
