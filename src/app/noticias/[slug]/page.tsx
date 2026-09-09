import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import styles from '../noticias.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: params.slug }
}

export default async function NoticiaDetallePage({ params }: { params: { slug: string } }) {
  let noticia: {
    titulo: string
    cuerpo: string
    imagen_url: string | null
    imagen_x: number
    imagen_y: number
    imagen_escala: number
  } | null = null
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('noticias')
      .select('*')
      .eq('slug', params.slug)
      .eq('publicado', true)
      .maybeSingle()
    noticia = data
  } catch {
    noticia = null
  }
  if (!noticia) notFound()

  return (
    <article className={styles.page}>
      <h1 className={styles.title}>{noticia.titulo}</h1>
      {noticia.imagen_url ? (
        <div
          className={styles.hero}
          style={{
            backgroundImage: `url(${noticia.imagen_url})`,
            backgroundPosition: `${noticia.imagen_x}% ${noticia.imagen_y}%`,
            backgroundSize: `${noticia.imagen_escala}%`,
          }}
        />
      ) : null}
      <div className={styles.body}>{noticia.cuerpo}</div>
    </article>
  )
}
