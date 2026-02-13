# The Master Street Platform

Plataforma de venta de entradas y gestión de convocatorias para eventos de freestyle.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU-USUARIO/the-master-street)

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
   
  



## 🏃 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

## 📁 Estructura del Proyecto



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


### Row Level Security (RLS)

Las políticas RLS están configuradas en el schema SQL. Ajustar según necesidades de seguridad.

## 📚 Documentación

-

## 🤝 Contribución

Este es un proyecto privado. Para contribuciones, contactar al equipo de desarrollo.


