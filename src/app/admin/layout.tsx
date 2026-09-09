import Link from 'next/link'
import { getContentEditor } from '@/lib/cms/roles'
import styles from './admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AdminNav />
      {children}
    </div>
  )
}

async function AdminNav() {
  const editor = await getContentEditor()
  if (!editor) return null
  return (
    <nav className={styles.nav} aria-label="Contenido">
      <Link href="/admin">Inicio</Link>
      <Link href="/admin/noticias">Noticias</Link>
      <Link href="/admin/paneles">Imágenes</Link>
      <Link href="/admin/metricas">Métricas</Link>
      <Link href="/">Ver sitio</Link>
    </nav>
  )
}
