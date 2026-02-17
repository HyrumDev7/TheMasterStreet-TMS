# Documentación The Master Street (TMS)

Documentación unificada del proyecto. Cada sección indica su **fuente** (archivo original).

---

## Índice

1. [Presentación del proyecto](#1-presentación-del-proyecto) — *README*
2. [Configuración inicial](#2-configuración-inicial) — *SETUP*
3. [Comandos rápidos](#3-comandos-rápidos) — *COMANDOS_RAPIDOS*
4. [Estructura del frontend (HTML vs CSS)](#4-estructura-del-frontend-html-vs-css)
5. [Medidas de imágenes](#5-medidas-de-imágenes) — *MEDIDAS_IMAGENES*
6. [Pasos para producción](#6-pasos-para-producción) — *PASOS_PRODUCCION*
7. [Producción masterstreet.cl](#7-producción-masterstreetcl) — *PRODUCCION_MASTERSTREET*
8. [Deploy a Vercel](#8-deploy-a-vercel) — *DEPLOY_VERCEL*
9. [Subir proyecto a GitHub](#9-subir-proyecto-a-github) — *SUBIR_A_GITHUB*
10. [Correos @masterstreet.cl](#10-correos-masterstreetcl) — *SOLUCION_CORREOS_MASTERSTREET*
11. [Solución 404 NOT_FOUND](#11-solución-404-not_found) — *SOLUCION_NOT_FOUND*
12. [Guía de aprendizaje](#12-guía-de-aprendizaje) — *GUIA_APRENDIZAJE*
13. [Fase 2 completada (APIs)](#13-fase-2-completada-apis) — *FASE2_COMPLETADA*

---

## 1. Presentación del proyecto

**Fuente:** `README.md`

# The Master Street Platform

Plataforma de venta de entradas y gestión de convocatorias para eventos de freestyle.

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
- **Backend:** Next.js API Routes  
- **Database:** Supabase (PostgreSQL)  
- **Auth:** Supabase Auth  
- **Storage:** Supabase Storage  
- **Payments:** Flow / Transbank  
- **Email:** Resend  
- **Deployment:** Vercel  

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta Supabase, Flow/Transbank, Resend

### Instalación

```bash
git clone <repository-url>
cd TMS
npm install
cp .env.example .env.local
```

### Desarrollo

```bash
npm run dev
# http://localhost:3000
```

### Base de datos

Schema en `database/schema.sql`. Ejecutar en Supabase Dashboard > SQL Editor.

---

## 2. Configuración inicial

**Fuente:** `SETUP.md`

Checklist: instalación de dependencias, configurar Supabase (proyecto, schema SQL, buckets, tipos), variables de entorno, Flow, Resend. Verificar con `npm run type-check`, `npm run lint`, `npm run dev`.

Pasos detallados: crear proyecto Supabase, ejecutar `database/schema.sql`, crear buckets `videos` (público 100MB), `images` (público 5MB), `documents` (privado), generar tipos con `npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts`, configurar `.env.local` desde `env.example`.

Problemas comunes: módulo auth-helpers, API key inválida, schema SQL por bloques, project-id para tipos.

---

## 3. Comandos rápidos

**Fuente:** `COMANDOS_RAPIDOS.md`

- **Instalación:** `node --version`, `npm install`, `npm run dev`, `npm run build`, `npm run start`, `npm run type-check`, `npm run lint`
- **Supabase:** `npx supabase login`, `npx supabase gen types typescript --project-id REF > src/types/database.ts`
- **Vercel:** `vercel login`, `vercel`, `vercel --prod`, `vercel logs`
- **Git:** `git init`, `git add .`, `git commit -m "..."`, `git remote add origin <url>`, `git push -u origin main`
- **Desarrollo:** limpiar `.next`, reinstalar `node_modules`, `npx tsc --noEmit`, Prettier, ESLint
- **Paquetes:** `npm install`, `npm install -D`, `npm uninstall`, `npm update`, `npm outdated`

---

## 4. Estructura del frontend (HTML vs CSS)

**Descripción:** En el frontend los archivos se dividen en dos tipos para que puedas ordenarlos con claridad.

### Archivos de vista / estructura (HTML — TSX/JSX)

Definen la estructura y el contenido de las páginas. Ubicación actual:

| Ruta | Descripción |
|------|-------------|
| `src/app/page.tsx` | Página de inicio (Hero, cards) |
| `src/app/layout.tsx` | Layout raíz (Header, Footer) |
| `src/app/eventos/page.tsx` | Página de eventos |
| `src/app/convocatorias/page.tsx` | Convocatorias |
| `src/app/perfil/page.tsx` | Perfil de usuario |
| `src/app/auth/login/page.tsx` | Login |
| `src/app/auth/registro/page.tsx` | Registro |
| `src/app/auth/recuperar/page.tsx` | Recuperar contraseña |
| `src/components/layout/Header.tsx` | Cabecera y navegación |
| `src/components/layout/Footer.tsx` | Pie de página |
| `src/components/ui/*.tsx` | Botones, inputs, modales, etc. |
| `src/components/eventos/EventCard.tsx` | Card de evento |

### Archivos de estilo (CSS)

Estilos globales y configuración de diseño. Ubicación:

| Ruta | Descripción |
|------|-------------|
| `src/styles/globals.css` | Estilos globales, variables, utilidades |
| `tailwind.config.ts` | Breakpoints, colores, tema Tailwind |

La mayoría del diseño se hace con clases de Tailwind en los propios componentes (TSX); `globals.css` se usa para reset, variables y excepciones.

---

## 5. Medidas de imágenes

**Fuente:** `MEDIDAS_IMAGENES.md`

- **Hero (transfondo completo):** `public/images/hero-home.png` — **1920 × 2400 px** (o 1920 × 2600 px). Cubre Hero + Cards, todo el body superior. Proporción ~1:1.25. Full-width, enfoque central, desaturada.
- **Cards (5):** proporción 4:3, 380 × 285 px (o 760 × 570 retina). Nombres: `card-eventos`, `card-calendario`, `card-noticias`, `card-shop`, `card-historia` (extensiones .jpg o .png según uso).
- **Estilo:** oscuro, urbano, sin texto dentro de la imagen; optimización &lt; 200 KB, JPG/WebP 80–85%.

---

## 6. Pasos para producción

**Fuente:** `PASOS_PRODUCCION.md`

1. **Vercel → Environment Variables:** `NEXT_PUBLIC_APP_URL` = `https://www.masterstreet.cl`
2. **Vercel → Domains:** tener `www.masterstreet.cl` (y opcional `masterstreet.cl`). DNS: A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`
3. Subir cambios: `git add .`, `git commit -m "..."`, `git push origin main`
4. Si cambiaste variables: Deployments → último → "..." → Redeploy
5. Comprobar: https://www.masterstreet.cl y rutas; si está apex, que redirija a www

---

## 7. Producción masterstreet.cl

**Fuente:** `PRODUCCION_MASTERSTREET.md`

Problema: sitio muestra o redirige a localhost:3000. Causa: `NEXT_PUBLIC_APP_URL` incorrecta o por defecto. Solución: en Vercel → Environment Variables poner `NEXT_PUBLIC_APP_URL` = `https://www.masterstreet.cl` (sin barra final); luego Redeploy. Dominios: ambos (apex y www) en Vercel; redirect apex → www en `vercel.json`. Resend: DKIM/SPF/MX pueden tardar 24–48 h. Checklist: variable configurada, redeploy, probar www y pagos.

---

## 8. Deploy a Vercel

**Fuente:** `DEPLOY_VERCEL.md`

Requisitos: proyecto en GitHub, cuenta Vercel, Supabase configurado. Pasos: crear cuenta Vercel (con GitHub), Import project desde GitHub, configurar Environment Variables (Supabase URL, anon key, service_role, `NEXT_PUBLIC_APP_URL`, etc.), Deploy. Dominio personalizado: Settings → Domains, añadir dominio y DNS (A y CNAME). Variables adicionales: Flow, Resend. Redeploy tras cambiar variables. Deploy automático en cada push. Checklist antes/durante/después del deploy. Solución de problemas: build failed, 500 en APIs, module not found.

---

## 9. Subir proyecto a GitHub

**Fuente:** `SUBIR_A_GITHUB.md`

Requisitos: cuenta GitHub, Git instalado. Pasos: configurar `user.name` y `user.email`, crear repo en GitHub (sin README/.gitignore si ya existen), `git init`, `git add .`, `git commit -m "..."`, `git remote add origin <url>`, `git push -u origin main`. Si pide contraseña: usar Personal Access Token. Comandos futuros: `git status`, `add`, `commit`, `push`, `pull`, `log`, `diff`. Problemas: remote origin exists, push rechazado, autenticación.

---

## 10. Correos @masterstreet.cl

**Fuente:** `SOLUCION_CORREOS_MASTERSTREET.md`

Objetivo: que los correos lleguen a bandeja. Diagnóstico cPanel: DKIM y SPF Resend presentes; falta o falla **MX** para `send.masterstreet.cl` → `feedback-smtp.sa-east-1.amazonses.com` (prioridad 10). Pasos: Zone Editor → Add Record MX, Name `send`, Priority 10, Destination ese valor. Resend: verificar DKIM y SPF (Enable Sending) en Verified. DMARC: `p=quarantine`; SPF/DKIM deben estar bien. Supabase Auth: configurar SMTP con Resend y `noreply@masterstreet.cl`. MXToolbox: revisar `send.masterstreet.cl` (MX y SPF) y `masterstreet.cl` (DMARC), no solo www. Checklist: MX agregado, Resend Verified, 24–48 h DNS, SMTP en Supabase si aplica.

---

## 11. Solución 404 NOT_FOUND

**Fuente:** `SOLUCION_NOT_FOUND.md`

Causa: en Vercel → Domains solo estaba `www.masterstreet.cl`; falta `masterstreet.cl`. Solución: añadir ambos dominios en Vercel. DNS: A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`. Redirect en `vercel.json` solo aplica si el dominio está asignado al proyecto. Opciones: dominio único (apex + www con redirect), solo www (redirect en DNS), o solo apex.

---

## 12. Guía de aprendizaje

**Fuente:** `GUIA_APRENDIZAJE.md`

Guía larga para ingenieros: configuración inicial, Next.js 14 y App Router, TypeScript, Supabase (DB, Auth, Storage, tipos), Tailwind, Zod, API Routes, autenticación, pagos, deploy. Incluye bitácora de pasos (crear proyecto Supabase, `.env.local`, schema SQL, buckets, generar tipos, probar local), recursos en español (videos, docs), ejercicios y checklist por fases.

---

## 13. Fase 2 completada (APIs)

**Fuente:** `FASE2_COMPLETADA.md`

Resumen de APIs: Auth (register, login, logout), Eventos (CRUD, listado, filtros), Convocatorias (listado, detalle, aplicar con video), Aplicaciones (del usuario), Pagos Flow (init, confirm), Upload (video, imagen). Utilidades: Flow integration, generador QR. Seguridad: auth, roles, Zod, sanitización. TODOs: emails transaccionales, rate limiting, caché, testing.

---

*Documentación generada a partir de los archivos .md del proyecto. Para detalles completos de cada tema, se conservaban los archivos originales; este documento unificado sirve como índice y referencia.*
