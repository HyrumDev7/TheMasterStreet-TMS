-- Corrige warnings "Function Search Path Mutable" (splinter / Security Advisor).
-- Fija search_path para evitar ataques por resolución de nombres ambigua.
--
-- Warnings de Auth (no son SQL): "Leaked Password Protection Disabled"
-- → Supabase Dashboard → Authentication → Attack Protection
--   → activar "Leaked password protection" (comparación con Have I Been Pwned).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'update_updated_at_column'
      AND pg_get_function_arguments(p.oid) = ''
  ) THEN
    ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'validar_rut'
  ) THEN
    ALTER FUNCTION public.validar_rut(character varying) SET search_path = public;
  END IF;
END $$;
