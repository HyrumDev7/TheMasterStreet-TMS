-- =============================================================================
-- TMS — SEGURIDAD EN BASE DE DATOS (único archivo manual para Supabase Cloud)
-- =============================================================================
--
-- CÓMO USAR
--   1. Copia TODO este archivo → Supabase → SQL Editor → Run (Ctrl+Enter).
--   2. Luego: Dashboard → Advisors → Security → Rerun linter.
--
-- ERROR COMÚN (syntax error at or near "IF")
--   En PostgreSQL NO puedes usar IF / BEGIN … END sueltos. Todo bloque condicional
--   debe ir dentro de:  DO $$ BEGIN … END $$;
--   Si guardas solo el interior en el SQL Editor, fallará como en la captura.
--
-- MANTENIMIENTO (organización del proyecto)
--   Cuando un apartado ya esté aplicado y verificado en producción, BORRA ese
--   apartado de este archivo para no repetir DDL. Las migraciones en
--   supabase/migrations/ siguen siendo la historia oficial para CLI/local.
--
-- SIN SQL (solo panel de Supabase)
--   • Leaked password protection: Authentication → Attack Protection → activar.
--     https://supabase.com/docs/guides/auth/password-security
--
-- =============================================================================
-- APARTADO 1 — RLS en tablas public (lint 0013) + políticas mínimas
-- =============================================================================
-- Cubre: profiles, eventos, tipos_entrada, ordenes_compra, entradas,
-- convocatorias, noticias, galeria, equipo, momentos_clave,
-- suscriptores_newsletter, ser_tms_postulaciones, inscripciones_organizacion.
-- API con SUPABASE_SERVICE_ROLE_KEY omite RLS.

-- ---------------------------------------------------------------------------
-- Esquema: profiles.rol (la app y las políticas de admin la usan; añádela si falta)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'rol'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN rol VARCHAR(20) DEFAULT 'competitor';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- profiles: INSERT al registrarse
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles';
    CREATE POLICY "Users can insert own profile" ON public.profiles
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- eventos: público lee publicados; admins gestionan
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'eventos'
  ) THEN
    ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "Public read published eventos" ON public.eventos';
    CREATE POLICY "Public read published eventos" ON public.eventos
      FOR SELECT
      USING (estado = 'published');
    EXECUTE 'DROP POLICY IF EXISTS "Admins select all eventos" ON public.eventos';
    CREATE POLICY "Admins select all eventos" ON public.eventos
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.rol = 'admin'
        )
      );
    EXECUTE 'DROP POLICY IF EXISTS "Admins insert eventos" ON public.eventos';
    CREATE POLICY "Admins insert eventos" ON public.eventos
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.rol = 'admin'
        )
        AND created_by = auth.uid()
      );
    EXECUTE 'DROP POLICY IF EXISTS "Admins update eventos" ON public.eventos';
    CREATE POLICY "Admins update eventos" ON public.eventos
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.rol = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.rol = 'admin'
        )
      );
    EXECUTE 'DROP POLICY IF EXISTS "Admins delete eventos" ON public.eventos';
    CREATE POLICY "Admins delete eventos" ON public.eventos
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.rol = 'admin'
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- tipos_entrada, ordenes_compra, entradas, convocatorias, CMS, newsletter
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'tipos_entrada'
  ) THEN
    ALTER TABLE public.tipos_entrada ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "tipos_entrada_select_published" ON public.tipos_entrada';
    CREATE POLICY "tipos_entrada_select_published" ON public.tipos_entrada
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.eventos e
          WHERE e.id = evento_id AND e.estado = 'published'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ordenes_compra'
  ) THEN
    ALTER TABLE public.ordenes_compra ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "Users select own ordenes" ON public.ordenes_compra';
    CREATE POLICY "Users select own ordenes" ON public.ordenes_compra
      FOR SELECT TO authenticated
      USING (usuario_id = auth.uid());
    EXECUTE 'DROP POLICY IF EXISTS "Users update own pending ordenes" ON public.ordenes_compra';
    CREATE POLICY "Users update own pending ordenes" ON public.ordenes_compra
      FOR UPDATE TO authenticated
      USING (usuario_id = auth.uid() AND estado = 'pending')
      WITH CHECK (usuario_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'entradas'
  ) THEN
    ALTER TABLE public.entradas ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "Users select own entradas" ON public.entradas';
    CREATE POLICY "Users select own entradas" ON public.entradas
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.ordenes_compra o
          WHERE o.id = orden_id AND o.usuario_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'convocatorias'
  ) THEN
    ALTER TABLE public.convocatorias ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "convocatorias_select_public" ON public.convocatorias';
    CREATE POLICY "convocatorias_select_public" ON public.convocatorias
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'noticias'
  ) THEN
    ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "noticias_select_publicadas" ON public.noticias';
    CREATE POLICY "noticias_select_publicadas" ON public.noticias
      FOR SELECT
      USING (publicado = true);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'galeria'
  ) THEN
    ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "galeria_select_public" ON public.galeria';
    CREATE POLICY "galeria_select_public" ON public.galeria
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'equipo'
  ) THEN
    ALTER TABLE public.equipo ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "equipo_select_public" ON public.equipo';
    CREATE POLICY "equipo_select_public" ON public.equipo
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'momentos_clave'
  ) THEN
    ALTER TABLE public.momentos_clave ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "momentos_clave_select_public" ON public.momentos_clave';
    CREATE POLICY "momentos_clave_select_public" ON public.momentos_clave
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'suscriptores_newsletter'
  ) THEN
    ALTER TABLE public.suscriptores_newsletter ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Formularios SÉ TMS / organización: sin INSERT directo anon; API usa service role
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ser_tms_postulaciones'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow anonymous insert for ser_tms_postulaciones" ON public.ser_tms_postulaciones';
    EXECUTE 'DROP POLICY IF EXISTS "ser_tms_postulaciones_no_direct_access" ON public.ser_tms_postulaciones';
    EXECUTE $p$
      CREATE POLICY "ser_tms_postulaciones_no_direct_access"
        ON public.ser_tms_postulaciones
        FOR ALL
        TO anon, authenticated
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'inscripciones_organizacion'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow anonymous insert inscripciones_organizacion" ON public.inscripciones_organizacion';
  END IF;
END $$;

-- =============================================================================
-- APARTADO 2 — search_path en funciones (lint 0011)
-- =============================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure::text AS fn
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('update_updated_at_column', 'validar_rut')
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public', r.fn);
  END LOOP;
END $$;
