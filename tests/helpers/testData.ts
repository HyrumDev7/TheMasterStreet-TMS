import { faker } from '@faker-js/faker'
import { randomValidRutFormatted, randomString } from './randomRut'

/** Prefijo para filas insertadas en tests (limpieza en BD opcional) */
export const TEST_DATA_PREFIX = 'TEST_TMS_'

export function randomSerTmsJsonBody() {
  return {
    nombre: `${TEST_DATA_PREFIX}${faker.person.firstName()}`,
    apellidos: faker.person.lastName(),
    rut: randomValidRutFormatted(),
    aka: randomString('aka_', 6),
    ciudadComuna: faker.location.city(),
    edad: faker.number.int({ min: 18, max: 45 }),
    linkVideo: `https://www.youtube.com/watch?v=${faker.string.alphanumeric({ length: 11 })}`,
  }
}

export function randomFormularioOrganizacionBody() {
  return {
    nombreOrganizacion: `${TEST_DATA_PREFIX}${faker.company.name()}`,
    integrantes: faker.lorem.paragraph({ min: 2, max: 4 }),
    juradoOficial: faker.person.fullName(),
    linkRedSocial: `https://instagram.com/${faker.internet.username()}`,
  }
}

/** Archivo simulado para FormData (API ser-tms) */
export function createFakeComprobantePdf(): File {
  const buf = new Uint8Array(64)
  for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256)
  return new File([buf], `comprobante_${randomString('', 6)}.pdf`, {
    type: 'application/pdf',
  })
}
