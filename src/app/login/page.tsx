import { Suspense } from 'react'
import LoginForm from './LoginForm'
import styles from '@/app/admin/admin.module.css'

export const metadata = { title: 'Iniciar sesión' }

export default function LoginPage() {
  return (
    <div className={styles.shell} style={{ paddingTop: '6rem' }}>
      <Suspense fallback={<p>Cargando…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
