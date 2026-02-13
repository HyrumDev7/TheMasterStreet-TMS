/**
 * Convierte un string a slug (URL-friendly)
 * Ejemplo: "Batalla de Freestyle Marzo 2026" -> "batalla-de-freestyle-marzo-2026"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, '') // Remover caracteres especiales
    .replace(/\-\-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-+/, '') // Remover guiones al inicio
    .replace(/-+$/, '') // Remover guiones al final
}

/**
 * Genera un slug único agregando un número si es necesario
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug
  let counter = 1

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
