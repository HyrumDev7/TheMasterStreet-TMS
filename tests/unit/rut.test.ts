import { describe, it, expect } from 'vitest'
import { validarRut, formatearRut, limpiarRut } from '@/lib/validations/rut'
import { randomValidRutFormatted } from '../helpers/randomRut'

describe('validarRut', () => {
  it('acepta múltiples RUT generados aleatoriamente', () => {
    for (let i = 0; i < 5; i++) {
      expect(validarRut(randomValidRutFormatted())).toBe(true)
    }
  })

  it('rechaza RUT inválidos aleatorios de formato', () => {
    expect(validarRut('')).toBe(false)
    expect(validarRut('abc')).toBe(false)
    expect(validarRut('12.345.678-0')).toBe(false)
  })

  it('acepta RUT generados aleatoriamente con algoritmo válido', () => {
    for (let i = 0; i < 20; i++) {
      const r = randomValidRutFormatted()
      expect(validarRut(r), `falló: ${r}`).toBe(true)
    }
  })
})

describe('formatearRut / limpiarRut', () => {
  it('limpiarRut quita puntos y guión', () => {
    expect(limpiarRut('12.345.678-5')).toBe('123456785')
  })

  it('formatearRut produce string no vacío para entrada numérica', () => {
    const f = formatearRut('123456785')
    expect(f.length).toBeGreaterThan(0)
  })
})
