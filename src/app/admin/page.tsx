import Link from 'next/link'
import { requireContentEditor } from '@/lib/cms/roles'
import styles from './admin.module.css'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Contenido' }

export default async function AdminHomePage() {
  const editor = await requireContentEditor()

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Hola, {editor.profile.nombre || editor.profile.alias}</h1>
      <p>
        Esta cuenta es la única autorizada para noticias, imágenes y métricas. El resto de
        registros entra como usuario normal.
      </p>
      <div className={styles.row} style={{ marginTop: '1.25rem' }}>
        <Link href="/admin/noticias" className={styles.btn}>
          Noticias
        </Link>
        <Link href="/admin/paneles" className={styles.btnGhost}>
          Imágenes
        </Link>
        <Link href="/admin/metricas" className={styles.btnGhost}>
          Métricas
        </Link>
      </div>
    </div>
  )
}
