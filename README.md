# The Master Street Platform

Plataforma de venta de entradas y gestión de convocatorias para eventos de freestyle.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Flow / Transbank
- **Email**: Resend
- **Deployment**: Vercel

## 📋 Prerequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Flow o Transbank (para pagos)
- Cuenta de Resend (para emails)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd TMS
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus credenciales:
   - Supabase URL y keys
   - Flow/Transbank credentials
   - Resend API key
   - Otras configuraciones necesarias

4. **Configurar Supabase**
   - Crear un nuevo proyecto en [Supabase](https://supabase.com)
   - Ejecutar el schema SQL en Supabase Dashboard > SQL Editor:
     ```bash
     # Copiar y ejecutar el contenido de database/schema.sql
     ```
   - Crear buckets de Storage:
     - `videos` (público, max 100MB)
     - `images` (público, max 5MB)
     - `documents` (privado)

5. **Generar tipos TypeScript desde Supabase**
   ```bash
   npx supabase gen types typescript --project-id your-project-ref > src/types/database.ts
   ```

## 🏃 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

## 📁 Estructura del Proyecto

```
TMS/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React
│   ├── lib/              # Utilidades y configuración
│   │   ├── supabase/     # Clientes Supabase
│   │   ├── validations/  # Schemas Zod
│   │   ├── payments/     # Integración pagos
│   │   └── utils/        # Utilidades
│   ├── types/            # TypeScript types
│   └── hooks/            # Custom React hooks
├── database/
│   └── schema.sql        # Schema de base de datos
└── public/               # Archivos estáticos
```

## 🗄️ Base de Datos

El schema completo está en `database/schema.sql`. Ejecutar en Supabase Dashboard > SQL Editor.

### Tablas principales:
- `profiles` - Perfiles de usuarios
- `eventos` - Eventos y batallas
- `convocatorias` - Convocatorias abiertas
- `aplicaciones` - Aplicaciones de competidores
- `ordenes_compra` - Órdenes de compra
- `entradas` - Entradas vendidas
- `noticias` - Blog/Noticias
- Y más...

## 🔐 Autenticación

- Usuarios pueden registrarse con RUT chileno
- Validación de RUT implementada
- Usuarios invitados pueden comprar entradas sin registro
- Registro requerido para aplicar a convocatorias

## 💳 Pagos

Integración con Flow (principal) y Transbank (alternativa):
- Creación de órdenes
- Inicialización de pagos
- Confirmación de pagos
- Generación de QR para entradas

## 📧 Emails

Templates de email con Resend:
- Bienvenida
- Confirmación de compra
- QR de entrada
- Confirmación de aplicación
- Aprobación/rechazo

## 🚢 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Configurar variables de entorno en Vercel Dashboard.

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Iniciar servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 Configuración Adicional

### Supabase Storage

Crear buckets con las siguientes configuraciones:
- **videos**: Público, tamaño máximo 100MB
- **images**: Público, tamaño máximo 5MB
- **documents**: Privado

### Row Level Security (RLS)

Las políticas RLS están configuradas en el schema SQL. Ajustar según necesidades de seguridad.

## 📚 Documentación

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribución

Este es un proyecto privado. Para contribuciones, contactar al equipo de desarrollo.

## 📄 Licencia

Privado - The Master Street

---

**Desarrollado con ❤️ para The Master Street**
