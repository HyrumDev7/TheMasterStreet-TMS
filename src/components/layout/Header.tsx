'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, User } from 'lucide-react'
import { useMenu } from '@/contexts/MenuContext'
import styles from './Header.module.css'

export default function Header() {
  const { user, loading, signOut } = useAuth()
  const { showCards, toggleCards } = useMenu()

  return (
    <header className={`${styles.root} absolute left-0 right-0 top-0 z-50 bg-transparent text-white`}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          {/* Menú: esquina superior izquierda */}
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

          {/* Iniciar sesión / Perfil: esquina superior derecha */}
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
              <Link
                href="/auth/login"
                className={styles.loginButton}
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
