'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, User } from 'lucide-react'
import { useMenu } from '@/contexts/MenuContext'
import styles from './Header.module.css'

export default function Header() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { showCards, toggleCards } = useMenu()
  const [juradoModalOpen, setJuradoModalOpen] = useState(false)

  const handleClasificatoria = (num: number) => {
    setJuradoModalOpen(false)
    router.push(`/jurado/clasificatoria-${num}`)
  }

  return (
    <>
      <header className={`${styles.root} absolute left-0 right-0 top-0 z-50 bg-transparent text-white`}>
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <div className={styles.navLeft}>
              <button
                type="button"
                className={styles.menuButton}
                onClick={toggleCards}
                aria-expanded={showCards}
                aria-label={showCards ? 'Cerrar menú (ver carrusel)' : 'Abrir menú (ver secciones)'}
              >
                {showCards ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <div className={styles.navRight}>
              {loading ? (
                <div className="h-9 w-32 animate-pulse rounded bg-gray-700/50" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
                  >
                    <User size={18} />
                    {user.user_metadata?.alias || 'Mi Perfil'}
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.juradoButton}
                  onClick={() => setJuradoModalOpen(true)}
                >
                  JURADO
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {juradoModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setJuradoModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Seleccionar clasificatoria"
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setJuradoModalOpen(false)}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            <h2 className={styles.modalTitle}>Selecciona la clasificatoria</h2>
            <div className={styles.modalOptions}>
              <button type="button" className={styles.modalOption} onClick={() => handleClasificatoria(1)}>
                Clasificatoria 1
              </button>
              <button type="button" className={styles.modalOption} onClick={() => handleClasificatoria(2)}>
                Clasificatoria 2
              </button>
              <button type="button" className={styles.modalOption} onClick={() => handleClasificatoria(3)}>
                Clasificatoria 3
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
