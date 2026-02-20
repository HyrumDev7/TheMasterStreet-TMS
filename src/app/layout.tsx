import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { MenuProvider } from '@/contexts/MenuContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import styles from './layout.module.css'
import { APP_URL } from '@/lib/utils/constants'

const inter = Inter({ subsets: ['latin'] })

const baseUrl = APP_URL.replace(/\/$/, '')

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

/** metadataBase hace que Google reciba URLs absolutas del favicon (requisito para que lo muestre en resultados) */
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'TMS',
    template: '%s | TMS',
  },
  description:
    'TMS – The Master Street. Plataforma oficial: batallas de freestyle, workshops, cyphers y más. Escribiendo una nueva parte de la historia.',
  keywords: 'TMS, The Master Street, freestyle, rap, batalla, hip hop, chile, concepción',
  icons: {
    icon: [
      { url: '/images/logo-tmas.png', sizes: '48x48', type: 'image/png' },
      { url: '/images/logo-tmas.png', sizes: '96x96', type: 'image/png' },
      { url: '/images/logo-tmas.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/images/logo-tmas.png',
    apple: '/images/logo-tmas.png',
  },
  openGraph: {
    title: 'TMS – The Master Street',
    description: 'Escribiendo una nueva parte de la historia del freestyle',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${styles.root} ${inter.className} antialiased`}>
        <MenuProvider>
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </MenuProvider>
      </body>
    </html>
  )
}
