-- Contenido editable + lista blanca de editora.
-- Ver instrucciones al final de este archivo.

CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  extracto VARCHAR(500),
  cuerpo TEXT NOT NULL DEFAULT '',
  imagen_url TEXT,
  imagen_x NUMERIC NOT NULL DEFAULT 50,
  imagen_y NUMERIC NOT NULL DEFAULT 50,
  imagen_escala NUMERIC NOT NULL DEFAULT 100,
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_noticias_publicado ON noticias (publicado, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_slug ON noticias (slug);

CREATE TABLE IF NOT EXISTS panel_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  panel_id VARCHAR(80) NOT NULL,
  url TEXT NOT NULL,
  pos_x NUMERIC NOT NULL DEFAULT 10,
  pos_y NUMERIC NOT NULL DEFAULT 10,
  ancho NUMERIC NOT NULL DEFAULT 80,
  alto NUMERIC NOT NULL DEFAULT 50,
  rotacion NUMERIC NOT NULL DEFAULT 0,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_panel_media_panel ON panel_media (panel_id, orden);

CREATE TABLE IF NOT EXISTS site_visit_days (
  dia DATE NOT NULL,
  ruta VARCHAR(300) NOT NULL,
  visitas INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (dia, ruta)
);

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

ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE panel_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visit_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS noticias_public_read ON noticias;
CREATE POLICY noticias_public_read ON noticias
  FOR SELECT USING (publicado = true OR is_content_editor());

DROP POLICY IF EXISTS noticias_editor_write ON noticias;
CREATE POLICY noticias_editor_write ON noticias
  FOR ALL USING (is_content_editor()) WITH CHECK (is_content_editor());

DROP POLICY IF EXISTS panel_media_public_read ON panel_media;
CREATE POLICY panel_media_public_read ON panel_media
  FOR SELECT USING (true);

DROP POLICY IF EXISTS panel_media_editor_write ON panel_media;
CREATE POLICY panel_media_editor_write ON panel_media
  FOR ALL USING (is_content_editor()) WITH CHECK (is_content_editor());

DROP POLICY IF EXISTS visits_editor_read ON site_visit_days;
CREATE POLICY visits_editor_read ON site_visit_days
  FOR SELECT USING (is_content_editor());

-- Después de que Stephanie se registre, descomentar y ejecutar (email real):
-- INSERT INTO cms_allowlist (email) VALUES ('stephanie@correo-real.cl')
-- ON CONFLICT (email) DO NOTHING;
