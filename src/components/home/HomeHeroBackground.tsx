'use client'

import { useEffect, useState } from 'react'
import type { PanelMediaItem } from '@/lib/cms/panels'
import { PanelMediaLayer } from '@/components/cms/PanelMediaLayer'
import styles from '@/app/page.module.css'

export function HomeHeroBackground() {
  const [items, setItems] = useState<PanelMediaItem[]>([])
  useEffect(() => {
    fetch('/api/cms/paneles?panel=home-hero')
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => {})
  }, [])
  const cover = items[0]
  return (
    <div
      className={styles.heroBg}
      style={{
        backgroundImage: cover ? `url(${cover.url})` : 'url(/images/hero-definitivo.png)',
        backgroundPosition: cover ? `${cover.pos_x}% ${cover.pos_y}%` : 'center center',
        backgroundSize: cover ? `${Math.max(cover.ancho, 100)}%` : 'cover',
      }}
    >
      <div className={styles.heroBgOverlay} aria-hidden />
      {items.length > 1 ? <PanelMediaLayer items={items.slice(1)} /> : null}
    </div>
  )
}
