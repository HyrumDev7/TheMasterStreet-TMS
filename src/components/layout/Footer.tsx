import Link from 'next/link'
import { Instagram, Youtube, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
          {/* Izquierda: Copyright */}
          <p className="order-2 text-center text-xs uppercase tracking-widest text-zinc-500 md:order-1 md:text-left">
            Todos los derechos reservados
          </p>

          {/* Centro: Nombre */}
          <Link href="/" className="order-1 text-center text-lg font-bold uppercase tracking-tight text-white transition-colors hover:text-red-500 md:order-2">
            The Master Street
          </Link>

          {/* Derecha: Redes sociales */}
          <div className="order-3 flex items-center gap-4">
            <a
              href="https://instagram.com/themasterstreet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-white"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://youtube.com/@themasterstreet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-white"
              aria-label="YouTube"
            >
              <Youtube size={22} />
            </a>
            <a
              href="https://twitter.com/themasterstreet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-white"
              aria-label="Twitter / X"
            >
              <Twitter size={22} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
