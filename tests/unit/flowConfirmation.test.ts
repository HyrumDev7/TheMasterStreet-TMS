import { describe, it, expect } from 'vitest'
import { parseFlowConfirmationToken } from '@/lib/payments/flowConfirmation'
import { flowStatusToOrderEstado } from '@/lib/payments/flow'

describe('parseFlowConfirmationToken', () => {
  it('lee token desde POST application/x-www-form-urlencoded (Flow oficial)', async () => {
    const req = new Request('http://localhost/api/pagos/flow/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: 'token=TOK_ABC_123',
    })
    await expect(parseFlowConfirmationToken(req)).resolves.toBe('TOK_ABC_123')
  })

  it('lee token numérico como string', async () => {
    const req = new Request('http://localhost/api/pagos/flow/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 123187565538192 }),
    })
    await expect(parseFlowConfirmationToken(req)).resolves.toBe('123187565538192')
  })

  it('acepta JSON con token string', async () => {
    const req = new Request('http://localhost/api/pagos/flow/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'json-token' }),
    })
    await expect(parseFlowConfirmationToken(req)).resolves.toBe('json-token')
  })
})

describe('flowStatusToOrderEstado', () => {
  it('mapea estados según documentación Flow', () => {
    expect(flowStatusToOrderEstado(1)).toBe('pending')
    expect(flowStatusToOrderEstado(2)).toBe('paid')
    expect(flowStatusToOrderEstado(3)).toBe('failed')
    expect(flowStatusToOrderEstado(4)).toBe('failed')
    expect(flowStatusToOrderEstado(99)).toBe('failed')
  })
})
