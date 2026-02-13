# 🚀 Guía de Configuración Inicial - The Master Street

Esta guía te ayudará a configurar el proyecto desde cero.

## 📋 Checklist de Configuración

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. **Crear proyecto en Supabase**
   - Ir a [supabase.com](https://supabase.com)
   - Crear un nuevo proyecto
   - Anotar la URL y las API keys

2. **Ejecutar Schema SQL**
   - Ir a Supabase Dashboard > SQL Editor
   - Copiar el contenido de `database/schema.sql`
   - Ejecutar el script completo
   - Verificar que todas las tablas se crearon correctamente

3. **Configurar Storage Buckets**
   - Ir a Storage en Supabase Dashboard
   - Crear los siguientes buckets:
     - **videos**: Público, tamaño máximo 100MB
     - **images**: Público, tamaño máximo 5MB
     - **documents**: Privado

4. **Generar Tipos TypeScript**
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts
   ```
   Reemplazar `YOUR_PROJECT_REF` con el ID de tu proyecto (se encuentra en la URL de Supabase)

### 3. Configurar Variables de Entorno

1. **Crear archivo `.env.local`**
   ```bash
   cp env.example .env.local
   ```

2. **Completar las variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key de Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (mantener secreto)
   - Otras variables según necesites

### 4. Configurar Pasarela de Pago (Flow)

1. Crear cuenta en [Flow](https://www.flow.cl)
2. Obtener API Key y Secret Key
3. Configurar URLs de callback:
   - Confirmación: `https://tu-dominio.com/api/pagos/flow/confirm`
   - Retorno: `https://tu-dominio.com/api/pagos/flow/return`

### 5. Configurar Email (Resend)

1. Crear cuenta en [Resend](https://resend.com)
2. Verificar dominio (opcional pero recomendado)
3. Obtener API Key
4. Agregar a `.env.local`

### 6. Verificar Instalación

```bash
# Verificar tipos TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Iniciar servidor de desarrollo
npm run dev
```

Si todo está bien, deberías poder acceder a `http://localhost:3000`

## 🔧 Próximos Pasos

Una vez configurado el proyecto base:

1. **Implementar API Routes** (Fase 2)
   - `/api/auth/register`
   - `/api/auth/login`
   - `/api/eventos`
   - `/api/convocatorias`
   - etc.

2. **Crear Componentes Frontend** (Fase 3)
   - Header y Footer
   - Formularios de registro/login
   - Cards de eventos
   - etc.

3. **Integrar Pagos** (Fase 4)
   - Implementar Flow SDK
   - Crear flujo de checkout
   - Generar QR codes

4. **Testing y Deploy** (Fase 5)
   - Testing de funcionalidades
   - Deploy a Vercel
   - Configurar dominio

## ⚠️ Problemas Comunes

### Error: "Cannot find module '@supabase/auth-helpers-nextjs'"
**Solución**: Ejecutar `npm install` nuevamente

### Error: "Invalid API key" en Supabase
**Solución**: Verificar que las keys en `.env.local` sean correctas

### Error al ejecutar schema SQL
**Solución**: Ejecutar el SQL en partes, verificando cada sección

### Tipos TypeScript no se generan
**Solución**: Verificar que el project-id sea correcto y que tengas acceso al proyecto

## 📚 Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Flow](https://www.flow.cl/documentacion)
- [Documentación Resend](https://resend.com/docs)

---

¿Necesitas ayuda? Revisa la documentación o contacta al equipo de desarrollo.
