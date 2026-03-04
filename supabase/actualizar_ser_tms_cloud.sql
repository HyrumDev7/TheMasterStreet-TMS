-- =============================================================================
-- ACTUALIZAR BASE DE DATOS SÉ TMS (Supabase en la nube)
-- Ejecuta este archivo en: Dashboard → SQL Editor → New query
-- Requisitos: comprobante de pago obligatorio, todos los campos obligatorios,
--             RUT irrepetible (una inscripción por persona).
-- =============================================================================

-- PARTE 1: Tabla ser_tms_postulaciones
-- -----------------------------------------------------------------------------

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

-- Si la tabla ya existía: añadir columnas comprobante_url y rut_normalizado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ser_tms_postulaciones' AND column_name = 'comprobante_url'
  ) THEN
    ALTER TABLE public.ser_tms_postulaciones ADD COLUMN comprobante_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ser_tms_postulaciones' AND column_name = 'rut_normalizado'
  ) THEN
    ALTER TABLE public.ser_tms_postulaciones ADD COLUMN rut_normalizado TEXT;
    UPDATE public.ser_tms_postulaciones
    SET rut_normalizado = UPPER(REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(rut, ''), '\.', '', 'g'), '-', '', 'g'))
    WHERE rut_normalizado IS NULL OR rut_normalizado = '';
    UPDATE public.ser_tms_postulaciones SET rut_normalizado = 'LEGACY_' || id WHERE rut_normalizado = '' OR rut_normalizado IS NULL;
    ALTER TABLE public.ser_tms_postulaciones ALTER COLUMN rut_normalizado SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS ser_tms_postulaciones_rut_normalizado_key ON public.ser_tms_postulaciones (rut_normalizado);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN others THEN RAISE;
END $$;

ALTER TABLE public.ser_tms_postulaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert for ser_tms_postulaciones" ON public.ser_tms_postulaciones;
CREATE POLICY "Allow anonymous insert for ser_tms_postulaciones"
  ON public.ser_tms_postulaciones
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- PARTE 2: Storage (bucket documents para comprobantes)
-- -----------------------------------------------------------------------------
-- Ejecuta esta parte en la misma sesión o en una segunda query si falla.

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow anon upload ser-tms comprobantes" ON storage.objects;
CREATE POLICY "Allow anon upload ser-tms comprobantes"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = 'ser-tms-comprobantes'
  );

DROP POLICY IF EXISTS "Allow public read documents" ON storage.objects;
CREATE POLICY "Allow public read documents"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'documents');
