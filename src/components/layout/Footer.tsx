import Link from 'next/link'
import { Instagram, Youtube, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo y descripción */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-xl font-bold">THE MASTER STREET</h3>
            <p className="text-sm text-gray-400">
              Escribiendo una nueva parte de la historia del freestyle en Chile.
            </p>
            {/* Redes sociales */}
            <div className="mt-4 flex space-x-4">
              <a
                href="https://instagram.com/themasterstreet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://youtube.com/@themasterstreet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
              <a
                href="https://twitter.com/themasterstreet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="mb-4 font-semibold">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/eventos" className="transition-colors hover:text-white">
                  Próximos Eventos
                </Link>
              </li>
              <li>
                <Link href="/convocatorias" className="transition-colors hover:text-white">
                  Convocatorias
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="transition-colors hover:text-white">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="transition-colors hover:text-white">
                  Nuestra Historia
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacidad" className="transition-colors hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="transition-colors hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/reembolsos" className="transition-colors hover:text-white">
                  Política de Reembolsos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="mb-4 font-semibold">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <a
                  href="mailto:contacto@masterstreet.cl"
                  className="transition-colors hover:text-white"
                >
                  contacto@masterstreet.cl
                </a>
              </li>
              <li>Concepción, Chile</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} The Master Street. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
