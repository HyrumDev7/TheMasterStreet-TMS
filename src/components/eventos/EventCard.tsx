import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import styles from './EventCard.module.css'

interface EventCardProps {
  evento: {
    id: string
    titulo: string
    slug: string
    descripcion_corta?: string | null
    tipo: string
    fecha_inicio: string
    lugar: string
    ciudad: string
    imagen_portada_url?: string | null
    precio_general?: number | null
    destacado: boolean
    aforo_maximo?: number | null
    aforo_actual: number
  }
}

export default function EventCard({ evento }: EventCardProps) {
  const tipoLabels: Record<string, string> = {
    batalla: 'Batalla',
    workshop: 'Workshop',
    cypher: 'Cypher',
    showcase: 'Showcase',
  }

  const tipoVariants: Record<string, 'default' | 'info' | 'success' | 'warning'> = {
    batalla: 'default',
    workshop: 'info',
    cypher: 'success',
    showcase: 'warning',
  }

  const disponibles = evento.aforo_maximo
    ? evento.aforo_maximo - evento.aforo_actual
    : null

  return (
    <Link href={`/eventos/${evento.slug}`}>
      <article className={`${styles.root} group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg`}>
        {/* Imagen */}
        <div className={`${styles.image} relative aspect-video overflow-hidden bg-gray-100`}>
          {evento.imagen_portada_url ? (
            <Image
              src={evento.imagen_portada_url}
              alt={evento.titulo}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-800 to-black">
              <span className="text-2xl font-bold text-white">TMS</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={tipoVariants[evento.tipo] || 'default'}>
              {tipoLabels[evento.tipo] || evento.tipo}
            </Badge>
            {evento.destacado && (
              <Badge variant="warning">Destacado</Badge>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className={`${styles.body} p-4`}>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-gray-700">
            {evento.titulo}
          </h3>

          {evento.descripcion_corta && (
            <p className="mb-3 line-clamp-2 text-sm text-gray-600">
              {evento.descripcion_corta}
            </p>
          )}

          {/* Detalles */}
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(evento.fecha_inicio, 'long')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>
                {evento.lugar}, {evento.ciudad}
              </span>
            </div>
            {disponibles !== null && (
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>
                  {disponibles > 0
                    ? `${disponibles} lugares disponibles`
                    : 'Agotado'}
                </span>
              </div>
            )}
          </div>

          {/* Precio */}
          {evento.precio_general !== null && evento.precio_general !== undefined && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-sm text-gray-500">Desde</span>
              <span className="text-lg font-bold text-black">
                {formatPrice(evento.precio_general)}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
