import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const HERO_IMAGE_ID = 'hero-home'
const CARD_IMAGES = [
  {
    id: 'card-eventos',
    href: '/eventos',
    title: 'PRÓXIMOS EVENTOS',
    tags: ['BATALLAS', 'CYPHERS', 'WORKSHOPS'],
  },
  { id: 'card-calendario', href: '/eventos', title: 'CALENDARIO', tags: ['AÑO', 'MES', 'SEMANA'] },
  {
    id: 'card-noticias',
    href: '/noticias',
    title: 'NOTICIAS',
    tags: ['ENTRADAS', 'FREESTYLE', 'CULTURA'],
  },
  { id: 'card-shop', href: '/shop', title: 'SHOP', tags: ['ROPA', 'ENTRADAS'] },
  {
    id: 'card-historia',
    href: '/nosotros',
    title: 'NUESTRA HISTORIA',
    tags: ['INICIOS', 'MOMENTOS', 'EL EQUIPO', 'SÉ TMS'],
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
    <div className="bg-zinc-950 text-white">
      {/* Hero Section - responsive móvil */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-zinc-900 sm:min-h-[80vh] lg:min-h-[85vh]">
        {/* Hero background - insertar hero-home.jpg en public/images/. Ver MEDIDAS_IMAGENES.md */}
        <div
          className="absolute inset-0 bg-zinc-800 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-home.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/50" aria-hidden />
        </div>

        {/* Decorative wave - derecha */}
        <div
          className="absolute right-0 top-0 hidden h-full w-24 border-l border-white/10 md:block"
          aria-hidden
        />

        {/* Contenido centrado - responsive */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* Logo con acento TMAS */}
          <div className="relative mb-4 inline-block sm:mb-6">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl font-black tracking-tighter text-red-600 sm:-top-6 sm:text-3xl md:-top-8 md:text-5xl">
              TMAS
            </span>
            <Link
              href="/"
              className="text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-6xl lg:text-7xl"
            >
              PRÓXIMAMENTE!
            </Link>
          </div>
          <h1 className="text-base font-medium uppercase tracking-widest text-white sm:text-xl md:text-2xl lg:text-3xl">
            Escribiendo una nueva parte de la historia
          </h1>
        </div>
      </section>

      {/* Sección de 5 cards - responsive móvil */}
      <section className="relative bg-zinc-900 py-10 sm:py-16 md:py-24">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3),transparent)] opacity-50"
          aria-hidden
        />
        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {CARD_IMAGES.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-800/80 transition-all hover:border-white/30 hover:bg-zinc-800"
              >
                {/* Imagen de la card - insertar {card.id}.jpg en public/images/. Ver MEDIDAS_IMAGENES.md */}
                <div
                  className="aspect-[4/3] w-full bg-zinc-700 bg-cover bg-center transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url(/images/${card.id}.jpg)` }}
                />
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wide transition-colors group-hover:text-red-500">
                    {card.title} →
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/30 px-2 py-1 text-xs font-medium uppercase tracking-wide text-white/90"
                      >
                        - {tag} -
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos destacados - si hay datos */}
      {eventosDestacados && eventosDestacados.length > 0 && (
        <section className="border-t border-white/10 bg-zinc-950 py-16">
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

      {/* Newsletter */}
      <section className="border-t border-white/10 bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-2 text-2xl font-bold uppercase tracking-tight">Mantente informado</h2>
            <p className="mb-6 text-sm text-zinc-400">
              Suscríbete para recibir noticias sobre eventos, convocatorias y más.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                className="min-h-[44px] rounded-lg border border-white/20 bg-zinc-800 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="min-h-[44px] rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-500"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
