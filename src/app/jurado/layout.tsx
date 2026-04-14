import Link from 'next/link'
import styles from './jurado-disabled.module.css'

export default function JuradoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (process.env.JURADO_LOGIN_ENABLED !== 'true') {
    return (
      <main className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Acceso jurado</h1>
          <p className={styles.text}>
            El acceso para jurados está deshabilitado temporalmente.
          </p>
          <Link href="/" className={styles.link}>
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
