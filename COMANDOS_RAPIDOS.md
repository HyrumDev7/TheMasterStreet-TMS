# ⚡ Comandos Rápidos - The Master Street

## Guía de Referencia Rápida de Comandos

---

## 📦 INSTALACIÓN INICIAL

```bash
# Verificar Node.js (debe ser 18+)
node --version

# Verificar npm
npm --version

# Instalar dependencias del proyecto
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm run start

# Verificar tipos TypeScript
npm run type-check

# Ejecutar linter
npm run lint
```

---

## 🗄️ SUPABASE

```bash
# Instalar Supabase CLI globalmente
npm install -g supabase

# Login en Supabase CLI
npx supabase login

# Generar tipos TypeScript desde Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts

# Inicializar proyecto Supabase local (opcional)
npx supabase init

# Iniciar Supabase local (opcional)
npx supabase start
```

**Obtener Project ID:**
- Ir a Supabase Dashboard
- Settings > General > Reference ID

---

## 🚀 VERCEL (DEPLOY)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Listar proyectos
vercel ls
```

---

## 📝 GIT

```bash
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Commit
git commit -m "Mensaje descriptivo"

# Conectar con repositorio remoto
git remote add origin <url-del-repositorio>

# Push a main
git push -u origin main

# Crear nueva rama
git checkout -b nombre-rama

# Cambiar de rama
git checkout nombre-rama

# Ver estado
git status

# Ver historial
git log --oneline
```

---

## 🔧 DESARROLLO

```bash
# Limpiar cache de Next.js
rm -rf .next

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar configuración TypeScript
npx tsc --noEmit

# Formatear código con Prettier
npx prettier --write .

# Verificar con ESLint
npx eslint .
```

---

## 📦 GESTIÓN DE PAQUETES

```bash
# Instalar paquete
npm install nombre-paquete

# Instalar paquete como dev dependency
npm install -D nombre-paquete

# Desinstalar paquete
npm uninstall nombre-paquete

# Actualizar paquetes
npm update

# Verificar paquetes desactualizados
npm outdated

# Limpiar cache de npm
npm cache clean --force
```

---

## 🧪 TESTING (Futuro)

```bash
# Instalar Jest y Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## 🐳 DOCKER (Opcional)

```bash
# Construir imagen
docker build -t master-street .

# Ejecutar contenedor
docker run -p 3000:3000 master-street

# Ver contenedores activos
docker ps

# Detener contenedor
docker stop <container-id>
```

---

## 📊 ANÁLISIS

```bash
# Analizar bundle size
npm run build
npx @next/bundle-analyzer

# Verificar performance
npm run build
npm run start
# Abrir http://localhost:3000 y usar Lighthouse
```

---

## 🔍 DEBUGGING

```bash
# Ejecutar con debug
NODE_OPTIONS='--inspect' npm run dev

# Ver variables de entorno (sin valores sensibles)
node -e "console.log(process.env)"

# Verificar conexión a Supabase
node -e "const { createClient } = require('@supabase/supabase-js'); console.log('Supabase OK')"
```

---

## 📚 DOCUMENTACIÓN

```bash
# Generar documentación (si usas TypeDoc)
npx typedoc --out docs src

# Ver documentación local
cd docs && python -m http.server 8000
```

---

## 🧹 LIMPIEZA

```bash
# Limpiar todo (cuidado!)
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 💡 TIPS ÚTILES

### Verificar puerto 3000 ocupado
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -ti:3000
```

### Matar proceso en puerto 3000
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 $(lsof -ti:3000)
```

### Ver tamaño de node_modules
```bash
# Mac/Linux
du -sh node_modules

# Windows (PowerShell)
(Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

---

**Guarda este archivo para referencia rápida! 📌**
