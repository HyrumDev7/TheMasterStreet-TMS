import Image from 'next/image'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { HomeCardsOrCarousel } from '@/components/home/HomeCardsOrCarousel'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createServerClient()
  const { data: eventosDestacados } = await supabase
    .from('eventos')
    .select('*')
    .eq('estado', 'published')
    .eq('destacado', true)
    .gte('fecha_inicio', new Date().toISOString())
    .order('fecha_inicio', { ascending: true })
    .limit(3)

  return (
    <div className={styles.root}>
      {/* Hero + Cards: imagen de fondo unificada que ocupa todo el transfondo */}
      <div className={styles.heroAndCardsWrap}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: 'url(/images/hero-definitivo.png)' }}
        >
          <div className={styles.heroBgOverlay} aria-hidden />
        </div>
        <div className={styles.heroBgWave} aria-hidden />
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.logoWrap}>
              <Link href="/" className="block" aria-label="The Master Street - Inicio">
                <Image
                  src="/images/logo-tmas.png"
                  alt="The Master Street"
                  width={920}
                  height={345}
                  className={styles.logoImage}
                  priority
                />
              </Link>
              <h1 className={styles.slogan}>
                Escribiendo una nueva parte de la historia
              </h1>
            </div>
          </div>
        </section>

        {/* Carrusel (por defecto) o 5 cards al hacer click en Menú */}
        <HomeCardsOrCarousel />
      </div>

      {/* Eventos destacados - si hay datos */}
      {eventosDestacados && eventosDestacados.length > 0 && (
        <section className={styles.eventosSection}>
          <div className={styles.eventosContainer}>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Próximos Eventos</h2>
              <Link
                href="/eventos"
                className="text-sm font-medium uppercase tracking-wide text-red-500 transition-colors hover:text-red-400"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventosDestacados.map(
                (evento: { id: string; slug?: string; titulo?: string; lugar?: string }) => (
                  <Link
                    key={evento.id}
                    href={`/eventos/${evento.slug ?? evento.id}`}
                    className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition-all hover:border-white/20"
                  >
                    <div className="aspect-video w-full bg-zinc-800" />
                    <div className="p-4">
                      <h3 className="font-bold">{evento.titulo}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{evento.lugar}</p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
