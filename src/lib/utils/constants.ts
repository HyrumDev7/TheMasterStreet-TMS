/**
 * Constantes globales de la aplicación
 */

export const APP_NAME = 'The Master Street'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Límites de archivos
export const MAX_VIDEO_SIZE_MB = 100
export const MAX_IMAGE_SIZE_MB = 5
export const ALLOWED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'mkv']
export const ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp']

// Storage buckets de Supabase
export const STORAGE_BUCKETS = {
  VIDEOS: 'videos',
  IMAGES: 'images',
  DOCUMENTS: 'documents',
} as const

// Roles de usuario
export const USER_ROLES = {
  COMPETITOR: 'competitor',
  ADMIN: 'admin',
  JUDGE: 'judge',
} as const

// Estados de eventos
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  FINISHED: 'finished',
} as const

// Estados de aplicaciones
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WAITLIST: 'waitlist',
} as const

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const
