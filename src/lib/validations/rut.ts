/**
 * Validación de RUT chileno
 * Formato esperado: 12.345.678-9 o 12345678-9
 */

export function validarRut(rut: string): boolean {
  if (!rut || rut.trim().length === 0) {
    return false
  }

  // Remover puntos y guión, convertir a mayúsculas
  const rutLimpio = rut.replace(/[.-]/g, '').toUpperCase()

  // Validar formato básico (debe tener al menos 8 caracteres + 1 dígito verificador)
  if (rutLimpio.length < 8 || rutLimpio.length > 10) {
    return false
  }

  // Extraer cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1)
  const dv = rutLimpio.slice(-1)

  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(cuerpo)) {
    return false
  }

  // Validar que el dígito verificador sea válido (0-9 o K)
  if (!/^[0-9K]$/.test(dv)) {
    return false
  }

  // Calcular dígito verificador esperado
  let suma = 0
  let multiplicador = 2

  // Recorrer el cuerpo de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = suma % 11
  const dvEsperado = 11 - resto

  // Calcular dígito verificador
  let dvCalculado: string
  if (dvEsperado === 11) {
    dvCalculado = '0'
  } else if (dvEsperado === 10) {
    dvCalculado = 'K'
  } else {
    dvCalculado = dvEsperado.toString()
  }

  return dv === dvCalculado
}

/**
 * Formatea un RUT con puntos y guión
 * Ejemplo: 123456789 -> 12.345.678-9
 */
export function formatearRut(rut: string): string {
  if (!rut) return ''

  // Remover caracteres no numéricos excepto K
  const rutLimpio = rut.replace(/[^0-9Kk]/g, '').toUpperCase()

  if (rutLimpio.length === 0) return ''

  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1)
  const dv = rutLimpio.slice(-1)

  // Formatear cuerpo con puntos
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${cuerpoFormateado}-${dv}`
}

/**
 * Limpia un RUT removiendo puntos y guión
 * Ejemplo: 12.345.678-9 -> 123456789
 */
export function limpiarRut(rut: string): string {
  if (!rut) return ''
  return rut.replace(/[.-]/g, '').toUpperCase()
}
