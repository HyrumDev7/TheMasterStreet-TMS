import { NextResponse } from 'next/server'
import { getContentEditor } from '@/lib/cms/roles'

export const dynamic = 'force-dynamic'

export async function GET() {
  const editor = await getContentEditor()
  if (!editor) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  return NextResponse.json({ ok: true, rol: editor.profile.rol })
}
