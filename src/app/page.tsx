import Image from 'next/image'
import Link from 'next/link'
import {
  CalendarDays,
  Calendar,
  Newspaper,
  ShoppingBag,
  BookOpen,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { CalendarCardControls } from '@/components/calendar/CalendarCardControls'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const CARD_TITLE_CLASS: Record<string, string> = {
  'card-eventos': styles.cardTitleBtnEventos,
  'card-calendario': '', /* estilo aplicado por .cardCalendario .cardTitleBtn */
  'card-noticias': styles.cardTitleBtnNoticias,
  'card-shop': styles.cardTitleBtnShop,
  'card-historia': styles.cardTitleBtnHistoria,
}

const CARD_IMAGES = [
  {
    id: 'card-eventos',
    imgExt: 'png',
    href: '/eventos',
    title: 'PRÓXIMOS EVENTOS',
    tags: ['BATALLAS', 'CYPHERS', 'WORKSHOPS'],
    Icon: CalendarDays,
  },
  {
    id: 'card-calendario',
    imgExt: 'png',
    href: '/eventos',
    title: 'CALENDARIO',
    tags: ['AÑO', 'MES', 'SEMANA'],
    Icon: Calendar,
  },
  {
    id: 'card-noticias',
    imgExt: 'png',
    href: '/noticias',
    title: 'NOTICIAS',
    tags: ['ENTRADAS', 'FREESTYLE', 'CULTURA'],
    Icon: Newspaper,
  },
  {
    id: 'card-shop',
    imgExt: 'png',
    href: '/shop',
    title: 'SHOP',
    tags: ['ROPA', 'ENTRADAS'],
    Icon: ShoppingBag,
  },
  {
    id: 'card-historia',
    imgExt: 'png',
    href: '/nosotros',
    title: 'NUESTRA HISTORIA',
    tags: ['INICIOS', 'MOMENTOS', 'EL EQUIPO', 'SÉ TMS'],
    Icon: BookOpen,
  },
]

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
          style={{ backgroundImage: 'url(/images/hero-home.png)' }}
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
          </div>
          <h1 className={styles.slogan}>
            Escribiendo una nueva parte de la historia
          </h1>
          </div>
        </section>

        {/* Sección de 5 cards (mismo transfondo Hero) */}
        <section className={styles.cardsSection}>
          <div className="container relative mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {CARD_IMAGES.map((card) => {
              const CardIcon = card.Icon
              const isCalendario = card.id === 'card-calendario'
              const imageEl = (
                <div
                  className={styles.cardImage}
                  style={{
                    backgroundImage: `url(/images/${card.id}.${'imgExt' in card ? card.imgExt : 'jpg'})`,
                  }}
                />
              )
              const titleEl = (
                <>
                  {isCalendario && (
                    <CardIcon size={16} className={styles.cardTitleIcon} aria-hidden />
                  )}
                  <span className={styles.cardTitle}>
                    {card.title.split(' ').map((word) => (
                      <span key={word} className={styles.cardTitleLine}>
                        {word}
                      </span>
                    ))}
                    <span className={styles.cardTitleArrow}> →</span>
                  </span>
                </>
              )
              if (isCalendario) {
                return (
                  <div
                    key={card.id}
                    className={`${styles.card} ${styles.cardCalendario}`}
                  >
                    <Link href={card.href} className={styles.cardImageLink} aria-label={card.title}>
                      {imageEl}
                    </Link>
                    <div className={styles.cardBody}>
                      <Link href={card.href} className={`${styles.cardTitleBtn} ${CARD_TITLE_CLASS[card.id] ?? ''}`}>
                        {titleEl}
                      </Link>
                      <CalendarCardControls className={styles.cardTags} />
                    </div>
                  </div>
                )
              }
              return (
                <Link key={card.id} href={card.href} className={styles.card}>
                  {imageEl}
                  <div className={styles.cardBody}>
                    <span className={`${styles.cardTitleBtn} ${CARD_TITLE_CLASS[card.id] ?? ''}`}>
                      {titleEl}
                    </span>
                    <div className={styles.cardTags}>
                      {card.tags.map((tag, i) => (
                        <span
                          key={tag}
                          className={i === 0 ? styles.cardTagLarge : styles.cardTagSmall}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        </section>
      </div>

      {/* Eventos destacados - si hay datos */}
      {eventosDestacados && eventosDestacados.length > 0 && (
        <section className={styles.eventosSection}>
          <div className="container mx-auto px-4">
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
