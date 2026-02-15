'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, User, ShoppingCart } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  return (
    <header className="absolute left-0 right-0 top-0 z-50 bg-transparent text-white">
      <nav className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Menú - Desktop: links / Mobile: hamburger */}
          <div className="flex items-center gap-8">
            <button
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              {mobileMenuOpen ? 'CERRAR' : 'MENÚ'}
            </button>
            <div className="hidden md:flex md:items-center md:gap-6">
              <Link
                href="/eventos"
                className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              >
                Próximos Eventos
              </Link>
              <Link
                href="/eventos"
                className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              >
                Calendario
              </Link>
              <Link
                href="/noticias"
                className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              >
                Noticias
              </Link>
              <Link
                href="/shop"
                className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              >
                Shop
              </Link>
              <Link
                href="/nosotros"
                className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              >
                Nuestra Historia
              </Link>
              <Link href="/carrito" className="transition-colors hover:text-gray-300">
                <ShoppingCart size={20} />
              </Link>
            </div>
          </div>

          {/* Iniciar sesión / Perfil */}
          <div className="flex items-center gap-4">
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
                className="rounded bg-[#DC2626] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-600"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full mt-0 space-y-4 border-t border-white/20 bg-black/95 px-4 py-6 md:hidden">
            <Link
              href="/eventos"
              className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Próximos Eventos
            </Link>
            <Link
              href="/eventos"
              className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendario
            </Link>
            <Link
              href="/noticias"
              className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Noticias
            </Link>
            <Link
              href="/shop"
              className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/nosotros"
              className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nuestra Historia
            </Link>
            <Link
              href="/carrito"
              className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Carrito
            </Link>
            <div className="border-t border-white/20 pt-4">
              {user ? (
                <>
                  <Link
                    href="/perfil"
                    className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="mt-2 block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block text-sm font-medium uppercase tracking-wide transition-colors hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
