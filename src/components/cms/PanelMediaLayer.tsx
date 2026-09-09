'use client'

import type { PanelMediaItem } from '@/lib/cms/panels'
import styles from './PanelMediaLayer.module.css'

export function PanelMediaLayer({ items }: { items: PanelMediaItem[] }) {
  if (!items.length) return null
  return (
    <div className={styles.layer} aria-hidden>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.item}
          style={{
            left: `${item.pos_x}%`,
            top: `${item.pos_y}%`,
            width: `${item.ancho}%`,
            height: `${item.alto}%`,
            transform: `rotate(${item.rotacion}deg)`,
            backgroundImage: `url(${item.url})`,
          }}
        />
      ))}
    </div>
  )
}
