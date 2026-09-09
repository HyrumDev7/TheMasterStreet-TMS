'use client'

import { useEffect, useState } from 'react'
import styles from '../admin.module.css'

export function MetricsClient() {
  const [total, setTotal] = useState(0)
  const [byDay, setByDay] = useState<Record<string, number>>({})
  const [byPath, setByPath] = useState<Record<string, number>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/cms/metricas')
      .then((res) => res.json())
      .then((data) => {
        if (data.error && !data.rows) setError(data.error)
        setTotal(data.total || 0)
        setByDay(data.byDay || {})
        setByPath(data.byPath || {})
      })
      .catch(() => setError('No se pudieron cargar las métricas'))
  }, [])

  const days = Object.entries(byDay).sort((a, b) => (a[0] < b[0] ? 1 : -1))
  const paths = Object.entries(byPath).sort((a, b) => b[1] - a[1])

  return (
    <div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <p style={{ margin: '1rem 0' }}>
        Total 30 días: <strong>{total}</strong>
      </p>
      <h2 className={styles.label}>Por día</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Día</th>
            <th>Visitas</th>
          </tr>
        </thead>
        <tbody>
          {days.map(([dia, n]) => (
            <tr key={dia}>
              <td>{dia}</td>
              <td>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className={styles.label}>Por página</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ruta</th>
            <th>Visitas</th>
          </tr>
        </thead>
        <tbody>
          {paths.map(([ruta, n]) => (
            <tr key={ruta}>
              <td>{ruta}</td>
              <td>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
