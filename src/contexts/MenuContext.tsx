'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'

type MenuContextValue = {
  showCards: boolean
  toggleCards: () => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function MenuProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [showCards, setShowCards] = useState(false)
  const toggleCards = useCallback(() => setShowCards((prev) => !prev), [])
  const value = useMemo(() => ({ showCards, toggleCards }), [showCards, toggleCards])
  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) return { showCards: false, toggleCards: () => {} }
  return ctx
}
