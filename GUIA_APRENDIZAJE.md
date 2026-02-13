# 📚 Guía de Aprendizaje - The Master Street Platform

## Guía Completa para Ingenieros Informáticos

Esta guía te llevará paso a paso por la implementación del proyecto, con recursos de aprendizaje en español para cada concepto.

---

## 📋 ÍNDICE

1. [Configuración Inicial del Proyecto](#1-configuración-inicial-del-proyecto)
2. [Next.js 14 y App Router](#2-nextjs-14-y-app-router)
3. [TypeScript en Next.js](#3-typescript-en-nextjs)
4. [Supabase - Base de Datos y Autenticación](#4-supabase---base-de-datos-y-autenticación)
5. [Tailwind CSS](#5-tailwind-css)
6. [Validación con Zod](#6-validación-con-zod)
7. [API Routes en Next.js](#7-api-routes-en-nextjs)
8. [Autenticación y Seguridad](#8-autenticación-y-seguridad)
9. [Integración de Pagos](#9-integración-de-pagos)
10. [Deploy a Producción](#10-deploy-a-producción)

---

## 🔄 BITÁCORA DE APRENDIZAJE (ACTUALIZACIÓN CONTINUA)

> Este será el **mismo archivo vivo** que iremos actualizando en cada avance (comandos + autoayuda), tal como pediste.

### Estado actual del proyecto
- ✅ Fase 1 base (estructura y configuración inicial)
- ✅ Fase 2 (API Routes principales)
- ✅ Fase 3 base (frontend inicial)
- ⏳ **Paso actual: Configurar Supabase real para salir a nube e indexación**

### Objetivo de hoy: dejar Supabase operativo

#### Paso A - Crear proyecto en Supabase (Dashboard)
1. Entra a `https://supabase.com/dashboard`
2. Crea un proyecto nuevo
3. En la sección de seguridad inicial, usa esta configuración recomendada:
   - `Habilitar API de datos` -> **SI (Activado)**
   - `Habilitar RLS automatico` -> **NO (Desactivado)** para este proyecto
4. ¿Por qué así?
   - Activar `API de datos` permite que tus API routes y frontend consulten tablas via Supabase.
   - Desactivar `RLS automatico` evita bloqueos tempranos en desarrollo mientras aplicamos politicas RLS controladas desde tu `schema.sql`.
   - En este proyecto, ya definimos RLS manualmente para tablas clave, por eso es mejor controlarlo nosotros.
5. Guarda estos datos:
   - `Project URL`
   - `anon public key`
   - `service_role key`
   - `Project Reference ID` (lo usaremos para tipos)

**Estudio (ES):**
- 📺 [Supabase desde cero (en español)](https://www.youtube.com/watch?v=5bFp8q1hQ8s)
- 📖 [Supabase Docs - Projects](https://supabase.com/docs/guides/getting-started)

#### Paso B - Cargar variables de entorno en local
Comandos:
```bash
cd C:\TMS
copy env.example .env.local
```

Luego abre `.env.local` y rellena al menos:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="The Master Street"
```

**Autoayuda (si falla):**
- Si `copy` no funciona en tu terminal, usa: `cp env.example .env.local`
- Si no ves `.env.local`, refresca el explorador de archivos del IDE.

**Estudio (ES):**
- 📺 [Variables de entorno en Next.js](https://www.youtube.com/watch?v=8QnSpdM2H8M)
- 📖 [Next.js Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)

#### Paso C - Ejecutar schema SQL
1. Abre Supabase Dashboard > `SQL Editor`
2. Copia todo `database/schema.sql`
3. Ejecuta
4. Verifica que las tablas aparezcan en `Table Editor`

**Autoayuda (si falla):**
- Ejecuta por bloques si el script completo lanza error.
- Si falla por extensiones, vuelve a correr desde la sección `CREATE EXTENSION`.

**Estudio (ES):**
- 📺 [Aprender SQL desde cero](https://www.youtube.com/watch?v=HXV3zeQKqGY)
- 📖 [PostgreSQL SQL Commands](https://www.postgresql.org/docs/current/sql-commands.html)

#### Paso D - Crear buckets de Storage
En Supabase > `Storage`:
- `videos` (publico, 100MB)
- `images` (publico, 5MB)
- `documents` (privado)

**Autoayuda (si falla upload):**
- Revisa que bucket exista con el mismo nombre exacto.
- Revisa políticas del bucket (public/private).

**Estudio (ES):**
- 📺 [Supabase Storage explicado](https://www.youtube.com/watch?v=Y8x9w7D4Y5Y)
- 📖 [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

#### Paso E - Generar tipos TypeScript desde Supabase
Comandos:
```bash
cd C:\TMS
npx supabase login
npx supabase gen types typescript --project-id TU_PROJECT_REF > src/types/database.ts
```

Reemplaza `TU_PROJECT_REF` por el `Reference ID` del proyecto.

**Autoayuda (si falla):**
- Error de auth: vuelve a ejecutar `npx supabase login`.
- Error de proyecto: confirma que el `project-id` es el `Reference ID`, no el nombre del proyecto.

**Estudio (ES):**
- 📺 [Type-safe Supabase + TypeScript](https://www.youtube.com/watch?v=PKWLKe0v8xE)
- 📖 [Generating Supabase Types](https://supabase.com/docs/guides/api/rest/generating-types)

#### Paso F - Probar conexión local
Comandos:
```bash
cd C:\TMS
npm install
npm run dev
```

Abre `http://localhost:3000` y prueba:
- Registro de usuario
- Login
- Listado de eventos

**Autoayuda (si falla):**
- Error 500: revisa variables `.env.local`.
- Error auth: revisa claves Supabase.
- Error de tablas: confirma que `schema.sql` se ejecutó completo.

### 📌 Versión extendida de los 6 pasos (manual operativo)

> Esta sección es para ejecutar **exactamente hoy** la configuración real de Supabase en tu proyecto.
> 
> Formato de cada paso:
> - Objetivo
> - Acción exacta
> - Qué deberías ver
> - Errores comunes + solución
> - Checklist de salida

#### 1) Crear proyecto en Supabase (correctamente, sin perder datos clave)

**Objetivo técnico:**
- Crear una instancia PostgreSQL administrada por Supabase.
- Obtener claves para frontend/backend.
- Tener `project_ref` para generación de tipos.

**Acción exacta:**
1. Ir a `https://supabase.com/dashboard`
2. `New project`
3. Completar:
   - **Organization**: la tuya
   - **Name**: `the-master-street` (o similar)
   - **Database Password**: crea una contraseña fuerte y guárdala
   - **Region**: elegir la más cercana (ideal Sudamérica)
4. Esperar provisión (1-3 min)

**Dónde leer los datos importantes:**
1. `Settings` > `API`
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` -> `SUPABASE_SERVICE_ROLE_KEY`
2. `Settings` > `General`
   - `Reference ID` -> `TU_PROJECT_REF`

**Qué deberías ver si salió bien:**
- Proyecto visible en dashboard
- Sección `Table Editor` vacía (aún sin schema)
- `API URL` y keys disponibles

**Errores comunes + solución:**
- No veo `service_role`: revisa `Settings > API`, sección “Project API keys”.
- Elegí región lejana: puedes continuar, pero para producción conviene crear nuevo proyecto cercano.
- Perdí la contraseña DB: reset en `Database Settings`.

**Checklist de salida:**
- [ ] Tengo `Project URL`
- [ ] Tengo `anon key`
- [ ] Tengo `service_role key`
- [ ] Tengo `Reference ID`

---

#### 2) Configurar `.env.local` con las claves reales (sin romper seguridad)

**Objetivo técnico:**
- Inyectar configuración de Supabase en entorno local para que Next.js y API Routes funcionen.

**Acción exacta (Windows CMD):**
```bash
cd C:\TMS
copy env.example .env.local
```

**Acción exacta (PowerShell):**
```bash
cd C:\TMS
Copy-Item env.example .env.local
```

Editar `.env.local` con valores reales:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="The Master Street"
```

**Regla de seguridad importante:**
- `NEXT_PUBLIC_*` se expone al frontend (normal).
- `SUPABASE_SERVICE_ROLE_KEY` **nunca** debe ir al cliente ni repositorio público.
- Verifica que `.env.local` esté ignorado en `.gitignore` (ya está).

**Qué deberías ver si salió bien:**
- Archivo `.env.local` creado en raíz de `C:\TMS`
- Variables con valores completos (sin `...`)

**Errores comunes + solución:**
- `copy` no existe: usa PowerShell `Copy-Item`.
- Pegué mal una key (espacios/cortes): vuelve a copiar directo desde Supabase.
- Cambié `.env.local` y no toma cambios: reinicia `npm run dev`.

**Checklist de salida:**
- [ ] `.env.local` existe
- [ ] Variables mínimas de Supabase completas
- [ ] No subí `.env.local` a Git

---

#### 3) Ejecutar `database/schema.sql` en Supabase SQL Editor (sin inconsistencias)

**Objetivo técnico:**
- Crear tablas, índices, funciones, triggers y políticas RLS del sistema.

**Acción exacta:**
1. Abrir `Supabase Dashboard > SQL Editor`
2. Crear `New Query`
3. Abrir archivo local `C:\TMS\database\schema.sql`
4. Copiar todo el contenido y pegar en editor
5. Ejecutar (`Run`)

**Validación posterior:**
1. Ir a `Table Editor`
2. Confirmar tablas clave:
   - `profiles`
   - `eventos`
   - `convocatorias`
   - `aplicaciones`
   - `ordenes_compra`
   - `entradas`
3. Revisar `Authentication > Policies` para verificar RLS en tablas críticas.

**Qué deberías ver si salió bien:**
- Query ejecutada sin errores fatales
- Tablas visibles
- Índices y triggers creados

**Errores comunes + solución:**
- Error por objeto ya existente: tu script usa `IF NOT EXISTS` en varios puntos; si choca una parte, vuelve a correr solo el bloque faltante.
- Error por extensión UUID: verifica `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.
- Error de policy duplicada: el script usa `DROP POLICY IF EXISTS`, vuelve a ejecutar el bloque RLS completo.

**Checklist de salida:**
- [ ] Tablas principales creadas
- [ ] Triggers de `updated_at` creados
- [ ] Políticas RLS activas

---

#### 4) Crear Storage Buckets (alineados con el código backend)

**Objetivo técnico:**
- Habilitar subida de videos e imágenes desde APIs:
  - `/api/upload/video`
  - `/api/upload/imagen`
  - `/api/convocatorias/[id]/aplicar`

**Acción exacta:**
1. Ir a `Supabase > Storage`
2. Crear bucket `videos`
   - Public bucket: **ON**
3. Crear bucket `images`
   - Public bucket: **ON**
4. Crear bucket `documents`
   - Public bucket: **OFF**

**Recomendación de políticas iniciales:**
- Etapa desarrollo:
  - `videos` y `images`: público + insert para usuarios autenticados
- Etapa producción:
  - reglas más estrictas por carpeta/usuario (`auth.uid()`).

**Qué deberías ver si salió bien:**
- Buckets listados con esos nombres exactos:
  - `videos`
  - `images`
  - `documents`

**Errores comunes + solución:**
- API responde “bucket not found”: nombre exacto mal escrito.
- Upload 403: faltan policies de Storage (revisar permisos para `authenticated`).
- Se sube pero URL no abre: bucket público no activado.

**Checklist de salida:**
- [ ] Buckets creados
- [ ] Nombres idénticos al código
- [ ] Bucket público validado para `videos/images`

---

#### 5) Generar tipos TypeScript desde Supabase (fuente real de tipos)

**Objetivo técnico:**
- Evitar inconsistencias entre base de datos y TypeScript.
- Reemplazar tipos temporales por tipos generados reales.

**Acción exacta:**
```bash
cd C:\TMS
npx supabase login
npx supabase gen types typescript --project-id TU_PROJECT_REF > src/types/database.ts
```

**Tip de validación rápida:**
- Abre `src/types/database.ts`
- Debes ver múltiples tablas (`profiles`, `eventos`, etc.) en el type `Database`.

**Qué deberías ver si salió bien:**
- Archivo `src/types/database.ts` actualizado
- Sin errores de comando en terminal

**Errores comunes + solución:**
- `Access token not provided`: ejecutar `npx supabase login`.
- `Project not found`: `TU_PROJECT_REF` incorrecto.
- Archivo vacío/corrupto: repite comando y verifica permisos de escritura.

**Checklist de salida:**
- [ ] Login de Supabase CLI exitoso
- [ ] Archivo de tipos generado
- [ ] Tipos reales de tablas presentes

---

#### 6) Levantar y probar local (prueba funcional mínima end-to-end)

**Objetivo técnico:**
- Confirmar que frontend + auth + DB + storage están conectados correctamente.

**Acción exacta:**
```bash
cd C:\TMS
npm install
npm run dev
```

Abrir:
- `http://localhost:3000`

**Prueba mínima recomendada:**
1. Ir a `/auth/registro` y crear usuario.
2. Iniciar sesión en `/auth/login`.
3. Visitar `/perfil` (ruta protegida).
4. Revisar en Supabase:
   - `Authentication > Users`: usuario creado.
   - `Table Editor > profiles`: perfil creado.

**Prueba de API opcional (rápida):**
- Endpoint público: `GET /api/eventos`
- Si está vacío pero responde `200`, conexión correcta.

**Qué deberías ver si salió bien:**
- App cargando sin crashear
- Registro/login funcional
- Datos visibles en Supabase

**Errores comunes + solución:**
- Error 500 en auth/register:
  - revisar keys en `.env.local`
  - revisar que existe tabla `profiles`
- Error de CORS/host:
  - revisar `NEXT_PUBLIC_APP_URL`
- Error “invalid JWT”:
  - borrar cookies y volver a loguear

**Checklist de salida:**
- [ ] Servidor local operativo
- [ ] Registro funcional
- [ ] Login funcional
- [ ] Perfil persistido en DB

---

### ✅ Definición de “Supabase listo”

Puedes considerar Supabase “listo para continuar a nube” cuando:
- [ ] Proyecto Supabase creado
- [ ] `.env.local` correcto
- [ ] `schema.sql` ejecutado sin pendientes
- [ ] Buckets creados
- [ ] Tipos TypeScript generados
- [ ] Registro/Login validados en local

Cuando completes esta definición, el siguiente bloque será:
1. Configurar variables en Vercel
2. Deploy producción
3. Checklist de indexación (sitemap, robots, Search Console)

---

## 1. CONFIGURACIÓN INICIAL DEL PROYECTO

### 1.1 Instalación de Node.js y npm

**Comandos:**
```bash
# Verificar versión de Node.js (debe ser 18 o superior)
node --version

# Verificar versión de npm
npm --version

# Si no tienes Node.js, descargar desde:
# https://nodejs.org/
```

**Recursos de Aprendizaje:**
- 📺 [¿Qué es Node.js? - Explicación Completa en Español](https://www.youtube.com/watch?v=BhvLIzVL8_o)
- 📺 [Instalación de Node.js y npm - Tutorial Completo](https://www.youtube.com/watch?v=9U3mKzY9w8c)
- 📖 [Documentación oficial de Node.js](https://nodejs.org/es/docs/)

**Conceptos Clave:**
- Node.js es el runtime de JavaScript fuera del navegador
- npm es el gestor de paquetes de Node.js
- `package.json` define las dependencias del proyecto

---

### 1.2 Crear Proyecto Next.js

**Comandos:**
```bash
# Crear proyecto Next.js con TypeScript y Tailwind
npx create-next-app@latest master-street --typescript --tailwind --app --src-dir

# O si ya existe el proyecto, instalar dependencias
cd TMS
npm install
```

**Recursos de Aprendizaje:**
- 📺 [Next.js 14 desde Cero - Tutorial Completo en Español](https://www.youtube.com/watch?v=9P8mASSREYM)
- 📺 [Next.js 14 App Router - Guía Completa](https://www.youtube.com/watch?v=Y6KDk5iynYE)
- 📖 [Documentación oficial Next.js](https://nextjs.org/docs)

**Conceptos Clave:**
- `npx` ejecuta paquetes sin instalarlos globalmente
- `--typescript` habilita TypeScript
- `--tailwind` configura Tailwind CSS
- `--app` usa el nuevo App Router
- `--src-dir` organiza código en carpeta `src/`

**Ejercicio Práctico:**
1. Crear un proyecto Next.js desde cero
2. Explorar la estructura de carpetas generada
3. Modificar `src/app/page.tsx` y ver los cambios en tiempo real

---

### 1.3 Estructura de Carpetas

**Estructura del Proyecto:**
```
TMS/
├── src/
│   ├── app/              # Páginas y rutas (App Router)
│   ├── components/        # Componentes React reutilizables
│   ├── lib/               # Utilidades y configuración
│   ├── hooks/             # Custom React hooks
│   └── types/              # Tipos TypeScript
├── public/                 # Archivos estáticos
├── database/               # Scripts SQL
├── package.json            # Dependencias del proyecto
└── tsconfig.json           # Configuración TypeScript
```

**Recursos de Aprendizaje:**
- 📺 [Estructura de Proyectos Next.js - Mejores Prácticas](https://www.youtube.com/watch?v=1WmNX1yaBq0)
- 📖 [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocating-files)

**Conceptos Clave:**
- `app/` contiene las rutas de la aplicación
- `components/` para componentes reutilizables
- `lib/` para código compartido (no componentes)
- `public/` para assets estáticos

---

## 2. NEXT.JS 14 Y APP ROUTER

### 2.1 Entendiendo el App Router

**Conceptos:**
- Cada carpeta en `app/` es una ruta
- `page.tsx` define la página de esa ruta
- `layout.tsx` define el layout compartido
- `route.ts` define API endpoints

**Ejemplo:**
```
app/
├── page.tsx              # Ruta: /
├── eventos/
│   └── page.tsx         # Ruta: /eventos
└── api/
    └── auth/
        └── route.ts     # Ruta API: /api/auth
```

**Recursos de Aprendizaje:**
- 📺 [Next.js 14 App Router - Tutorial Completo](https://www.youtube.com/watch?v=Y6KDk5iynYE)
- 📺 [App Router vs Pages Router - Diferencias](https://www.youtube.com/watch?v=5rQ3hD6CDaA)
- 📖 [Next.js App Router Documentation](https://nextjs.org/docs/app)

**Ejercicio Práctico:**
1. Crear una nueva ruta `/nosotros`
2. Crear un layout compartido con header y footer
3. Implementar navegación entre páginas

---

### 2.2 Server Components vs Client Components

**Comandos:**
```typescript
// Server Component (por defecto)
export default function Page() {
  return <div>Contenido del servidor</div>
}

// Client Component (necesita 'use client')
'use client'
import { useState } from 'react'
export default function Page() {
  const [count, setCount] = useState(0)
  return <div>{count}</div>
}
```

**Recursos de Aprendizaje:**
- 📺 [Server Components vs Client Components - Explicación](https://www.youtube.com/watch?v=5rQ3hD6CDaA)
- 📖 [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

**Conceptos Clave:**
- Server Components se renderizan en el servidor (más rápido)
- Client Components se renderizan en el navegador (interactividad)
- Usar `'use client'` solo cuando necesites hooks o eventos

---

## 3. TYPESCRIPT EN NEXT.JS

### 3.1 Configuración de TypeScript

**Archivo: `tsconfig.json`**
```json
{
  "compilerOptions": {
    "strict": true,           // Habilitar modo estricto
    "noEmit": true,           // No generar archivos JS
    "paths": {
      "@/*": ["./src/*"]      // Alias para imports
    }
  }
}
```

**Recursos de Aprendizaje:**
- 📺 [TypeScript desde Cero - Curso Completo](https://www.youtube.com/watch?v=z95mZV3c5L8)
- 📺 [TypeScript en Next.js - Configuración](https://www.youtube.com/watch?v=1jMJDbq7ZX4)
- 📖 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

**Conceptos Clave:**
- TypeScript añade tipos a JavaScript
- `strict: true` habilita todas las verificaciones
- Los alias `@/*` simplifican los imports

**Ejercicio Práctico:**
1. Crear tipos para un objeto `Usuario`
2. Crear una interfaz para `Evento`
3. Usar tipos en componentes React

---

### 3.2 Tipos y Interfaces

**Ejemplo:**
```typescript
// Tipo
type UserRole = 'admin' | 'user' | 'guest'

// Interfaz
interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Uso en componente
function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

**Recursos de Aprendizaje:**
- 📺 [TypeScript: Tipos vs Interfaces](https://www.youtube.com/watch?v=crjIq7LEayw)
- 📖 [TypeScript Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

---

## 4. SUPABASE - BASE DE DATOS Y AUTENTICACIÓN

### 4.1 Crear Proyecto en Supabase

**Pasos:**
1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta (gratis)
3. Crear nuevo proyecto
4. Anotar URL y API keys

**Recursos de Aprendizaje:**
- 📺 [Supabase desde Cero - Tutorial Completo](https://www.youtube.com/watch?v=5bFp8q1hQ8s)
- 📺 [Configurar Supabase con Next.js](https://www.youtube.com/watch?v=PKWLKe0v8xE)
- 📖 [Supabase Documentation](https://supabase.com/docs)

**Conceptos Clave:**
- Supabase es un Backend as a Service (BaaS)
- Incluye PostgreSQL, Auth, Storage y APIs
- Row Level Security (RLS) para seguridad

---

### 4.2 Ejecutar Schema SQL

**Comandos:**
```sql
-- 1. Ir a Supabase Dashboard > SQL Editor
-- 2. Copiar contenido de database/schema.sql
-- 3. Ejecutar el script completo
-- 4. Verificar que las tablas se crearon
```

**Recursos de Aprendizaje:**
- 📺 [SQL Básico - Curso Completo](https://www.youtube.com/watch?v=HXV3zeQKqGY)
- 📺 [PostgreSQL para Principiantes](https://www.youtube.com/watch?v=qw--VYLpxG4)
- 📖 [PostgreSQL Documentation](https://www.postgresql.org/docs/)

**Conceptos Clave:**
- `CREATE TABLE` define tablas
- `PRIMARY KEY` identifica registros únicos
- `FOREIGN KEY` relaciona tablas
- `INDEX` acelera búsquedas

**Ejercicio Práctico:**
1. Crear una tabla `productos` manualmente
2. Insertar datos de prueba
3. Consultar datos con SELECT

---

### 4.3 Configurar Cliente Supabase

**Archivo: `src/lib/supabase/client.ts`**
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const supabase = createClientComponentClient<Database>()
```

**Recursos de Aprendizaje:**
- 📺 [Supabase Client en Next.js](https://www.youtube.com/watch?v=PKWLKe0v8xE)
- 📖 [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

**Conceptos Clave:**
- Cliente para componentes del navegador
- Cliente del servidor para API routes
- Tipos generados desde la base de datos

---

### 4.4 Generar Tipos TypeScript desde Supabase

**Comandos:**
```bash
# Instalar Supabase CLI (si no está instalado)
npm install -g supabase

# Generar tipos
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts

# Reemplazar YOUR_PROJECT_REF con el ID de tu proyecto
# Se encuentra en: Supabase Dashboard > Settings > General > Reference ID
```

**Recursos de Aprendizaje:**
- 📺 [Generar Tipos desde Supabase](https://www.youtube.com/watch?v=PKWLKe0v8xE)
- 📖 [Supabase TypeScript](https://supabase.com/docs/guides/api/generating-types)

**Conceptos Clave:**
- Los tipos se generan automáticamente desde el schema
- Garantiza type-safety entre DB y código
- Actualizar tipos cuando cambie el schema

---

### 4.5 Configurar Storage Buckets

**Pasos:**
1. Ir a Supabase Dashboard > Storage
2. Crear bucket `videos`:
   - Público: ✅
   - Tamaño máximo: 100MB
3. Crear bucket `images`:
   - Público: ✅
   - Tamaño máximo: 5MB
4. Crear bucket `documents`:
   - Público: ❌ (privado)

**Recursos de Aprendizaje:**
- 📺 [Supabase Storage - Tutorial Completo](https://www.youtube.com/watch?v=5bFp8q1hQ8s)
- 📖 [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)

---

## 5. TAILWIND CSS

### 5.1 Configuración de Tailwind

**Archivo: `tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
      },
    },
  },
}
export default config
```

**Recursos de Aprendizaje:**
- 📺 [Tailwind CSS desde Cero - Curso Completo](https://www.youtube.com/watch?v=1d0A8k2YH9w)
- 📺 [Tailwind CSS en Next.js](https://www.youtube.com/watch?v=ft30zcMlFao)
- 📖 [Tailwind CSS Documentation](https://tailwindcss.com/docs)

**Conceptos Clave:**
- Utility-first CSS framework
- Clases como `bg-black`, `text-white`, `p-4`
- Configuración personalizada en `tailwind.config.ts`

**Ejercicio Práctico:**
1. Crear un botón con Tailwind
2. Crear una card responsive
3. Personalizar colores en el config

---

### 5.2 Componentes con Tailwind

**Ejemplo:**
```tsx
export default function Button() {
  return (
    <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
      Click me
    </button>
  )
}
```

**Recursos de Aprendizaje:**
- 📺 [Componentes con Tailwind CSS](https://www.youtube.com/watch?v=1d0A8k2YH9w)
- 📖 [Tailwind Utility Classes](https://tailwindcss.com/docs/utility-first)

---

## 6. VALIDACIÓN CON ZOD

### 6.1 Instalación y Configuración

**Comandos:**
```bash
npm install zod @hookform/resolvers react-hook-form
```

**Recursos de Aprendizaje:**
- 📺 [Zod - Validación de Schemas en TypeScript](https://www.youtube.com/watch?v=Y3-Fk4zQ3oI)
- 📺 [React Hook Form + Zod - Tutorial](https://www.youtube.com/watch?v=Ke8jZ7nRr2k)
- 📖 [Zod Documentation](https://zod.dev/)

**Conceptos Clave:**
- Zod valida datos en runtime
- Genera tipos TypeScript automáticamente
- Integración con React Hook Form

---

### 6.2 Crear Schemas de Validación

**Ejemplo:**
```typescript
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Debes ser mayor de edad'),
})

export type UserInput = z.infer<typeof userSchema>
```

**Recursos de Aprendizaje:**
- 📺 [Zod Schemas - Ejemplos Prácticos](https://www.youtube.com/watch?v=Y3-Fk4zQ3oI)
- 📖 [Zod Basic Usage](https://zod.dev/?id=basic-usage)

**Ejercicio Práctico:**
1. Crear schema para formulario de registro
2. Validar email y contraseña
3. Integrar con React Hook Form

---

## 7. API ROUTES EN NEXT.js

### 7.1 Crear API Route Básica

**Archivo: `src/app/api/test/route.ts`**
```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello API' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

**Recursos de Aprendizaje:**
- 📺 [API Routes en Next.js 14](https://www.youtube.com/watch?v=Y6KDk5iynYE)
- 📺 [Crear REST API con Next.js](https://www.youtube.com/watch?v=1WmNX1yaBq0)
- 📖 [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

**Conceptos Clave:**
- Cada archivo `route.ts` es un endpoint
- Métodos HTTP: GET, POST, PUT, DELETE
- `NextResponse` para respuestas

**Ejercicio Práctico:**
1. Crear endpoint GET `/api/users`
2. Crear endpoint POST `/api/users`
3. Manejar errores y validación

---

### 7.2 Conectar API con Supabase

**Ejemplo:**
```typescript
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

**Recursos de Aprendizaje:**
- 📺 [Supabase con Next.js API Routes](https://www.youtube.com/watch?v=PKWLKe0v8xE)
- 📖 [Supabase Querying](https://supabase.com/docs/reference/javascript/select)

---

## 8. AUTENTICACIÓN Y SEGURIDAD

### 8.1 Implementar Registro de Usuario

**Archivo: `src/app/api/auth/register/route.ts`**
```typescript
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { registroSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  const body = await request.json()
  const validated = registroSchema.parse(body)
  
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.signUp({
    email: validated.email,
    password: validated.password,
  })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ user: data.user })
}
```

**Recursos de Aprendizaje:**
- 📺 [Autenticación con Supabase](https://www.youtube.com/watch?v=5bFp8q1hQ8s)
- 📺 [JWT y Sesiones - Explicación](https://www.youtube.com/watch?v=7Q17ubqLfaM)
- 📖 [Supabase Auth](https://supabase.com/docs/guides/auth)

**Conceptos Clave:**
- JWT (JSON Web Tokens) para sesiones
- Hash de contraseñas (automático en Supabase)
- Row Level Security (RLS) para proteger datos

---

### 8.2 Middleware de Autenticación

**Archivo: `src/middleware.ts`**
```typescript
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

**Recursos de Aprendizaje:**
- 📺 [Next.js Middleware - Tutorial](https://www.youtube.com/watch?v=1WmNX1yaBq0)
- 📖 [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## 9. INTEGRACIÓN DE PAGOS

### 9.1 Configurar Flow

**Pasos:**
1. Crear cuenta en [flow.cl](https://www.flow.cl)
2. Obtener API Key y Secret Key
3. Configurar URLs de callback

**Recursos de Aprendizaje:**
- 📺 [Integración de Pagos en Web](https://www.youtube.com/watch?v=example)
- 📖 [Flow Documentation](https://www.flow.cl/documentacion)

**Conceptos Clave:**
- Pasarela de pago procesa transacciones
- Webhooks para confirmar pagos
- Manejo seguro de datos de tarjetas

---

## 10. DEPLOY A PRODUCCIÓN

### 10.1 Deploy a Vercel

**Comandos:**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Recursos de Aprendizaje:**
- 📺 [Deploy Next.js a Vercel - Tutorial](https://www.youtube.com/watch?v=example)
- 📺 [Vercel desde Cero](https://www.youtube.com/watch?v=example)
- 📖 [Vercel Documentation](https://vercel.com/docs)

**Conceptos Clave:**
- Vercel es el creador de Next.js
- Deploy automático desde Git
- Variables de entorno en dashboard

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Setup ✅
- [ ] Instalar Node.js y npm
- [ ] Crear proyecto Next.js
- [ ] Instalar dependencias
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS

### Fase 2: Supabase
- [ ] Crear proyecto en Supabase
- [ ] Ejecutar schema SQL
- [ ] Crear buckets de Storage
- [ ] Generar tipos TypeScript
- [ ] Configurar variables de entorno

### Fase 3: Autenticación
- [ ] Implementar registro
- [ ] Implementar login
- [ ] Implementar logout
- [ ] Middleware de auth
- [ ] Proteger rutas

### Fase 4: API Routes
- [ ] API de eventos
- [ ] API de convocatorias
- [ ] API de aplicaciones
- [ ] API de pagos
- [ ] API de upload

### Fase 5: Frontend
- [ ] Componentes UI
- [ ] Páginas públicas
- [ ] Dashboard usuario
- [ ] Panel admin
- [ ] Responsive design

### Fase 6: Deploy
- [ ] Configurar Vercel
- [ ] Variables de entorno
- [ ] Dominio personalizado
- [ ] SSL/HTTPS
- [ ] Testing final

---

## 📚 RECURSOS ADICIONALES

### Canales de YouTube Recomendados
- **MiduDev** - Next.js y React
- **Fazt Code** - Full Stack Development
- **HolaMundo** - Programación en general
- **freeCodeCamp Español** - Cursos completos

### Documentación Oficial
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Comunidades
- [Discord de Next.js](https://discord.gg/nextjs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)
- [Reddit r/nextjs](https://www.reddit.com/r/nextjs/)

---

## 🎯 PRÓXIMOS PASOS

1. **Completar Fase 1**: Setup completo del proyecto
2. **Estudiar Recursos**: Revisar videos y documentación
3. **Implementar Fase 2**: API Routes básicas
4. **Practicar**: Crear proyectos pequeños para practicar
5. **Iterar**: Mejorar y refinar el código

---

**¡Éxito en tu aprendizaje! 🚀**

*Esta guía es un documento vivo. Actualízala con tus propios descubrimientos y recursos útiles.*
