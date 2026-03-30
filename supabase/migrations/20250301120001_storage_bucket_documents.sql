-- Bucket para documentos (comprobantes de pago SÉ TMS, etc.).
-- En local (Supabase CLI) este bucket se crea al aplicar la migración.

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Política: permitir que anon suba archivos en la carpeta ser-tms-comprobantes (vía API con anon key)
DROP POLICY IF EXISTS "Allow anon upload ser-tms comprobantes" ON storage.objects;
CREATE POLICY "Allow anon upload ser-tms comprobantes"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = 'ser-tms-comprobantes'
  );

-- Política: permitir lectura pública de documentos (para ver comprobantes si hace falta)
DROP POLICY IF EXISTS "Allow public read documents" ON storage.objects;
CREATE POLICY "Allow public read documents"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'documents');
