import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Users, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Convocatorias | The Master Street',
  description: 'Aplica a las convocatorias abiertas para participar en nuestros eventos.',
}

export default async function ConvocatoriasPage() {
  const supabase = createServerClient()

  const { data: convocatorias, error } = await supabase
    .from('convocatorias')
    .select(`
      *,
      eventos (
        id,
        titulo,
        slug,
        fecha_inicio,
        lugar,
        ciudad
      )
    `)
    .eq('estado', 'open')
    .order('fecha_cierre', { ascending: true })

  if (error) {
    console.error('Error al cargar convocatorias:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Convocatorias</h1>
          <p className="mt-4 text-lg text-gray-300">
            ¿Quieres participar? Aplica a nuestras convocatorias abiertas
          </p>
        </div>
      </div>

      {/* Lista de convocatorias */}
      <div className="container mx-auto px-4 py-12">
        {!convocatorias || convocatorias.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">
              No hay convocatorias abiertas en este momento.
            </p>
            <p className="mt-2 text-gray-400">
              Vuelve pronto o síguenos en redes sociales para enterarte de nuevas convocatorias.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {convocatorias.map((convocatoria) => {
              const fechaCierre = new Date(convocatoria.fecha_cierre)
              const diasRestantes = Math.ceil(
                (fechaCierre.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )

              return (
                <article
                  key={convocatoria.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <Badge variant={diasRestantes <= 7 ? 'warning' : 'success'}>
                          {diasRestantes > 0
                            ? `${diasRestantes} días restantes`
                            : 'Cierra hoy'}
                        </Badge>
                      </div>
                    </div>

                    <h2 className="mb-2 text-xl font-bold text-gray-900">
                      {convocatoria.titulo}
                    </h2>

                    {convocatoria.eventos && (
                      <p className="mb-4 text-sm text-gray-500">
                        Para: {convocatoria.eventos.titulo}
                      </p>
                    )}

                    <p className="mb-4 line-clamp-3 text-gray-600">
                      {convocatoria.descripcion}
                    </p>

                    <div className="mb-6 space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Cierre: {formatDate(convocatoria.fecha_cierre, 'long')}</span>
                      </div>
                      {convocatoria.maximo_participantes && (
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>
                            Máximo {convocatoria.maximo_participantes} participantes
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/convocatorias/${convocatoria.id}`}
                      className="inline-block w-full rounded-lg bg-black py-3 text-center font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      Ver detalles y aplicar
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
