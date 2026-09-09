'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function CmsHeaderLink() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    fetch('/api/cms/me')
      .then((res) => res.json())
      .then((data) => setOk(Boolean(data.ok)))
      .catch(() => {})
  }, [])
  if (!ok) return null
  return (
    <Link
      href="/admin"
      className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
    >
      Contenido
    </Link>
  )
}
