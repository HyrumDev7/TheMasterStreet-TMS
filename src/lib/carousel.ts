/**
 * Estándar global del carrusel de la home.
 * Todas las imágenes del carrusel deben usar esta medida para que Next.js
 * y el CSS (aspect-ratio) funcionen de forma óptima.
 */

/** Ancho estándar de cada imagen del carrusel (px) */
export const CAROUSEL_IMAGE_WIDTH = 1920

/** Alto estándar de cada imagen del carrusel (px) – proporción 32:9 */
export const CAROUSEL_IMAGE_HEIGHT = 540

/** Proporción del carrusel (ancho : alto) */
export const CAROUSEL_ASPECT_RATIO = 32 / 9

/** Nombres de archivo en /public/images/ */
export const CAROUSEL_IMAGE_FILES = [
  'carrusel-1.jpg',
  'carrusel-2.jpg',
  'carrusel-3.jpg',
] as const

/** Duración de cada slide en segundos */
export const CAROUSEL_SLIDE_DURATION_SEC = 5
