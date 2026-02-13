# 🚀 Guía de Deploy a Vercel - The Master Street

## ¿Qué es Vercel?

Vercel es la plataforma creada por los mismos desarrolladores de Next.js. Es la mejor opción para desplegar proyectos Next.js porque:

- **Gratis** para proyectos personales
- **Deploy automático** cada vez que subes código a GitHub
- **HTTPS** automático (SSL gratuito)
- **CDN global** (tu sitio carga rápido en todo el mundo)
- **Serverless functions** para las API routes

**Recursos de aprendizaje:**
- 📺 [Vercel desde Cero - Tutorial Completo](https://www.youtube.com/watch?v=KlMz6BfLDSY)
- 📺 [Deploy Next.js a Vercel](https://www.youtube.com/watch?v=2HBIzEx6IZA)
- 📖 [Documentación de Vercel](https://vercel.com/docs)

---

## REQUISITOS PREVIOS

Antes de comenzar necesitas:

1. ✅ Proyecto subido a GitHub (ya lo tienes)
2. ✅ Cuenta de GitHub
3. ⬜ Cuenta de Vercel (la crearemos)
4. ⬜ Proyecto de Supabase configurado (para las variables de entorno)

---

## PASO 1: Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Clic en **"Start Deploying"** o **"Sign Up"**
3. Selecciona **"Continue with GitHub"** (recomendado)
4. Autoriza a Vercel a acceder a tu GitHub
5. ¡Listo! Ya tienes cuenta en Vercel

---

## PASO 2: Importar Proyecto desde GitHub

1. En el dashboard de Vercel, clic en **"Add New..."** > **"Project"**
2. Verás una lista de tus repositorios de GitHub
3. Busca **"the-master-street"** (o el nombre que le pusiste)
4. Clic en **"Import"**

---

## PASO 3: Configurar el Proyecto

En la pantalla de configuración:

### Framework Preset
- Vercel detecta automáticamente que es **Next.js** ✅

### Root Directory
- Déjalo vacío (el proyecto está en la raíz) ✅

### Build and Output Settings
- Déjalos como están (Vercel los configura automáticamente) ✅

### Environment Variables (¡IMPORTANTE!)

Aquí debes agregar las variables de entorno. Clic en **"Environment Variables"** y agrega:

```
NEXT_PUBLIC_SUPABASE_URL = tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_anon_key
SUPABASE_SERVICE_ROLE_KEY = tu_service_role_key
NEXT_PUBLIC_APP_URL = https://tu-proyecto.vercel.app
NEXT_PUBLIC_APP_NAME = The Master Street
```

**¿De dónde saco estas variables?**

1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

---

## PASO 4: Deploy

1. Clic en **"Deploy"**
2. Espera 1-3 minutos mientras Vercel:
   - Clona tu repositorio
   - Instala dependencias
   - Ejecuta el build
   - Despliega a producción

3. ¡Verás una pantalla de éxito con tu URL! 🎉

Tu sitio estará en algo como:
- `https://the-master-street.vercel.app`
- O un nombre aleatorio como `https://the-master-street-abc123.vercel.app`

---

## PASO 5: Configurar Dominio Personalizado (Opcional)

Si tienes un dominio como `masterstreet.cl`:

1. En Vercel, ve a tu proyecto
2. Clic en **"Settings"** > **"Domains"**
3. Escribe tu dominio: `masterstreet.cl`
4. Clic en **"Add"**
5. Vercel te dará instrucciones para configurar DNS

### Configurar DNS en tu proveedor (NIC Chile, GoDaddy, etc.)

Agrega estos registros:

```
Tipo: A
Nombre: @
Valor: 76.76.21.21

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
```

Espera 24-48 horas para que se propague.

---

## PASO 6: Verificar que Todo Funciona

1. Abre tu URL de Vercel
2. Verifica que la página de inicio carga
3. Prueba el login/registro
4. Verifica que las APIs funcionan

### Si algo no funciona:

1. Ve a Vercel > Tu proyecto > **"Deployments"**
2. Clic en el deployment más reciente
3. Clic en **"Functions"** para ver logs de las API routes
4. Clic en **"Build Logs"** para ver errores del build

---

## CONFIGURACIÓN ADICIONAL

### Agregar más Variables de Entorno

Para Flow (pagos) y Resend (emails):

```
FLOW_API_KEY = tu_api_key_de_flow
FLOW_SECRET_KEY = tu_secret_de_flow
FLOW_API_URL = https://www.flow.cl/api

RESEND_API_KEY = tu_api_key_de_resend
EMAIL_FROM = noreply@masterstreet.cl
```

### Actualizar Variables

1. Ve a tu proyecto en Vercel
2. **Settings** > **Environment Variables**
3. Agrega o edita las variables
4. **IMPORTANTE:** Después de cambiar variables, haz un nuevo deploy:
   - Ve a **Deployments**
   - Clic en **"..."** > **"Redeploy"**

---

## DEPLOY AUTOMÁTICO

Cada vez que hagas `git push` a GitHub:
1. Vercel detecta el cambio automáticamente
2. Crea un nuevo deploy
3. Tu sitio se actualiza en 1-2 minutos

### Preview Deployments

Si creas una rama diferente a `main`:
- Vercel crea un "Preview Deployment" 
- Puedes probar cambios sin afectar producción
- La URL será algo como: `https://the-master-street-git-feature-branch.vercel.app`

---

## COMANDOS ÚTILES (Vercel CLI)

También puedes usar Vercel desde la terminal:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy manual (preview)
vercel

# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs

# Ver información del proyecto
vercel inspect
```

---

## CHECKLIST DE DEPLOY

### Antes del deploy:
- [ ] Proyecto subido a GitHub
- [ ] Cuenta de Vercel creada
- [ ] Supabase configurado
- [ ] Variables de entorno listas

### Durante el deploy:
- [ ] Proyecto importado desde GitHub
- [ ] Variables de entorno agregadas
- [ ] Build exitoso

### Después del deploy:
- [ ] Sitio accesible
- [ ] Login/registro funciona
- [ ] APIs responden correctamente
- [ ] Dominio personalizado (opcional)

---

## SOLUCIÓN DE PROBLEMAS

### Error: "Build failed"
- Revisa los Build Logs en Vercel
- Ejecuta `npm run build` localmente para ver el error

### Error: "500 Internal Server Error" en APIs
- Verifica que las variables de entorno están configuradas
- Revisa los logs de Functions en Vercel

### Error: "Module not found"
- Verifica que todas las dependencias están en `package.json`
- Haz un nuevo deploy

### El sitio no se actualiza
- Verifica que el push a GitHub fue exitoso
- Revisa en Vercel si hay un nuevo deployment pendiente

---

## RECURSOS ADICIONALES

- 📺 [Vercel + Next.js - Tutorial Completo](https://www.youtube.com/watch?v=2HBIzEx6IZA)
- 📺 [Configurar Dominio en Vercel](https://www.youtube.com/watch?v=example)
- 📖 [Vercel Docs - Environment Variables](https://vercel.com/docs/environment-variables)
- 📖 [Vercel Docs - Domains](https://vercel.com/docs/projects/domains)

---

## COSTOS

### Plan Hobby (Gratis)
- Proyectos personales
- 100GB de bandwidth/mes
- Serverless functions incluidas
- SSL automático
- ✅ Perfecto para empezar

### Plan Pro ($20/mes)
- Más bandwidth
- Más builds concurrentes
- Analytics avanzados
- Soporte prioritario

---

**¡Tu proyecto está listo para el mundo!** 🌎
