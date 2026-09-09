import { requireContentEditor } from '@/lib/cms/roles'
import { NoticiaForm } from '@/components/cms/NoticiaForm'
import styles from '../../admin.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Nueva noticia' }

export default async function NuevaNoticiaPage() {
  await requireContentEditor()
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Nueva noticia</h1>
      <NoticiaForm />
    </div>
  )
}
