-- Formulario Sé TMS: comprobante de pago obligatorio y RUT irrepetible.
-- Aplicable en Supabase local (supabase db reset / supabase start) o remoto (supabase db push).

-- Tabla nueva (si no existe)
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

-- Si la tabla ya existía sin estas columnas, añadirlas (idempotente)
DO $$
BEGIN
  -- comprobante_url: obligatorio para nuevas inscripciones; filas antiguas pueden quedar NULL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ser_tms_postulaciones' AND column_name = 'comprobante_url'
  ) THEN
    ALTER TABLE public.ser_tms_postulaciones ADD COLUMN comprobante_url TEXT;
  END IF;

  -- rut_normalizado: para garantizar RUT irrepetible
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ser_tms_postulaciones' AND column_name = 'rut_normalizado'
  ) THEN
    ALTER TABLE public.ser_tms_postulaciones ADD COLUMN rut_normalizado TEXT;
    UPDATE public.ser_tms_postulaciones
    SET rut_normalizado = UPPER(REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(rut, ''), '\.', '', 'g'), '-', '', 'g'))
    WHERE rut_normalizado IS NULL OR rut_normalizado = '';
    -- Filas sin rut válido: valor único por fila para no romper UNIQUE (inscripciones antiguas)
    UPDATE public.ser_tms_postulaciones SET rut_normalizado = 'LEGACY_' || id WHERE rut_normalizado = '' OR rut_normalizado IS NULL;
    ALTER TABLE public.ser_tms_postulaciones ALTER COLUMN rut_normalizado SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS ser_tms_postulaciones_rut_normalizado_key ON public.ser_tms_postulaciones (rut_normalizado);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN others THEN RAISE;
END $$;

-- RLS
ALTER TABLE public.ser_tms_postulaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert for ser_tms_postulaciones" ON public.ser_tms_postulaciones;
CREATE POLICY "Allow anonymous insert for ser_tms_postulaciones"
  ON public.ser_tms_postulaciones
  FOR INSERT
  TO anon
  WITH CHECK (true);
