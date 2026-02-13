# 🚀 Guía Paso a Paso: Subir Proyecto a GitHub

## Requisitos Previos

Antes de comenzar, necesitas:

1. **Cuenta de GitHub** - Si no tienes una, créala en [github.com](https://github.com)
2. **Git instalado** - Verifica con `git --version`

### Instalar Git (si no lo tienes)

**Windows:**
1. Descargar desde: https://git-scm.com/download/win
2. Ejecutar el instalador
3. Aceptar opciones por defecto
4. Reiniciar la terminal

**Verificar instalación:**
```bash
git --version
# Debería mostrar algo como: git version 2.43.0
```

---

## PASO 1: Configurar Git (solo la primera vez)

```bash
# Configurar tu nombre (usa tu nombre real)
git config --global user.name "Tu Nombre"

# Configurar tu email (el mismo de tu cuenta GitHub)
git config --global user.email "tu@email.com"

# Verificar configuración
git config --list
```

**Recursos:**
- 📺 [Configurar Git por primera vez](https://www.youtube.com/watch?v=HiXLkL42tMU)

---

## PASO 2: Crear Repositorio en GitHub

### Opción A: Desde la web de GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Clic en el botón **"+"** (esquina superior derecha)
3. Selecciona **"New repository"**
4. Completa el formulario:
   - **Repository name:** `the-master-street` (o el nombre que prefieras)
   - **Description:** `Plataforma de eventos y convocatorias para freestyle`
   - **Visibility:** Private (recomendado) o Public
   - **NO marques** "Add a README file" (ya tenemos uno)
   - **NO marques** "Add .gitignore" (ya tenemos uno)
5. Clic en **"Create repository"**
6. **IMPORTANTE:** Copia la URL del repositorio que aparece, ejemplo:
   - HTTPS: `https://github.com/tu-usuario/the-master-street.git`
   - SSH: `git@github.com:tu-usuario/the-master-street.git`

---

## PASO 3: Inicializar Git en tu Proyecto

Abre la terminal en la carpeta del proyecto (`C:\TMS`) y ejecuta:

```bash
# 1. Ir a la carpeta del proyecto
cd C:\TMS

# 2. Inicializar repositorio Git
git init

# 3. Verificar que se creó (debe mostrar archivos)
git status
```

**¿Qué hace esto?**
- `git init` crea una carpeta oculta `.git` que contiene todo el historial del proyecto

---

## PASO 4: Agregar Archivos al Stage

```bash
# Agregar TODOS los archivos al stage
git add .

# Verificar qué archivos se agregaron
git status
```

**¿Qué hace esto?**
- `git add .` prepara todos los archivos para ser guardados
- El "stage" es como una zona de preparación

**NOTA:** El archivo `.gitignore` excluye automáticamente:
- `node_modules/` (muy pesado)
- `.env.local` (contiene secretos)
- `.next/` (archivos generados)

---

## PASO 5: Crear el Primer Commit

```bash
# Crear commit con mensaje descriptivo
git commit -m "Configuración inicial del proyecto The Master Street"

# Verificar que se creó el commit
git log --oneline
```

**¿Qué es un commit?**
- Es una "foto" del estado actual de tu proyecto
- El mensaje describe qué cambios incluye

---

## PASO 6: Conectar con GitHub

```bash
# Agregar el repositorio remoto (usa TU URL de GitHub)
git remote add origin https://github.com/TU-USUARIO/the-master-street.git

# Verificar que se agregó
git remote -v
```

**Reemplaza** `TU-USUARIO` con tu nombre de usuario de GitHub.

---

## PASO 7: Subir el Código a GitHub

```bash
# Subir a la rama main
git push -u origin main
```

**Si te pide credenciales:**
1. Ingresa tu nombre de usuario de GitHub
2. Para la contraseña, usa un **Personal Access Token** (PAT)

### Crear Personal Access Token (si lo necesitas)

1. Ve a GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Clic en "Generate new token (classic)"
3. Nombre: "Git TMS"
4. Expiration: 90 días (o el que prefieras)
5. Scopes: marca `repo` (todos los permisos de repo)
6. Clic en "Generate token"
7. **COPIA EL TOKEN** (solo lo verás una vez)
8. Usa ese token como contraseña

**Recursos:**
- 📺 [Crear Personal Access Token en GitHub](https://www.youtube.com/watch?v=SzWBSs8UMfU)

---

## PASO 8: Verificar en GitHub

1. Ve a `https://github.com/TU-USUARIO/the-master-street`
2. Deberías ver todos tus archivos
3. ¡Felicidades! Tu código está en GitHub 🎉

---

## Comandos Resumidos (Todo junto)

```bash
# Navegas a tu proyecto
cd C:\TMS

# Inicializas Git
git init

# Agregas todos los archivos
git add .

# Creas el primer commit
git commit -m "Configuración inicial del proyecto The Master Street"

# Conectas con GitHub (usa TU URL)
git remote add origin https://github.com/TU-USUARIO/the-master-street.git

# Subes el código
git push -u origin main
```

---

## Comandos Útiles para el Futuro

### Guardar cambios nuevos

```bash
# Ver qué archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Crear commit con mensaje
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

### Ver historial

```bash
# Ver todos los commits
git log --oneline

# Ver cambios no guardados
git diff
```

### Descargar cambios de GitHub

```bash
# Descargar últimos cambios
git pull
```

---

## Solución de Problemas Comunes

### Error: "fatal: not a git repository"
**Solución:** Ejecuta `git init` primero

### Error: "remote origin already exists"
**Solución:**
```bash
git remote remove origin
git remote add origin TU_URL
```

### Error: "failed to push some refs"
**Solución:**
```bash
git pull --rebase origin main
git push
```

### Error de autenticación
**Solución:** Usa Personal Access Token en lugar de contraseña

---

## Recursos de Aprendizaje

- 📺 [Git y GitHub desde Cero - Curso Completo](https://www.youtube.com/watch?v=3GymExBkKjE)
- 📺 [Git para Principiantes](https://www.youtube.com/watch?v=VdGzPZ31ts8)
- 📖 [GitHub Docs](https://docs.github.com/es)
- 📖 [Git Book (español)](https://git-scm.com/book/es/v2)

---

## Siguiente Paso: Configurar en otro computador

Si quieres trabajar en otro computador:

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/the-master-street.git

# Entrar a la carpeta
cd the-master-street

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
# (Copia env.example a .env.local y completa)

# Iniciar desarrollo
npm run dev
```

---

**¡Listo! Tu proyecto ahora está respaldado en GitHub.** 🎉
