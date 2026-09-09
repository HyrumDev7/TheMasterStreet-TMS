'use client'

import { useEffect, useState } from 'react'
import { CMS_PANELS, type PanelMediaItem } from '@/lib/cms/panels'
import { PanelStage } from '@/components/cms/PanelStage'
import styles from '../admin.module.css'

export default function AdminPanelesPage() {
  const [panelId, setPanelId] = useState(CMS_PANELS[0].id)
  const [items, setItems] = useState<PanelMediaItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/cms/me').then((res) => {
      if (!res.ok) window.location.href = '/admin/login'
    })
  }, [])

  const load = (id: string) => {
    fetch(`/api/cms/paneles?panel=${id}`)
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setError('No se pudieron cargar las imágenes'))
  }

  useEffect(() => {
    load(panelId)
    setSelectedId(null)
  }, [panelId])

  const addFile = async (file: File) => {
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const up = await fetch('/api/cms/upload', { method: 'POST', body: fd })
    const uploaded = await up.json()
    if (!up.ok) {
      setError(uploaded.error || 'Error al subir')
      return
    }
    const res = await fetch('/api/cms/paneles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        panel_id: panelId,
        url: uploaded.url,
        pos_x: 10,
        pos_y: 10,
        ancho: 40,
        alto: 40,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Error al agregar')
      return
    }
    load(panelId)
  }

  const saveLayout = async () => {
    setSaving(true)
    setError('')
    const res = await fetch('/api/cms/paneles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    setSaving(false)
    if (!res.ok) setError('No se pudo guardar el diseño')
  }

  const removeSelected = async () => {
    if (!selectedId) return
    if (!confirm('¿Eliminar esta imagen?')) return
    const res = await fetch(`/api/cms/paneles?id=${selectedId}`, { method: 'DELETE' })
    if (!res.ok) {
      setError('No se pudo eliminar')
      return
    }
    setSelectedId(null)
    load(panelId)
  }

  const selected = items.find((item) => item.id === selectedId)

  return (
    <div className={styles.card} style={{ maxWidth: '64rem' }}>
      <h1 className={styles.title}>Imágenes en paneles</h1>
      <p>Elegí un panel, subí imágenes, arrastralas y agrandalas con el cuadrado rojo. Luego Guardar diseño.</p>
      <label className={styles.label}>Panel</label>
      <select className={styles.input} value={panelId} onChange={(e) => setPanelId(e.target.value as typeof panelId)}>
        {CMS_PANELS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <label className={styles.label}>Agregar imagen</label>
      <input
        className={styles.input}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) addFile(file)
          e.target.value = ''
        }}
      />
      <div style={{ marginTop: '1rem' }}>
        <PanelStage items={items} onChange={setItems} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      {selected ? (
        <div>
          <label className={styles.label}>Rotación {Math.round(selected.rotacion)}°</label>
          <input
            type="range"
            min={-45}
            max={45}
            value={selected.rotacion}
            onChange={(e) =>
              setItems(
                items.map((item) =>
                  item.id === selected.id ? { ...item, rotacion: Number(e.target.value) } : item
                )
              )
            }
          />
        </div>
      ) : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.row}>
        <button type="button" className={styles.btn} onClick={saveLayout} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar diseño'}
        </button>
        <button type="button" className={styles.btnGhost} onClick={removeSelected} disabled={!selectedId}>
          Eliminar imagen
        </button>
      </div>
    </div>
  )
}
