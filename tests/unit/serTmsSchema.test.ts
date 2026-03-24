import { describe, it, expect } from 'vitest'
import { serTmsSchema } from '@/lib/validations/serTms'
import { randomSerTmsJsonBody } from '../helpers/testData'

describe('serTmsSchema', () => {
  it('parsea datos aleatorios válidos', () => {
    for (let i = 0; i < 15; i++) {
      const raw = randomSerTmsJsonBody()
      const parsed = serTmsSchema.safeParse(raw)
      expect(parsed.success, JSON.stringify(parsed)).toBe(true)
    }
  })

  it('rechaza URL de video no permitida', () => {
    const base = randomSerTmsJsonBody()
    const bad = { ...base, linkVideo: 'https://example.com/video' }
    const parsed = serTmsSchema.safeParse(bad)
    expect(parsed.success).toBe(false)
  })

  it('rechaza edad fuera de rango', () => {
    const base = randomSerTmsJsonBody()
    expect(serTmsSchema.safeParse({ ...base, edad: 0 }).success).toBe(false)
    expect(serTmsSchema.safeParse({ ...base, edad: 200 }).success).toBe(false)
  })
})
