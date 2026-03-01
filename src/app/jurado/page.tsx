import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Jurado – Evaluación',
}

export default async function JuradoPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <p className={styles.comingSoon}>
          Seguimos trabajando … ¡Se viene Próximamente!!!
        </p>
        <section className={styles.section} aria-labelledby="eval-heading">
          <h2 id="eval-heading" className={styles.heading}>
            Evaluación de participantes
          </h2>
          <p className={styles.description}>
            Espacio para la evaluación de participantes aptos para el freestyle.
            Próximamente podrás revisar y calificar las postulaciones de cada
            clasificatoria.
          </p>
        </section>
        <Link href="/" className={styles.back}>
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
