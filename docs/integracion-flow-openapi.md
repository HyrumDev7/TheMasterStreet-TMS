# Flow API — Guía y verificación SÉ TMS

## URLs base (OpenAPI)

| Entorno    | Base URL                         |
|------------|----------------------------------|
| Producción | `https://www.flow.cl/api`        |
| Sandbox    | `https://sandbox.flow.cl/api`    |

Variables: `FLOW_API_KEY`, `FLOW_SECRET_KEY`, `FLOW_API_URL`.

---

## Verificación SÉ TMS — `urlConfirmation` y `urlReturn`

Todo parte de **`NEXT_PUBLIC_APP_URL`** (`src/lib/utils/constants.ts` → `APP_URL`).

| Uso | URL construida | Origen en código |
|-----|----------------|------------------|
| **urlConfirmation** (Flow → tu servidor, POST) | `{APP_URL}/api/pagos/flow/confirm` | `src/app/api/ser-tms/checkout/route.ts` |
| **urlReturn** (navegador del usuario) | `{APP_URL}/ser-tms/pago/exito?ordenId={uuid}` | mismo |

**Ejemplo producción** (ajusta el dominio):

- `NEXT_PUBLIC_APP_URL=https://www.masterstreet.cl`
- Webhook: `https://www.masterstreet.cl/api/pagos/flow/confirm`
- Retorno: `https://www.masterstreet.cl/ser-tms/pago/exito?ordenId=...`

### Checklist

1. En **Vercel** (u hosting), `NEXT_PUBLIC_APP_URL` = URL pública **HTTPS** (sin barra final; el código la quita al armar rutas).
2. **No** uses `http://localhost:3000` en el entorno de producción.
3. El webhook debe ser **público** (Flow hace POST desde sus servidores).
4. Tras cambiar la variable, **redeploy**.
5. En el **panel Flow**, si hay lista de URLs/callbacks permitidas, registra tu dominio.

### Coherencia del flujo

- `POST /api/pagos/flow/confirm` busca la orden por `transaction_id` = token y, si `tipo === 'ser_tms'`, ejecuta `insertSerTmsIfPaid` al quedar pagada.

YAML de referencia: `es-openApiFlow.yaml` (OpenAPI 3).

### Implementación en este repo

`payment/create` se envía como **`application/x-www-form-urlencoded`** (Quickstart Flow), no como JSON.
