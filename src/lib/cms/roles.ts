import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

/** Emails autorizados para noticias, imágenes y métricas. Nunca se elige en un formulario. */
export function contentEditorEmails(): string[] {
  return (process.env.CONTENT_EDITOR_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isContentEditorEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return contentEditorEmails().includes(email.trim().toLowerCase())
}

export async function getContentEditor() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email || !isContentEditorEmail(user.email)) return null

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('id, email, nombre, alias, rol, estado')
    .eq('id', user.id)
    .maybeSingle()

  if (profile && (profile.estado === 'suspended' || profile.estado === 'banned')) {
    return null
  }

  return {
    user,
    profile: profile || {
      id: user.id,
      email: user.email,
      nombre: '',
      alias: '',
      rol: 'editor',
      estado: 'active',
    },
  }
}

export async function requireContentEditor() {
  const editor = await getContentEditor()
  if (editor) return editor
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  redirect(user ? '/' : '/login?next=/admin')
}
