'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../admin.module.css'

type Props = { noticiaId?: string }

export function NoticiaForm({ noticiaId }: Props) {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [extracto, setExtracto] = useState('')
  const [cuerpo, setCuerpo] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [imagenX, setImagenX] = useState(50)
  const [imagenY, setImagenY] = useState(50)
  const [imagenEscala, setImagenEscala] = useState(100)
  const [publicado, setPublicado] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!noticiaId) return
    fetch(`/api/cms/noticias/${noticiaId}`)
      .then((res) => res.json())
      .then((data) => {
        const n = data.noticia
        if (!n) return
        setTitulo(n.titulo || '')
        setExtracto(n.extracto || '')
        setCuerpo(n.cuerpo || '')
        setImagenUrl(n.imagen_url || '')
        setImagenX(Number(n.imagen_x ?? 50))
        setImagenY(Number(n.imagen_y ?? 50))
        setImagenEscala(Number(n.imagen_escala ?? 100))
        setPublicado(n.publicado !== false)
      })
  }, [noticiaId])

  const upload = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/cms/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al subir')
    setImagenUrl(data.url)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      titulo,
      extracto,
      cuerpo,
      imagen_url: imagenUrl,
      imagen_x: imagenX,
      imagen_y: imagenY,
      imagen_escala: imagenEscala,
      publicado,
    }
    const res = await fetch(noticiaId ? `/api/cms/noticias/${noticiaId}` : '/api/cms/noticias', {
      method: noticiaId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error || 'No se pudo guardar')
      return
    }
    router.push('/admin/noticias')
    router.refresh()
  }

  return (
    <form onSubmit={save}>
      <label className={styles.label}>Título</label>
      <input className={styles.input} value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      <label className={styles.label}>Extracto</label>
      <input className={styles.input} value={extracto} onChange={(e) => setExtracto(e.target.value)} />
      <label className={styles.label}>Texto</label>
      <textarea className={styles.textarea} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} />
      <label className={styles.label}>Imagen de portada</label>
      <input
        className={styles.input}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file).catch((err) => setError(String(err.message || err)))
        }}
      />
      {imagenUrl ? (
        <div
          style={{
            marginTop: '0.75rem',
            height: 180,
            overflow: 'hidden',
            background: '#111',
          }}
        >
          <img
            src={imagenUrl}
            alt=""
            style={{
              width: `${imagenEscala}%`,
              height: 'auto',
              transform: `translate(${imagenX - 50}%, ${imagenY - 50}%)`,
              maxWidth: 'none',
            }}
          />
        </div>
      ) : null}
      <label className={styles.label}>Posición horizontal {imagenX}</label>
      <input type="range" min={0} max={100} value={imagenX} onChange={(e) => setImagenX(Number(e.target.value))} />
      <label className={styles.label}>Posición vertical {imagenY}</label>
      <input type="range" min={0} max={100} value={imagenY} onChange={(e) => setImagenY(Number(e.target.value))} />
      <label className={styles.label}>Tamaño {imagenEscala}%</label>
      <input type="range" min={40} max={180} value={imagenEscala} onChange={(e) => setImagenEscala(Number(e.target.value))} />
      <label className={styles.label}>
        <input type="checkbox" checked={publicado} onChange={(e) => setPublicado(e.target.checked)} /> Publicada
      </label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.btn} type="submit" disabled={saving}>
        {saving ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  )
}
