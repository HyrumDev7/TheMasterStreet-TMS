import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/ui/Button'

/** Test de componente (UI) — entorno jsdom */
describe('Button (componente)', () => {
  it('renderiza y responde al click', () => {
    let clicked = false
    render(
      <Button type="button" onClick={() => { clicked = true }}>
        Acción TMS
      </Button>
    )
    const btn = screen.getByRole('button', { name: /acción tms/i })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(clicked).toBe(true)
  })
})
