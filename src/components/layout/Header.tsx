'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, User, ShoppingCart } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            THE MASTER STREET
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/eventos"
              className="transition-colors hover:text-gray-300"
            >
              Próximos Eventos
            </Link>
            <Link
              href="/convocatorias"
              className="transition-colors hover:text-gray-300"
            >
              Convocatorias
            </Link>
            <Link
              href="/noticias"
              className="transition-colors hover:text-gray-300"
            >
              Noticias
            </Link>
            <Link
              href="/nosotros"
              className="transition-colors hover:text-gray-300"
            >
              Nuestra Historia
            </Link>
            <Link
              href="/shop"
              className="transition-colors hover:text-gray-300"
            >
              Shop
            </Link>

            {loading ? (
              <div className="h-10 w-20 animate-pulse rounded bg-gray-700" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/perfil"
                  className="flex items-center space-x-2 transition-colors hover:text-gray-300"
                >
                  <User size={20} />
                  <span>{user.user_metadata?.alias || 'Mi Perfil'}</span>
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm transition-colors hover:text-gray-300"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded bg-white px-4 py-2 text-black transition-colors hover:bg-gray-200"
              >
                Ingresar
              </Link>
            )}

            <Link href="/carrito" className="transition-colors hover:text-gray-300">
              <ShoppingCart size={24} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-4 border-t border-gray-800 pt-4 md:hidden">
            <Link
              href="/eventos"
              className="block transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Próximos Eventos
            </Link>
            <Link
              href="/convocatorias"
              className="block transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Convocatorias
            </Link>
            <Link
              href="/noticias"
              className="block transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Noticias
            </Link>
            <Link
              href="/nosotros"
              className="block transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nuestra Historia
            </Link>
            <Link
              href="/shop"
              className="block transition-colors hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>

            <div className="border-t border-gray-800 pt-4">
              {user ? (
                <>
                  <Link
                    href="/perfil"
                    className="block transition-colors hover:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="mt-2 block transition-colors hover:text-gray-300"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block transition-colors hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ingresar
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
