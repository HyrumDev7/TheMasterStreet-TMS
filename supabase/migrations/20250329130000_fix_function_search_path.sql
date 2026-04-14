-- Corrige WARN "Function Search Path Mutable" (lint 0011).
-- Aplica a todas las sobrecargas de cada función por nombre.
--
-- Auth (no es SQL): "Leaked Password Protection Disabled"
-- → Supabase Dashboard → Authentication → Attack Protection
--   → activar "Leaked password protection".

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
