'use client'

import { useEffect, useState } from 'react'
import type { PanelMediaItem } from '@/lib/cms/panels'
import { useMenu } from '@/contexts/MenuContext'
import { HeroCarousel } from './HeroCarousel'
import { HomeCardsSection } from './HomeCardsSection'

export function HomeCardsOrCarousel() {
  const { showCards } = useMenu()
  const [items, setItems] = useState<PanelMediaItem[]>([])

  useEffect(() => {
    fetch('/api/cms/paneles')
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => {})
  }, [])

  return showCards ? <HomeCardsSection media={items} /> : <HeroCarousel media={items} />
}
