/**
 * Parser del callback urlConfirmation de Flow.
 * Flow envía POST con Content-Type application/x-www-form-urlencoded y body token=...
 * Se acepta también application/json para pruebas locales.
 *
 * @see https://developers.flow.cl/docs/tutorial-basics/order-confirmation
 * @see https://developers.flow.cl/api (Notificaciones de Flow a su comercio)
 */

export async function parseFlowConfirmationToken(request: Request): Promise<string | null> {
  const contentType = (request.headers.get('content-type') ?? '').toLowerCase()

  if (contentType.includes('application/json')) {
    try {
      const body = (await request.json()) as { token?: unknown }
      return tokenToString(body?.token)
    } catch {
      return null
    }
  }

  if (contentType.includes('multipart/form-data')) {
    try {
      const form = await request.formData()
      return tokenToString(form.get('token'))
    } catch {
      return null
    }
  }

  const raw = await request.text()
  if (!raw?.trim()) return null

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const params = new URLSearchParams(raw)
    const t = params.get('token')
    if (t) return t.trim()
  }

  const fromForm = new URLSearchParams(raw).get('token')
  if (fromForm) return fromForm.trim()

  try {
    const body = JSON.parse(raw) as { token?: unknown }
    return tokenToString(body?.token)
  } catch {
    return null
  }
}

function tokenToString(value: unknown): string | null {
  if (value == null) return null
  const s = String(value).trim()
  return s.length > 0 ? s : null
}
