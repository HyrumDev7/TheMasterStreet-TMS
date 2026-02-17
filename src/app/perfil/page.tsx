import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { User, Ticket, FileText, Video, Settings } from 'lucide-react'
import Card from '@/components/ui/Card'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Mi Perfil | The Master Street',
}

export default async function PerfilPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/perfil')
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Obtener estadísticas
  const { count: aplicacionesCount } = await supabase
    .from('aplicaciones')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_id', user.id)

  const { count: entradasCount } = await supabase
    .from('entradas')
    .select('*, ordenes_compra!inner(usuario_id)', { count: 'exact', head: true })
    .eq('ordenes_compra.usuario_id', user.id)

  const menuItems = [
    {
      href: '/perfil/editar',
      icon: User,
      title: 'Editar Perfil',
      description: 'Actualiza tu información y foto de perfil',
    },
    {
      href: '/perfil/mis-entradas',
      icon: Ticket,
      title: 'Mis Entradas',
      description: `${entradasCount || 0} entradas compradas`,
    },
    {
      href: '/perfil/mis-aplicaciones',
      icon: FileText,
      title: 'Mis Aplicaciones',
      description: `${aplicacionesCount || 0} aplicaciones enviadas`,
    },
    {
      href: '/perfil/videos',
      icon: Video,
      title: 'Mis Videos',
      description: 'Gestiona tus videos de presentación',
    },
  ]

  return (
    <div className={`${styles.root} min-h-screen bg-gray-50 py-12`}>
      <div className="container mx-auto px-4">
        {/* Header del perfil */}
        <Card className="mb-8">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
              {profile?.alias?.[0]?.toUpperCase() || 'U'}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.nombre || 'Usuario'}
              </h1>
              <p className="text-lg text-gray-600">@{profile?.alias || 'alias'}</p>
              {profile?.ciudad && (
                <p className="mt-1 text-sm text-gray-500">{profile.ciudad}</p>
              )}
            </div>

            {/* Acciones */}
            <div className="md:ml-auto">
              <Link
                href="/perfil/editar"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Settings size={16} />
                Editar perfil
              </Link>
            </div>
          </div>

          {/* Biografía */}
          {profile?.biografia && (
            <p className="mt-6 text-gray-600">{profile.biografia}</p>
          )}
        </Card>

        {/* Menú de opciones */}
        <div className="grid gap-4 sm:grid-cols-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <item.icon size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{item.title}</h2>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
