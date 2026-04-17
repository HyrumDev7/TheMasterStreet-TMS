/**
 * Verifica que FLOW_API_KEY + FLOW_SECRET_KEY funcionen con la API de Flow
 * (crea una orden de prueba y muestra la URL del checkout; no completa el pago).
 *
 * Uso: node --env-file=.env.local scripts/flow-diagnostico.mjs
 */
import crypto from 'crypto'
import axios from 'axios'

const FLOW_API_URL = (process.env.FLOW_API_URL || 'https://www.flow.cl/api').replace(/\/$/, '')
const FLOW_API_KEY = process.env.FLOW_API_KEY
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
const FLOW_TEST_EMAIL = process.env.FLOW_TEST_EMAIL || process.env.DIAG_TEST_EMAIL

function generateSignature(params) {
  const keys = Object.keys(params).sort()
  const data = keys.map((k) => `${k}${params[k]}`).join('')
  return crypto.createHmac('sha256', FLOW_SECRET_KEY).update(data).digest('hex')
}

async function main() {
  console.log('--- Diagnóstico Flow ---')
  console.log('FLOW_API_URL:', FLOW_API_URL)
  console.log('NEXT_PUBLIC_APP_URL (callbacks de prueba):', APP_URL)

  if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
    console.error('\nFalta FLOW_API_KEY o FLOW_SECRET_KEY en .env.local')
    process.exit(1)
  }

  if (!FLOW_TEST_EMAIL) {
    console.error(
      '\nFalta FLOW_TEST_EMAIL (o DIAG_TEST_EMAIL) en .env.local con un correo válido para crear pagos de prueba.'
    )
    process.exit(1)
  }

  if (FLOW_API_URL.includes('sandbox')) {
    console.log('Modo: SANDBOX (sin cobros reales en producción Flow)')
  } else {
    console.log('Modo: PRODUCCIÓN — se creará una orden real en Flow (puedes anularla si no pagas).')
  }

  const commerceOrder = `diag-${Date.now()}`
  const params = {
    apiKey: FLOW_API_KEY,
    amount: 1500,
    commerceOrder,
    currency: 'CLP',
    email: FLOW_TEST_EMAIL,
    subject: 'Diagnóstico TMS (puede ignorarse)',
    urlConfirmation: `${APP_URL}/api/pagos/flow/confirm`,
    urlReturn: `${APP_URL}/ser-tms/pago/exito?ordenId=diag`,
  }

  const signature = generateSignature(params)
  const body = new URLSearchParams()
  for (const [k, v] of Object.entries({ ...params, s: signature })) {
    body.append(k, String(v))
  }

  try {
    const res = await axios.post(`${FLOW_API_URL}/payment/create`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000,
    })
    const { url, token } = res.data || {}
    if (!url || !token) {
      console.error('Respuesta inesperada:', res.data)
      process.exit(1)
    }
    const checkoutUrl = `${url}?token=${token}`
    console.log('\nOK: Flow aceptó la creación del pago.')
    console.log('Orden de prueba (commerceOrder):', commerceOrder)
    console.log('\nAbre esta URL en tu navegador para ver el checkout (opcional):')
    console.log(checkoutUrl)
    console.log('\nSi NO vas a pagar, cierra la pestaña; la orden quedará pendiente.')
    console.log(
      '\nNota: el webhook urlConfirmation solo llegará si Flow puede alcanzar tu dominio público (no localhost salvo túnel).'
    )
  } catch (e) {
    const msg = e.response?.data?.message || e.message
    const status = e.response?.status
    console.error('\nERROR al llamar a Flow:', status || '', msg)
    if (e.response?.data) console.error('Detalle:', JSON.stringify(e.response.data, null, 2))
    process.exit(1)
  }
}

main()
