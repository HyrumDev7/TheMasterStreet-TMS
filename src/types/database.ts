/**
 * Tipos de base de datos generados desde Supabase
 * 
 * NOTA: Este archivo debe ser regenerado después de crear el schema en Supabase
 * usando el comando:
 * npx supabase gen types typescript --project-id your-project-ref > src/types/database.ts
 * 
 * Por ahora, definimos tipos básicos basados en el schema SQL proporcionado
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nombre: string
          rut: string
          alias: string
          email: string
          telefono: string | null
          fecha_nacimiento: string | null
          ciudad: string | null
          biografia: string | null
          foto_perfil_url: string | null
          video_presentacion_url: string | null
          instagram: string | null
          youtube: string | null
          spotify: string | null
          rol: 'competitor' | 'admin' | 'judge'
          estado: 'active' | 'suspended' | 'banned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nombre: string
          rut: string
          alias: string
          email: string
          telefono?: string | null
          fecha_nacimiento?: string | null
          ciudad?: string | null
          biografia?: string | null
          foto_perfil_url?: string | null
          video_presentacion_url?: string | null
          instagram?: string | null
          youtube?: string | null
          spotify?: string | null
          rol?: 'competitor' | 'admin' | 'judge'
          estado?: 'active' | 'suspended' | 'banned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          rut?: string
          alias?: string
          email?: string
          telefono?: string | null
          fecha_nacimiento?: string | null
          ciudad?: string | null
          biografia?: string | null
          foto_perfil_url?: string | null
          video_presentacion_url?: string | null
          instagram?: string | null
          youtube?: string | null
          spotify?: string | null
          rol?: 'competitor' | 'admin' | 'judge'
          estado?: 'active' | 'suspended' | 'banned'
          created_at?: string
          updated_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          slug: string
          descripcion: string
          descripcion_corta: string | null
          tipo: 'batalla' | 'workshop' | 'cypher' | 'showcase'
          fecha_inicio: string
          fecha_fin: string | null
          lugar: string
          direccion: string | null
          ciudad: string
          latitud: number | null
          longitud: number | null
          imagen_portada_url: string | null
          imagen_banner_url: string | null
          aforo_maximo: number | null
          aforo_actual: number
          precio_general: number | null
          precio_vip: number | null
          precio_early_bird: number | null
          requiere_inscripcion: boolean
          fecha_limite_inscripcion: string | null
          estado: 'draft' | 'published' | 'cancelled' | 'finished'
          destacado: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          slug: string
          descripcion: string
          descripcion_corta?: string | null
          tipo: 'batalla' | 'workshop' | 'cypher' | 'showcase'
          fecha_inicio: string
          fecha_fin?: string | null
          lugar: string
          direccion?: string | null
          ciudad?: string
          latitud?: number | null
          longitud?: number | null
          imagen_portada_url?: string | null
          imagen_banner_url?: string | null
          aforo_maximo?: number | null
          aforo_actual?: number
          precio_general?: number | null
          precio_vip?: number | null
          precio_early_bird?: number | null
          requiere_inscripcion?: boolean
          fecha_limite_inscripcion?: string | null
          estado?: 'draft' | 'published' | 'cancelled' | 'finished'
          destacado?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          slug?: string
          descripcion?: string
          descripcion_corta?: string | null
          tipo?: 'batalla' | 'workshop' | 'cypher' | 'showcase'
          fecha_inicio?: string
          fecha_fin?: string | null
          lugar?: string
          direccion?: string | null
          ciudad?: string
          latitud?: number | null
          longitud?: number | null
          imagen_portada_url?: string | null
          imagen_banner_url?: string | null
          aforo_maximo?: number | null
          aforo_actual?: number
          precio_general?: number | null
          precio_vip?: number | null
          precio_early_bird?: number | null
          requiere_inscripcion?: boolean
          fecha_limite_inscripcion?: string | null
          estado?: 'draft' | 'published' | 'cancelled' | 'finished'
          destacado?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Agregar más tablas según sea necesario
      // Por ahora solo incluimos las principales
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
