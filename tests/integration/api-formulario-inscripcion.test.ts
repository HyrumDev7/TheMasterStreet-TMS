import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/formulario-inscripcion/route'
import { createServerClient } from '@/lib/supabase/server'
import { randomFormularioOrganizacionBody } from '../helpers/testData'

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}))

describe('POST /api/formulario-inscripcion', () => {
  const insertMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    insertMock.mockImplementation(() => Promise.resolve({ error: null }))
    vi.mocked(createServerClient).mockReturnValue({
      from: vi.fn(() => ({
        insert: insertMock,
      })),
    } as never)
  })

  it('400 con JSON inválido (campos faltantes)', async () => {
    const res = await POST(
      new Request('http://localhost/api/formulario-inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    )
    expect(res.status).toBe(400)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('200 con cuerpo aleatorio válido y limpia estado del mock tras test', async () => {
    const body = randomFormularioOrganizacionBody()
    const res = await POST(
      new Request('http://localhost/api/formulario-inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      nombre_organizacion: body.nombreOrganizacion,
      integrantes: body.integrantes,
      jurado_oficial: body.juradoOficial,
      link_red_social: body.linkRedSocial,
    })
  })
})
