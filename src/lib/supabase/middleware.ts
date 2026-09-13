import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database'
import { isPublicPath } from '@/lib/auth/publicPaths'

function withCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie))
  return to
}

function editorEmails() {
  return (process.env.CONTENT_EDITOR_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function updateSession(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req: request, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname, search } = request.nextUrl
  const publicRoute = isPublicPath(pathname)

  if (!session && !publicRoute) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('next', `${pathname}${search || ''}`)
    return withCookies(res, NextResponse.redirect(url))
  }

  if (session && (pathname === '/login' || pathname === '/registro')) {
    const next = request.nextUrl.searchParams.get('next')
    const email = session.user.email?.toLowerCase() || ''
    const isEditor = Boolean(email && editorEmails().includes(email))
    const dest =
      next && next.startsWith('/') && !next.startsWith('//')
        ? next
        : isEditor
          ? '/admin'
          : '/'
    return withCookies(res, NextResponse.redirect(new URL(dest, request.url)))
  }

  return res
}
