-- Ejecuta este SQL en el editor SQL de tu proyecto Supabase
-- (Dashboard → SQL Editor → New query) para crear la tabla del formulario "Sé TMS".

CREATE TABLE IF NOT EXISTS public.ser_tms_postulaciones (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  rut TEXT NOT NULL,
  aka TEXT NOT NULL,
  ciudad_comuna TEXT NOT NULL,
  edad INTEGER NOT NULL,
  link_video TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opcional: habilitar RLS (Row Level Security) y permitir inserts desde el backend
ALTER TABLE public.ser_tms_postulaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert for ser_tms_postulaciones"
  ON public.ser_tms_postulaciones
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Si quieres que solo usuarios autenticados lean las postulaciones:
-- CREATE POLICY "Allow authenticated read" ON public.ser_tms_postulaciones FOR SELECT TO authenticated USING (true);
