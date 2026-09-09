'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function VisitBeacon() {
  const pathname = usePathname()
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    fetch('/api/cms/metricas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruta: pathname }),
    }).catch(() => {})
  }, [pathname])
  return null
}
