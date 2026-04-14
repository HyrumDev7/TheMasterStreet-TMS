-- SÉ TMS: pago online (Flow / Webpay), sin comprobante archivo; datos en orden hasta pagar.

ALTER TABLE public.ordenes_compra
  ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'entradas',
  ADD COLUMN IF NOT EXISTS ser_tms_datos JSONB;

COMMENT ON COLUMN public.ordenes_compra.tipo IS 'entradas | ser_tms';
COMMENT ON COLUMN public.ordenes_compra.ser_tms_datos IS 'Payload postulación SÉ TMS hasta confirmar pago';

ALTER TABLE public.ser_tms_postulaciones
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS orden_id UUID REFERENCES public.ordenes_compra(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pago_estado TEXT DEFAULT 'paid',
  ADD COLUMN IF NOT EXISTS metodo_pago TEXT,
  ADD COLUMN IF NOT EXISTS id_transaccion TEXT;

-- Comprobante manual sustituido por id de pasarela
ALTER TABLE public.ser_tms_postulaciones
  ALTER COLUMN comprobante_url DROP NOT NULL;

COMMENT ON COLUMN public.ser_tms_postulaciones.id_transaccion IS 'Token Flow / authorization_code Webpay u orden de auditoría';
COMMENT ON COLUMN public.ser_tms_postulaciones.comprobante_url IS 'Opcional; legado. Pago online usa id_transaccion.';
