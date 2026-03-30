import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/ser-tms/route'
import { createAdminClient } from '@/lib/supabase/admin'
import { createFakeComprobantePdf, randomSerTmsJsonBody } from '../helpers/testData'

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}))

function buildSerTmsSupabaseMock(opts?: { existenteId?: number }) {
  const mockSingle = vi.fn().mockResolvedValue(
    opts?.existenteId != null
      ? { data: { id: opts.existenteId } }
      : { data: null }
  )
  const mockInsert = vi.fn().mockImplementation(() => Promise.resolve({ error: null }))
  const mockUpload = vi.fn().mockResolvedValue({ error: null })
  const mockGetPublicUrl = vi.fn().mockReturnValue({
    data: { publicUrl: 'https://test.local/storage/doc.pdf' },
  })

  const tableChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: mockSingle,
    insert: mockInsert,
  }

  return {
    client: {
      from: vi.fn(() => tableChain),
      storage: {
        from: vi.fn(() => ({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        })),
      },
    },
    mockSingle,
    mockInsert,
    mockUpload,
  }
}

describe('POST /api/ser-tms', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('400 si falta comprobante (solo campos de texto aleatorios)', async () => {
    const data = randomSerTmsJsonBody()
    const fd = new FormData()
    fd.set('nombre', data.nombre)
    fd.set('apellidos', data.apellidos)
    fd.set('rut', data.rut)
    fd.set('aka', data.aka)
    fd.set('ciudadComuna', data.ciudadComuna)
    fd.set('edad', String(data.edad))
    fd.set('linkVideo', data.linkVideo)

    const { client } = buildSerTmsSupabaseMock()
    vi.mocked(createAdminClient).mockReturnValue(client as never)

    const res = await POST(
      new Request('http://localhost/api/ser-tms', { method: 'POST', body: fd })
    )
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/comprobante/i)
  })

  it('400 si RUT ya inscrito (mock)', async () => {
    const data = randomSerTmsJsonBody()
    const fd = new FormData()
    fd.set('nombre', data.nombre)
    fd.set('apellidos', data.apellidos)
    fd.set('rut', data.rut)
    fd.set('aka', data.aka)
    fd.set('ciudadComuna', data.ciudadComuna)
    fd.set('edad', String(data.edad))
    fd.set('linkVideo', data.linkVideo)
    fd.set('comprobante', createFakeComprobantePdf())

    const { client } = buildSerTmsSupabaseMock({ existenteId: 999 })
    vi.mocked(createAdminClient).mockReturnValue(client as never)

    const res = await POST(
      new Request('http://localhost/api/ser-tms', { method: 'POST', body: fd })
    )
    expect(res.status).toBe(400)
  })

  it('200 con FormData aleatorio y comprobante PDF simulado', async () => {
    const data = randomSerTmsJsonBody()
    const fd = new FormData()
    fd.set('nombre', data.nombre)
    fd.set('apellidos', data.apellidos)
    fd.set('rut', data.rut)
    fd.set('aka', data.aka)
    fd.set('ciudadComuna', data.ciudadComuna)
    fd.set('edad', String(data.edad))
    fd.set('linkVideo', data.linkVideo)
    fd.set('comprobante', createFakeComprobantePdf())

    const { client, mockInsert, mockUpload } = buildSerTmsSupabaseMock()
    vi.mocked(createAdminClient).mockReturnValue(client as never)

    const res = await POST(
      new Request('http://localhost/api/ser-tms', { method: 'POST', body: fd })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUpload).toHaveBeenCalled()
    expect(mockInsert).toHaveBeenCalled()
  })
})
