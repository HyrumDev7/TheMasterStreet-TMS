import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import styles from './noticias.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Noticias' }

export default async function NoticiasPage() {
  let noticias: Array<{
    id: string
    titulo: string
    slug: string
    extracto: string | null
    imagen_url: string | null
    imagen_x: number
    imagen_y: number
    imagen_escala: number
  }> = []
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('noticias')
      .select('id, titulo, slug, extracto, imagen_url, imagen_x, imagen_y, imagen_escala')
      .eq('publicado', true)
      .order('created_at', { ascending: false })
    noticias = data || []
  } catch {
    noticias = []
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Noticias</h1>
      <div className={styles.grid}>
        {noticias.map((n) => (
          <Link key={n.id} href={`/noticias/${n.slug}`} className={styles.card}>
            <div
              className={styles.cover}
              style={
                n.imagen_url
                  ? {
                      backgroundImage: `url(${n.imagen_url})`,
                      backgroundPosition: `${n.imagen_x}% ${n.imagen_y}%`,
                      backgroundSize: `${n.imagen_escala}%`,
                    }
                  : undefined
              }
            />
            <h2>{n.titulo}</h2>
            {n.extracto ? <p>{n.extracto}</p> : null}
          </Link>
        ))}
      </div>
      {noticias.length === 0 ? <p>Pronto habrá noticias.</p> : null}
    </div>
  )
}
