'use client'

import { useEffect, useRef, useState } from 'react'
import type { PanelMediaItem } from '@/lib/cms/panels'
import styles from './PanelStage.module.css'

type Mode = 'move' | 'resize'

export function PanelStage({
  items,
  onChange,
  selectedId,
  onSelect,
}: {
  items: PanelMediaItem[]
  onChange: (next: PanelMediaItem[]) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ id: string; mode: Mode; startX: number; startY: number; orig: PanelMediaItem } | null>(
    null
  )

  useEffect(() => {
    if (!drag) return
    const onMove = (e: PointerEvent) => {
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const dx = ((e.clientX - drag.startX) / rect.width) * 100
      const dy = ((e.clientY - drag.startY) / rect.height) * 100
      onChange(
        items.map((item) => {
          if (item.id !== drag.id) return item
          if (drag.mode === 'move') {
            return {
              ...item,
              pos_x: clamp(drag.orig.pos_x + dx, -20, 95),
              pos_y: clamp(drag.orig.pos_y + dy, -20, 95),
            }
          }
          return {
            ...item,
            ancho: clamp(drag.orig.ancho + dx, 8, 120),
            alto: clamp(drag.orig.alto + dy, 8, 120),
          }
        })
      )
    }
    const onUp = () => setDrag(null)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [drag, items, onChange])

  return (
    <div ref={stageRef} className={styles.stage} onPointerDown={() => onSelect(null)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`${styles.item} ${selectedId === item.id ? styles.selected : ''}`}
          style={{
            left: `${item.pos_x}%`,
            top: `${item.pos_y}%`,
            width: `${item.ancho}%`,
            height: `${item.alto}%`,
            transform: `rotate(${item.rotacion}deg)`,
            backgroundImage: `url(${item.url})`,
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            onSelect(item.id)
            setDrag({ id: item.id, mode: 'move', startX: e.clientX, startY: e.clientY, orig: item })
          }}
        >
          <button
            type="button"
            className={styles.handle}
            aria-label="Redimensionar"
            onPointerDown={(e) => {
              e.stopPropagation()
              onSelect(item.id)
              setDrag({ id: item.id, mode: 'resize', startX: e.clientX, startY: e.clientY, orig: item })
            }}
          />
        </div>
      ))}
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
