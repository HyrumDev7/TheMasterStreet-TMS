# Pasos para dejar la página en producción (www.masterstreet.cl)

Sigue estos pasos en orden para que **www.masterstreet.cl** abra tu sitio correctamente.

---

## 1. Variable de entorno en Vercel

En **Vercel** → tu proyecto → **Settings** → **Environment Variables**:

- **Nombre:** `NEXT_PUBLIC_APP_URL`
- **Valor:** `https://www.masterstreet.cl` (sin barra al final)
- **Entornos:** Production y Preview (o "All Environments")

Si ya la tienes, revisa que el valor sea exactamente ese. Si la cambias, debes hacer un **Redeploy** (paso 4).

---

## 2. Dominios en Vercel

En **Settings** → **Domains**:

1. Debe aparecer **www.masterstreet.cl**.
2. Si no está, agrega:
   - Clic en **Add**
   - Escribe: `www.masterstreet.cl`
   - Sigue las instrucciones de DNS si Vercel te las pide.
3. Opcional: agrega también `masterstreet.cl` (sin www). Así, quien escriba `masterstreet.cl` será redirigido a `www.masterstreet.cl`.

**DNS en tu proveedor (NIC Chile, Cloudflare, etc.):**

| Tipo  | Nombre | Valor              |
|-------|--------|--------------------|
| A     | `@`    | `76.76.21.21`      |
| CNAME | `www`  | `cname.vercel-dns.com` |

---

## 3. Subir los últimos cambios

Si acabas de corregir algo en el código (por ejemplo `vercel.json`):

```bash
git add .
git commit -m "fix: redirect solo apex a www, producción"
git push origin main
```

Vercel hará el deploy automático al hacer push a `main`.

---

## 4. Redeploy (si cambiaste variables)

Si modificaste **Environment Variables** (sobre todo `NEXT_PUBLIC_APP_URL`):

1. **Deployments** → último deployment
2. Clic en **"..."** → **Redeploy**
3. Confirmar

Las variables `NEXT_PUBLIC_*` solo se aplican en el próximo build.

---

## 5. Comprobar que todo funciona

1. Abre **https://www.masterstreet.cl** en el navegador.
2. Debe cargar la página de inicio (no localhost ni pantalla en blanco).
3. Navega a otras rutas (ej. `/eventos`, `/auth/login`) y verifica que no redirijan al inicio.
4. Si tienes `masterstreet.cl` configurado, entra a **https://masterstreet.cl** y comprueba que redirija a **https://www.masterstreet.cl** manteniendo la ruta.

---

## Resumen rápido

| Paso | Dónde | Qué hacer |
|------|--------|-----------|
| 1 | Vercel → Settings → Environment Variables | `NEXT_PUBLIC_APP_URL` = `https://www.masterstreet.cl` |
| 2 | Vercel → Settings → Domains | Tener `www.masterstreet.cl` (y opcional `masterstreet.cl`) |
| 3 | Tu repo | `git push origin main` si hay cambios |
| 4 | Vercel → Deployments | Redeploy si cambiaste variables |
| 5 | Navegador | Abrir https://www.masterstreet.cl y probar rutas |

Cuando todo esto esté hecho, la página quedará en producción y podrás abrirla desde **www.masterstreet.cl**.
