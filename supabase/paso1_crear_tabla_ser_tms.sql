-- =============================================================================
-- PASO 1 — Solo crear la tabla SÉ TMS (ejecuta ESTO primero, solo este archivo)
-- Si algo falla después (storage), la tabla ya quedará creada.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ser_tms_postulaciones (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  rut TEXT NOT NULL,
  rut_normalizado TEXT NOT NULL,
  CONSTRAINT ser_tms_postulaciones_rut_formato CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  aka TEXT NOT NULL,
  ciudad_comuna TEXT NOT NULL,
  edad INTEGER NOT NULL,
  link_video TEXT NOT NULL,
  comprobante_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ser_tms_postulaciones_rut_normalizado_key UNIQUE (rut_normalizado)
);

COMMENT ON TABLE public.ser_tms_postulaciones IS 'Inscripciones al formulario SÉ TMS (The Master Street).';

ALTER TABLE public.ser_tms_postulaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert for ser_tms_postulaciones" ON public.ser_tms_postulaciones;

-- Comprobar que existe (debe devolver una fila con el nombre de la tabla):
SELECT to_regclass('public.ser_tms_postulaciones') AS tabla_creada;

-- Si la tabla ya existía antes (constraint viejo), migrar el CHECK del RUT:
-- ALTER TABLE public.ser_tms_postulaciones DROP CONSTRAINT IF EXISTS ser_tms_postulaciones_rut_guion;
-- ALTER TABLE public.ser_tms_postulaciones DROP CONSTRAINT IF EXISTS ser_tms_postulaciones_rut_formato;
-- ALTER TABLE public.ser_tms_postulaciones ADD CONSTRAINT ser_tms_postulaciones_rut_formato CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$');
