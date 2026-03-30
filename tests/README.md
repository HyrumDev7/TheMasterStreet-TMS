# Tests TMS

## Tipos de prueba

| Tipo | Herramienta | Ubicación | Datos |
|------|-------------|-----------|--------|
| **Unitarios** | Vitest | `tests/unit/*.test.ts` | Aleatorios (Faker + RUT válido) |
| **Componente (UI)** | Vitest + Testing Library + jsdom | `tests/unit/*.dom.test.tsx` | Interacción básica (ej. `Button`) |
| **Integración (API)** | Vitest + mocks Supabase | `tests/integration/` | Aleatorios; **sin escritura real en BD** |
| **E2E** | Playwright | `e2e/` | Navegación real; **no envía formularios** a producción |

## Comandos

```bash
npm install
npx playwright install chromium   # una vez, para E2E

npm run test           # unitarios + integración (rápido)
npm run test:watch     # Vitest en modo watch
npm run test:e2e       # Playwright (levanta `npm run dev` si hace falta)
npm run test:all       # Vitest + Playwright
```

## Limpieza de datos

- **Tests Vitest:** los mocks se reinician en `afterEach` (`tests/setup.ts`); no queda basura en memoria ni en Supabase.
- **Si insertaste datos reales con prefijo `TEST_TMS_`** (p. ej. pruebas manuales), borra con:

```bash
npm run test:cleanup-db
```

Requiere `SUPABASE_SERVICE_ROLE_KEY` y `NEXT_PUBLIC_SUPABASE_URL` en `.env.local`.

Los generadores en `tests/helpers/testData.ts` marcan el nombre en SÉ TMS con `TEST_TMS_` para poder borrar esas filas de forma segura.

## Variables opcionales

- `PLAYWRIGHT_BASE_URL` — URL base si el servidor ya está corriendo (por defecto `http://127.0.0.1:3000`).
