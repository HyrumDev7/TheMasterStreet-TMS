import crypto from 'crypto';
import axios from 'axios';

const FLOW_API_URL = process.env.FLOW_API_URL!;
const FLOW_API_KEY = process.env.FLOW_API_KEY!;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY!;

// Firma HMAC-SHA256 exactamente como Flow documenta:
// concatenar key+value de TODOS los params ordenados alfabéticamente, sin separadores
function signParams(params: Record<string, string>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join('');
  return crypto.createHmac('sha256', FLOW_SECRET_KEY).update(sorted).digest('hex');
}

export interface CreatePaymentParams {
  amount: number;
  commerceOrder: string; // debe ser orden.id (UUID)
  email: string;
  subject: string;
  urlConfirmation: string;
  urlReturn: string;
}

export interface FlowPaymentResponse {
  token: string;
  url: string;
  flowOrder: number;
}

export async function createPayment(p: CreatePaymentParams): Promise<FlowPaymentResponse> {
  const params: Record<string, string> = {
    apiKey: FLOW_API_KEY,
    amount: String(p.amount),
    commerceOrder: p.commerceOrder,
    currency: 'CLP',
    email: p.email,
    subject: p.subject,
    urlConfirmation: p.urlConfirmation,
    urlReturn: p.urlReturn,
  };

  params.s = signParams(params);

  // CRÍTICO: Flow exige application/x-www-form-urlencoded, NO JSON
  const body = new URLSearchParams(params).toString();

  const { data } = await axios.post(`${FLOW_API_URL}/payment/create`, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return data;
}

export interface FlowPaymentStatus {
  flowOrder: number;
  commerceOrder: string;
  requestDate: string;
  status: number; // 1=pendiente 2=pagado 3=rechazado 4=anulado
  subject: string;
  currency: string;
  amount: number;
  payer: string;
  optional?: Record<string, string>;
  pendingInfo?: { media: string; date: string; amount: number };
  paymentData?: { date: string; media: string; conversionRate: number };
  merchantId?: string;
}

export async function getPaymentStatus(token: string): Promise<FlowPaymentStatus> {
  const params: Record<string, string> = {
    apiKey: FLOW_API_KEY,
    token,
  };
  params.s = signParams(params);

  const { data } = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params });
  return data;
}