-- RLS en ser_tms_postulaciones: el linter exige al menos una política (lint 0008).
-- Inserciones desde Next.js usan SUPABASE_SERVICE_ROLE_KEY (omite RLS).
-- Esta política bloquea acceso directo vía PostgREST con anon/authenticated.

DROP POLICY IF EXISTS "Allow anonymous insert for ser_tms_postulaciones" ON public.ser_tms_postulaciones;
DROP POLICY IF EXISTS "ser_tms_postulaciones_no_direct_access" ON public.ser_tms_postulaciones;

CREATE POLICY "ser_tms_postulaciones_no_direct_access"
  ON public.ser_tms_postulaciones
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
