import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'PROXIMAMENTE! - Escribiendo una nueva parte de la historia',
  description:
    'Plataforma oficial de The Master Street. Batallas de freestyle, workshops, cyphers y más.',
  keywords: 'freestyle, rap, batalla, hip hop, chile, concepción',
  openGraph: {
    title: 'PRÓXIMAMENTE!',
    description: 'Próximamente ..Escribiendo una nueva parte de la historia del freestyle',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        <Header />
        <main className="min-h-screen bg-zinc-950 text-white">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
