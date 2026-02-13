import { createServerClient } from '@/lib/supabase/server'
import EventCard from '@/components/eventos/EventCard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Próximos Eventos | The Master Street',
  description: 'Descubre los próximos eventos de freestyle, batallas, workshops y más.',
}

export default async function EventosPage() {
  const supabase = createServerClient()

  const { data: eventos, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('estado', 'published')
    .gte('fecha_inicio', new Date().toISOString())
    .order('fecha_inicio', { ascending: true })

  if (error) {
    console.error('Error al cargar eventos:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Próximos Eventos</h1>
          <p className="mt-4 text-lg text-gray-300">
            No te pierdas las mejores batallas y eventos de freestyle
          </p>
        </div>
      </div>

      {/* Filtros (placeholder) */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4">
            <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
              <option value="">Todos los tipos</option>
              <option value="batalla">Batallas</option>
              <option value="workshop">Workshops</option>
              <option value="cypher">Cyphers</option>
              <option value="showcase">Showcases</option>
            </select>
            <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
              <option value="">Todas las ciudades</option>
              <option value="concepcion">Concepción</option>
              <option value="santiago">Santiago</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="container mx-auto px-4 py-12">
        {!eventos || eventos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">
              No hay eventos programados por el momento.
            </p>
            <p className="mt-2 text-gray-400">
              Vuelve pronto para ver los próximos eventos.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
