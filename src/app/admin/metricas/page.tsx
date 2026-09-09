import { requireContentEditor } from '@/lib/cms/roles'
import { MetricsClient } from './MetricsClient'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Métricas' }

export default async function AdminMetricasPage() {
  await requireContentEditor()
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Métricas</h1>
      <p>Visitas de los últimos 30 días (sitio TMS). Acceso completo para editora y administrador.</p>
      {ga ? (
        <p>
          Google Analytics: <a href="https://analytics.google.com/">{ga}</a>
        </p>
      ) : (
        <p>
          Para GA4 (marketing), el administrador agrega <code>NEXT_PUBLIC_GA_MEASUREMENT_ID</code> en Vercel y te invita
          a la propiedad de Analytics.
        </p>
      )}
      <MetricsClient />
    </div>
  )
}
