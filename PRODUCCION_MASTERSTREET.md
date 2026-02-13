# Producción - masterstreet.cl

Guía para que tu sitio funcione correctamente en **www.masterstreet.cl** sin redirecciones a localhost:3000.

---

## Problema: El sitio muestra o redirige a localhost:3000

**Causa:** La variable `NEXT_PUBLIC_APP_URL` no está configurada correctamente en Vercel, o usas el valor por defecto (`http://localhost:3000`). Esta variable se usa para:

- URLs de retorno de Flow (pagos)
- Enlaces en correos (Resend)
- Cualquier redirección basada en la URL de la app

---

## Solución: Configurar variables en Vercel

### Paso 1: Ir a Environment Variables

1. Entra a [vercel.com](https://vercel.com) → tu proyecto
2. **Settings** → **Environment Variables**

### Paso 2: Agregar o actualizar `NEXT_PUBLIC_APP_URL`

| Variable               | Valor                        | Entornos  |
|------------------------|------------------------------|-----------|
| `NEXT_PUBLIC_APP_URL`  | `https://www.masterstreet.cl`| Production, Preview |

Importante: usa exactamente `https://www.masterstreet.cl` (sin barra final).

### Paso 3: Redeploy obligatorio

Las variables `NEXT_PUBLIC_*` se incluyen en el build. Después de cambiarlas:

1. **Deployments** → último deployment
2. Menú **"..."** → **Redeploy**
3. Marca **"Use existing Build Cache"** si quieres, pero mejor sin marcar la primera vez
4. Confirmar

---

## Dominio por defecto de Vercel (*.vercel.app)

**¿Eliminar el dominio vercel.app?** No es necesario. Puedes:

- **Mantenerlo:** útil para previews de ramas y pruebas. No afecta a masterstreet.cl.
- **Quitarlo:** si quieres que solo se use tu dominio. En **Settings** → **Domains** puedes eliminar el `*.vercel.app`.

Recomendación: mantenerlo para poder probar branches sin afectar producción.

---

## Dominios: masterstreet.cl y www.masterstreet.cl

Si ya tienes ambos apuntando a Vercel:

- `masterstreet.cl` redirige automáticamente a `www.masterstreet.cl` (regla en `vercel.json`)
- `www.masterstreet.cl` es la URL principal del sitio

Si aún no configuraste DNS, añade en tu proveedor (NIC Chile, Cloudflare, etc.):

```
Tipo: A     | Nombre: @    | Valor: 76.76.21.21
Tipo: CNAME | Nombre: www  | Valor: cname.vercel-dns.com
```

---

## Resend: verificación de dominio

La verificación puede tardar por la propagación DNS:

1. **DKIM:** ya verificado ✅
2. **SPF y MX:** aún en "Pending" → es normal, puede tardar hasta 24–48 horas

Mientras tanto:

- No envíes correos desde `@masterstreet.cl` hasta que todo esté verificado
- Cuando SPF y MX pasen a "Verified", los envíos funcionarán correctamente

---

## Seguridad

Se mantienen las reglas ya configuradas:

- CORS en `/api/*` para las rutas necesarias
- Variables sensibles solo en Vercel (nunca en el repositorio)
- `SUPABASE_SERVICE_ROLE_KEY` solo en el servidor (no expuesta al cliente)

---

## Checklist rápido

- [ ] `NEXT_PUBLIC_APP_URL=https://www.masterstreet.cl` en Vercel
- [ ] Redeploy después de cambiar variables
- [ ] Comprobar que www.masterstreet.cl carga sin redirigir a localhost
- [ ] Probar un pago con Flow (retorno a la URL correcta)
- [ ] Esperar verificación completa de Resend antes de enviar correos
