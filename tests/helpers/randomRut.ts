/**
 * Genera RUT chileno válido (aleatorio) para tests.
 */

function calcularDigitoVerificador(cuerpo: string): string {
  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }
  const resto = suma % 11
  const dvEsperado = 11 - resto
  if (dvEsperado === 11) return '0'
  if (dvEsperado === 10) return 'K'
  return dvEsperado.toString()
}

/** Cuerpo numérico de 7 u 8 dígitos + DV válido */
export function randomValidRutFormatted(): string {
  const len = 7 + Math.floor(Math.random() * 2) // 7 u 8
  let cuerpo = ''
  for (let i = 0; i < len; i++) {
    cuerpo += String(Math.floor(Math.random() * 10))
  }
  if (/^0+$/.test(cuerpo)) cuerpo = '1234567'
  const dv = calcularDigitoVerificador(cuerpo)
  return `${cuerpo}-${dv}`
}

export function randomString(prefix: string, len = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let s = prefix
  for (let i = 0; i < len; i++) {
    s += chars[Math.floor(Math.random() * chars.length)]
  }
  return s
}
