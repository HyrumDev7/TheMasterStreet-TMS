import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

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

async function emailInAllowlist(email: string): Promise<boolean> {
  try {
    const admin = createAdminClient()
    const { data } = await admin.from('cms_allowlist').select('email')
    const wanted = email.trim().toLowerCase()
    return (data || []).some((row: { email: string }) => row.email.trim().toLowerCase() === wanted)
  } catch {
    return false
  }
}

export async function getContentEditor() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null

  const allowed = isContentEditorEmail(user.email) || (await emailInAllowlist(user.email))
  if (!allowed) return null

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
