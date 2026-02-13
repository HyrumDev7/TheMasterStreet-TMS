import axios from 'axios'
import crypto from 'crypto'

const FLOW_API_URL = process.env.FLOW_API_URL || 'https://www.flow.cl/api'
const FLOW_API_KEY = process.env.FLOW_API_KEY
const FLOW_SECRET = process.env.FLOW_SECRET_KEY

if (!FLOW_API_KEY || !FLOW_SECRET) {
  console.warn('Flow API keys no configuradas. Las funciones de pago no funcionarán.')
}

/**
 * Genera la firma para las peticiones a Flow
 */
function generateSignature(params: Record<string, any>): string {
  if (!FLOW_SECRET) {
    throw new Error('FLOW_SECRET_KEY no configurada')
  }

  const keys = Object.keys(params).sort()
  const data = keys.map((key) => `${key}${params[key]}`).join('')
  return crypto.createHmac('sha256', FLOW_SECRET).update(data).digest('hex')
}

export interface CreatePaymentParams {
  amount: number
  commerceOrder: string
  email: string
  subject: string
  urlConfirmation: string
  urlReturn: string
}

export interface PaymentResponse {
  token: string
  url: string
}

/**
 * Crea un pago en Flow
 */
export async function createPayment(
  data: CreatePaymentParams
): Promise<PaymentResponse> {
  if (!FLOW_API_KEY || !FLOW_SECRET) {
    throw new Error('Flow API keys no configuradas')
  }

  const params = {
    apiKey: FLOW_API_KEY,
    amount: data.amount,
    commerceOrder: data.commerceOrder,
    currency: 'CLP',
    email: data.email,
    subject: data.subject,
    urlConfirmation: data.urlConfirmation,
    urlReturn: data.urlReturn,
  }

  const signature = generateSignature(params)

  try {
    const response = await axios.post(
      `${FLOW_API_URL}/payment/create`,
      { ...params, s: signature },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.data.token && response.data.url) {
      return {
        token: response.data.token,
        url: response.data.url,
      }
    }

    throw new Error('Respuesta inválida de Flow')
  } catch (error: any) {
    console.error('Error al crear pago en Flow:', error)
    if (error.response) {
      throw new Error(
        `Error de Flow: ${error.response.data?.message || error.response.statusText}`
      )
    }
    throw new Error('Error al comunicarse con Flow')
  }
}

export interface PaymentStatus {
  status: number
  statusText: string
  amount: number
  currency: string
  commerceOrder: string
  pendingReason?: string
}

/**
 * Obtiene el estado de un pago en Flow
 */
export async function getPaymentStatus(token: string): Promise<PaymentStatus> {
  if (!FLOW_API_KEY || !FLOW_SECRET) {
    throw new Error('Flow API keys no configuradas')
  }

  const params = {
    apiKey: FLOW_API_KEY,
    token,
  }

  const signature = generateSignature(params)

  try {
    const response = await axios.get(`${FLOW_API_URL}/payment/getStatus`, {
      params: { ...params, s: signature },
    })

    return response.data
  } catch (error: any) {
    console.error('Error al obtener estado de pago:', error)
    if (error.response) {
      throw new Error(
        `Error de Flow: ${error.response.data?.message || error.response.statusText}`
      )
    }
    throw new Error('Error al comunicarse con Flow')
  }
}
