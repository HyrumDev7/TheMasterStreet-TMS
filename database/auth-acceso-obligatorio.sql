-- Acceso obligatorio + lista blanca de editora (Stephanie).
-- Supabase → SQL Editor → Run (se puede ejecutar más de una vez).

CREATE TABLE IF NOT EXISTS cms_allowlist (
  email TEXT PRIMARY KEY
);

ALTER TABLE cms_allowlist ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_content_editor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN cms_allowlist a ON lower(a.email) = lower(u.email::text)
    LEFT JOIN profiles p ON p.id = u.id
    WHERE u.id = auth.uid()
      AND COALESCE(p.estado, 'active') NOT IN ('suspended', 'banned')
  );
$$;

CREATE OR REPLACE FUNCTION profiles_force_competitor_rol()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    IF TG_OP = 'INSERT' THEN
      NEW.rol := 'competitor';
    ELSIF TG_OP = 'UPDATE' AND NEW.rol IS DISTINCT FROM OLD.rol THEN
      NEW.rol := OLD.rol;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_force_competitor_rol ON profiles;
CREATE TRIGGER trg_profiles_force_competitor_rol
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE profiles_force_competitor_rol();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = id OR is_content_editor());

DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Inserts de perfil los hace el servidor con service role (bypass RLS).

-- Tras el registro de Stephanie (mismo email que en Vercel CONTENT_EDITOR_EMAILS):
-- INSERT INTO cms_allowlist (email) VALUES ('stephanie@correo-real.cl')
-- ON CONFLICT (email) DO NOTHING;
