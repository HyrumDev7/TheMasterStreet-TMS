import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/ser-tms/checkout/route'
import { createAdminClient } from '@/lib/supabase/admin'
import * as flow from '@/lib/payments/flow'
import { randomSerTmsJsonBody } from '../helpers/testData'

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}))

vi.mock('@/lib/payments/flow', () => ({
  createPayment: vi.fn(),
}))

function buildCheckoutMock(opts?: { yaInscrito?: boolean; ordenId?: string }) {
  const ordenId = opts?.ordenId ?? 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
  const mockMaybeSingle = vi.fn().mockResolvedValue(
    opts?.yaInscrito ? { data: { id: 1 } } : { data: null }
  )
  const mockInsert = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { id: ordenId }, error: null }),
    }),
  })
  const mockUpdate = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: null }),
  })

  return {
    client: {
      from: vi.fn((table: string) => {
        if (table === 'ser_tms_postulaciones') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: mockMaybeSingle,
          }
        }
        if (table === 'ordenes_compra') {
          return {
            insert: mockInsert,
            update: mockUpdate,
          }
        }
        return {}
      }),
    },
    mockInsert,
    ordenId,
  }
}

describe('POST /api/ser-tms/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('400 si el cuerpo no es checkout válido', async () => {
    const { client } = buildCheckoutMock()
    vi.mocked(createAdminClient).mockReturnValue(client as never)

    const res = await POST(
      new Request('http://localhost/api/ser-tms/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    )
    expect(res.status).toBe(400)
  })

  it('400 si el RUT ya tiene inscripción', async () => {
    const data = randomSerTmsJsonBody()
    const { client } = buildCheckoutMock({ yaInscrito: true })
    vi.mocked(createAdminClient).mockReturnValue(client as never)

    const res = await POST(
      new Request('http://localhost/api/ser-tms/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    )
    expect(res.status).toBe(400)
  })

  it('200 Flow devuelve redirectUrl', async () => {
    const data = randomSerTmsJsonBody()
    const { client, ordenId } = buildCheckoutMock({ ordenId: '11111111-2222-3333-4444-555555555555' })
    vi.mocked(createAdminClient).mockReturnValue(client as never)
    vi.mocked(flow.createPayment).mockResolvedValue({
      token: 'flow-token',
      url: 'https://flow.test/pay',
    })

    const res = await POST(
      new Request('http://localhost/api/ser-tms/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.redirectUrl).toContain('flow.test')
    expect(json.ordenId).toBe(ordenId)
  })
})
