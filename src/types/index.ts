/**
 * Tipos compartidos de la aplicación
 */

export type UserRole = 'competitor' | 'admin' | 'judge'
export type UserStatus = 'active' | 'suspended' | 'banned'
export type EventType = 'batalla' | 'workshop' | 'cypher' | 'showcase'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'waitlist'
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'flow' | 'webpay' | 'transbank'
