import { describe, it, expect } from 'vitest'
import { formularioInscripcionOrganizacionSchema } from '@/lib/validations/formularioInscripcionOrganizacion'
import { randomFormularioOrganizacionBody } from '../helpers/testData'

describe('formularioInscripcionOrganizacionSchema', () => {
  it('parsea datos aleatorios válidos', () => {
    for (let i = 0; i < 15; i++) {
      const raw = randomFormularioOrganizacionBody()
      const parsed = formularioInscripcionOrganizacionSchema.safeParse(raw)
      expect(parsed.success, JSON.stringify(parsed)).toBe(true)
    }
  })

  it('rechaza integrantes cortos', () => {
    const base = randomFormularioOrganizacionBody()
    const parsed = formularioInscripcionOrganizacionSchema.safeParse({
      ...base,
      integrantes: 'corto',
    })
    expect(parsed.success).toBe(false)
  })

  it('rechaza URL inválida', () => {
    const base = randomFormularioOrganizacionBody()
    const parsed = formularioInscripcionOrganizacionSchema.safeParse({
      ...base,
      linkRedSocial: 'no-es-url',
    })
    expect(parsed.success).toBe(false)
  })
})
