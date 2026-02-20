'use client'

import { useMenu } from '@/contexts/MenuContext'
import { HeroCarousel } from './HeroCarousel'
import { HomeCardsSection } from './HomeCardsSection'

export function HomeCardsOrCarousel() {
  const { showCards } = useMenu()
  return showCards ? <HomeCardsSection /> : <HeroCarousel />
}
