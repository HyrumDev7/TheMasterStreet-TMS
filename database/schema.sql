-- ============================================================================
-- THE MASTER STREET - DATABASE SCHEMA
-- ============================================================================
-- Este archivo contiene el schema completo de la base de datos
-- Ejecutar en Supabase Dashboard > SQL Editor > New Query
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Tabla de usuarios (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL, -- Formato: 12345678-9
  alias VARCHAR(50) UNIQUE NOT NULL, -- AKA del rapero
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(15),
  fecha_nacimiento DATE,
  ciudad VARCHAR(100),
  biografia TEXT,
  foto_perfil_url TEXT,
  video_presentacion_url TEXT,
  instagram VARCHAR(100),
  youtube VARCHAR(100),
  spotify VARCHAR(100),
  rol VARCHAR(20) DEFAULT 'competitor', -- competitor, admin, judge
  estado VARCHAR(20) DEFAULT 'active', -- active, suspended, banned
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_profiles_rut ON profiles(rut);
CREATE INDEX IF NOT EXISTS idx_profiles_alias ON profiles(alias);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================================================
-- EVENTS MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL, -- URL-friendly: batalla-freestyle-marzo-2026
  descripcion TEXT NOT NULL,
  descripcion_corta VARCHAR(500),
  tipo VARCHAR(50) NOT NULL, -- batalla, workshop, cypher, showcase
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP,
  lugar VARCHAR(200) NOT NULL,
  direccion TEXT,
  ciudad VARCHAR(100) DEFAULT 'Concepción',
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  imagen_portada_url TEXT,
  imagen_banner_url TEXT,
  aforo_maximo INTEGER,
  aforo_actual INTEGER DEFAULT 0,
  precio_general DECIMAL(10, 2),
  precio_vip DECIMAL(10, 2),
  precio_early_bird DECIMAL(10, 2),
  requiere_inscripcion BOOLEAN DEFAULT false, -- Si requiere aplicación de competidor
  fecha_limite_inscripcion TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'draft', -- draft, published, cancelled, finished
  destacado BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON eventos(estado);
CREATE INDEX IF NOT EXISTS idx_eventos_slug ON eventos(slug);

-- ============================================================================
-- TICKET SALES
-- ============================================================================

CREATE TABLE IF NOT EXISTS tipos_entrada (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL, -- General, VIP, Early Bird
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  cantidad_disponible INTEGER NOT NULL,
  cantidad_vendida INTEGER DEFAULT 0,
  fecha_inicio_venta TIMESTAMP,
  fecha_fin_venta TIMESTAMP,
  activo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS ordenes_compra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES profiles(id), -- NULL si es invitado
  email_comprador VARCHAR(255) NOT NULL,
  nombre_comprador VARCHAR(200) NOT NULL,
  rut_comprador VARCHAR(12),
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  metodo_pago VARCHAR(50), -- flow, webpay, transbank
  transaction_id VARCHAR(200), -- ID de la pasarela
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entradas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id UUID REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  tipo_entrada_id UUID REFERENCES tipos_entrada(id),
  evento_id UUID REFERENCES eventos(id),
  codigo_qr VARCHAR(200) UNIQUE NOT NULL, -- Para validación en puerta
  nombre_asistente VARCHAR(200),
  rut_asistente VARCHAR(12),
  email_asistente VARCHAR(255),
  usado BOOLEAN DEFAULT false,
  fecha_uso TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entradas_qr ON entradas(codigo_qr);
CREATE INDEX IF NOT EXISTS idx_ordenes_email ON ordenes_compra(email_comprador);

-- ============================================================================
-- COMPETITION APPLICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS convocatorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  requisitos TEXT, -- Formato markdown
  premios TEXT, -- Formato markdown
  fecha_apertura TIMESTAMP NOT NULL,
  fecha_cierre TIMESTAMP NOT NULL,
  maximo_participantes INTEGER,
  participantes_aceptados INTEGER DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'open', -- open, closed, selection
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aplicaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  convocatoria_id UUID REFERENCES convocatorias(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_audicion_url TEXT NOT NULL, -- Supabase Storage URL
  mensaje_motivacion TEXT,
  experiencia TEXT,
  redes_sociales JSONB, -- {instagram: '', youtube: '', spotify: ''}
  estado VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, waitlist
  puntuacion INTEGER, -- 0-100, asignado por jueces
  notas_jurado TEXT,
  fecha_aplicacion TIMESTAMP DEFAULT NOW(),
  fecha_evaluacion TIMESTAMP,
  evaluado_por UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_aplicaciones_usuario ON aplicaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_aplicaciones_convocatoria ON aplicaciones(convocatoria_id);
CREATE INDEX IF NOT EXISTS idx_aplicaciones_estado ON aplicaciones(estado);

-- ============================================================================
-- CONTENT MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  contenido TEXT NOT NULL,
  extracto VARCHAR(500),
  imagen_destacada_url TEXT,
  categoria VARCHAR(50), -- evento, cultura, entrevista, resultado
  autor_id UUID REFERENCES profiles(id),
  publicado BOOLEAN DEFAULT false,
  fecha_publicacion TIMESTAMP,
  visitas INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS galeria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id UUID REFERENCES eventos(id),
  titulo VARCHAR(200),
  imagen_url TEXT NOT NULL,
  thumbnail_url TEXT,
  descripcion TEXT,
  fotografo VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- HISTORIA / ABOUT
-- ============================================================================

CREATE TABLE IF NOT EXISTS equipo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  biografia TEXT,
  foto_url TEXT,
  instagram VARCHAR(100),
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS momentos_clave (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha DATE NOT NULL,
  imagen_url TEXT,
  video_url TEXT,
  categoria VARCHAR(50), -- inicio, hito, evento-especial
  orden INTEGER DEFAULT 0
);

-- ============================================================================
-- NEWSLETTER & MARKETING
-- ============================================================================

CREATE TABLE IF NOT EXISTS suscriptores_newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  fecha_suscripcion TIMESTAMP DEFAULT NOW(),
  fuente VARCHAR(50) DEFAULT 'web' -- web, evento, formulario
);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_eventos_updated_at ON eventos;
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ordenes_updated_at ON ordenes_compra;
CREATE TRIGGER update_ordenes_updated_at BEFORE UPDATE ON ordenes_compra
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_noticias_updated_at ON noticias;
CREATE TRIGGER update_noticias_updated_at BEFORE UPDATE ON noticias
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Validar RUT chileno
CREATE OR REPLACE FUNCTION validar_rut(rut VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    rut_limpio VARCHAR;
    digito_verificador VARCHAR;
    cuerpo INTEGER;
    suma INTEGER := 0;
    multiplicador INTEGER := 2;
    dv_calculado VARCHAR;
BEGIN
    -- Remover puntos y guión
    rut_limpio := REGEXP_REPLACE(rut, '[.-]', '', 'g');
    
    -- Extraer dígito verificador
    digito_verificador := SUBSTRING(rut_limpio FROM LENGTH(rut_limpio));
    cuerpo := SUBSTRING(rut_limpio FROM 1 FOR LENGTH(rut_limpio)-1)::INTEGER;
    
    -- Calcular dígito verificador
    WHILE cuerpo > 0 LOOP
        suma := suma + (cuerpo % 10) * multiplicador;
        cuerpo := cuerpo / 10;
        multiplicador := multiplicador + 1;
        IF multiplicador > 7 THEN
            multiplicador := 2;
        END IF;
    END LOOP;
    
    dv_calculado := (11 - (suma % 11))::VARCHAR;
    IF dv_calculado = '11' THEN dv_calculado := '0'; END IF;
    IF dv_calculado = '10' THEN dv_calculado := 'K'; END IF;
    
    RETURN UPPER(digito_verificador) = UPPER(dv_calculado);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE aplicaciones ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Políticas: usuarios pueden ver sus propias aplicaciones
DROP POLICY IF EXISTS "Users can view own applications" ON aplicaciones;
CREATE POLICY "Users can view own applications" ON aplicaciones
FOR SELECT USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Users can insert own applications" ON aplicaciones;
CREATE POLICY "Users can insert own applications" ON aplicaciones
FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Políticas: perfiles públicos son visibles para todos
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
FOR SELECT USING (true);

-- Políticas: eventos publicados son visibles para todos
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON eventos;
CREATE POLICY "Published events are viewable by everyone" ON eventos
FOR SELECT USING (estado = 'published');
