import { test, expect } from '@playwright/test'

test.describe('Navegación pública', () => {
  test('home carga y muestra hero', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /escribiendo una nueva parte de la historia/i })
    ).toBeVisible()
  })

  test('Sé TMS — formulario visible', async ({ page }) => {
    await page.goto('/ser-tms')
    await expect(page.getByRole('heading', { name: /sé tms/i })).toBeVisible()
    await expect(page.getByLabel(/nombre/i).first()).toBeVisible()
  })

  test('Formulario de inscripción — campos visibles', async ({ page }) => {
    await page.goto('/formulario-inscripcion')
    await expect(
      page.getByRole('heading', { name: /formulario de inscripción/i })
    ).toBeVisible()
    await expect(page.getByLabel(/nombre de organización/i)).toBeVisible()
    await expect(page.getByLabel(/integrantes/i)).toBeVisible()
  })

  test('eventos carga', async ({ page }) => {
    await page.goto('/eventos')
    await expect(page).toHaveURL(/\/eventos/)
  })
})
