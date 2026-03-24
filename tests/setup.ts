import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'

/**
 * Limpieza global: restablece mocks entre tests.
 * Los datos aleatorios en integración no persisten (mocks de Supabase).
 */
afterEach(() => {
  vi.clearAllMocks()
})
