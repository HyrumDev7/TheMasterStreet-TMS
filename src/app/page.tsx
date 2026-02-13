import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import EventCard from '@/components/eventos/EventCard'
import { ArrowRight, Mic, Users, Calendar, Trophy } from 'lucide-react'

export default async function HomePage() {
  const supabase = createServerClient()

  // Obtener eventos destacados
  const { data: eventosDestacados } = await supabase
    .from('eventos')
    .select('*')
    .eq('estado', 'published')
    .eq('destacado', true)
    .gte('fecha_inicio', new Date().toISOString())
    .order('fecha_inicio', { ascending: true })
    .limit(3)

  // Obtener convocatorias abiertas
  const { data: convocatorias } = await supabase
    .from('convocatorias')
    .select('id, titulo')
    .eq('estado', 'open')
    .limit(2)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-black py-24 text-white md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            THE MASTER STREET
          </h1>
          <p className="mb-8 text-xl text-gray-300 md:text-2xl">
            Escribiendo una nueva parte de la historia
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/eventos"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-black transition-colors hover:bg-gray-200"
            >
              Próximos Eventos
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/convocatorias"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              Ver Convocatorias
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Mic className="h-8 w-8 text-gray-700" />
              </div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-gray-600">Eventos realizados</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Users className="h-8 w-8 text-gray-700" />
              </div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-gray-600">Competidores</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Calendar className="h-8 w-8 text-gray-700" />
              </div>
              <div className="text-3xl font-bold">5+</div>
              <div className="text-sm text-gray-600">Años de historia</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Trophy className="h-8 w-8 text-gray-700" />
              </div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-gray-600">Batallas épicas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Destacados */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Próximos Eventos</h2>
            <Link
              href="/eventos"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>

          {eventosDestacados && eventosDestacados.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventosDestacados.map((evento) => (
                <EventCard key={evento.id} evento={evento} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-12 text-center">
              <p className="text-gray-500">
                No hay eventos destacados en este momento.
              </p>
              <Link
                href="/eventos"
                className="mt-4 inline-block text-sm font-medium text-black hover:underline"
              >
                Ver todos los eventos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Convocatorias CTA */}
      {convocatorias && convocatorias.length > 0 && (
        <section className="bg-black py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">¿Quieres participar?</h2>
            <p className="mb-8 text-lg text-gray-300">
              Hay {convocatorias.length} convocatoria{convocatorias.length > 1 ? 's' : ''} abierta{convocatorias.length > 1 ? 's' : ''}
            </p>
            <Link
              href="/convocatorias"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-black transition-colors hover:bg-gray-200"
            >
              Ver Convocatorias
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Mantente informado</h2>
            <p className="mb-8 text-gray-600">
              Suscríbete para recibir noticias sobre eventos, convocatorias y más.
            </p>
            <form className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
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
