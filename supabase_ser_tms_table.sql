-- Referencia: esquema de la tabla "Sé TMS" (comprobante obligatorio, RUT irrepetible).
-- Para aplicar en la nube: usa supabase/actualizar_ser_tms_cloud.sql en el SQL Editor del Dashboard.
-- Para local: npx supabase db reset (aplica las migraciones de supabase/migrations/).

CREATE TABLE IF NOT EXISTS public.ser_tms_postulaciones (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  rut TEXT NOT NULL,
  rut_normalizado TEXT NOT NULL,
  aka TEXT NOT NULL,
  ciudad_comuna TEXT NOT NULL,
  edad INTEGER NOT NULL,
  link_video TEXT NOT NULL,
  comprobante_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ser_tms_postulaciones_rut_normalizado_key UNIQUE (rut_normalizado)
);

ALTER TABLE public.ser_tms_postulaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert for ser_tms_postulaciones"
  ON public.ser_tms_postulaciones
  FOR INSERT
  TO anon
  WITH CHECK (true);
