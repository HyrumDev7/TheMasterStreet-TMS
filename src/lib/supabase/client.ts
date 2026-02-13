import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

/**
 * Cliente de Supabase para uso en componentes del cliente (browser)
 * Este cliente se usa en componentes con 'use client'
 */
export const supabase = createClientComponentClient<Database>()
