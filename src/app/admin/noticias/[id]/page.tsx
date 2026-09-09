import { requireContentEditor } from '@/lib/cms/roles'
import { NoticiaForm } from '@/components/cms/NoticiaForm'
import styles from '../../../admin.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Editar noticia' }

export default async function EditarNoticiaPage({ params }: { params: { id: string } }) {
  await requireContentEditor()
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Editar noticia</h1>
      <NoticiaForm noticiaId={params.id} />
    </div>
  )
}
