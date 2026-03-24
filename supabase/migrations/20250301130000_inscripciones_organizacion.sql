-- Formulario de inscripción (organizaciones) — Nuestra Historia
CREATE TABLE IF NOT EXISTS public.inscripciones_organizacion (
  id BIGSERIAL PRIMARY KEY,
  nombre_organizacion TEXT NOT NULL,
  integrantes TEXT NOT NULL,
  jurado_oficial TEXT NOT NULL,
  link_red_social TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inscripciones_organizacion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert inscripciones_organizacion" ON public.inscripciones_organizacion;
CREATE POLICY "Allow anonymous insert inscripciones_organizacion"
  ON public.inscripciones_organizacion
  FOR INSERT
  TO anon
  WITH CHECK (true);
