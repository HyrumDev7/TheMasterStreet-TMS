import Link from 'next/link'
import { Instagram, Youtube } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={`${styles.root} border-t border-white/10 bg-zinc-950 text-white`}>
      <div className={`${styles.inner} container mx-auto px-4 py-8`}>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
          {/* Izquierda: Copyright */}
          <p className="order-2 text-center text-xs uppercase tracking-widest text-zinc-500 md:order-1 md:text-left">
            Todos los derechos reservados
          </p>

          {/* Centro: Nombre */}
          <Link
            href="/"
            className="order-1 text-center text-lg font-bold uppercase tracking-tight text-white transition-colors hover:text-red-500 md:order-2"
          >
            THE MASTER STREET
          </Link>

          {/* Derecha: Redes sociales */}
          <div className={`${styles.links} order-3 flex items-center gap-4`}>
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
              href="https://x.com/themasterstreet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-white"
              aria-label="X"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
