-- RLS en tablas públicas + políticas mínimas.
-- Rutas API sensibles usan SUPABASE_SERVICE_ROLE_KEY (omite RLS).
-- Si alguna tabla aún no existe en tu proyecto, el bloque correspondiente se omite.
--
-- Cubre los errores del Security Advisor "RLS Disabled in Public" para:
--   tipos_entrada, ordenes_compra, entradas, convocatorias, noticias,
--   galeria, equipo, momentos_clave, suscriptores_newsletter
-- y además profiles / eventos / ser_tms_postulaciones / inscripciones_organizacion.
--
-- Tras ejecutar: Dashboard → Advisors → Security → "Rerun linter".

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
-- eventos: administradores
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'eventos'
  ) THEN
    ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
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

-- ---------------------------------------------------------------------------
-- Formularios: inserts solo vía API con service role (políticas anon retiradas)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ser_tms_postulaciones'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow anonymous insert for ser_tms_postulaciones" ON public.ser_tms_postulaciones';
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
