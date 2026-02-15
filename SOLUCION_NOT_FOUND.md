# Solución al error 404 NOT_FOUND en masterstreet.cl

## 1. La solución: qué cambiar

### En Vercel (principal causa)

**Agregar ambos dominios** en **Settings → Domains**:

| Dominio | Estado |
|---------|--------|
| `www.masterstreet.cl` | ✅ Debe estar agregado |
| `masterstreet.cl` | ⚠️ **Debe estar agregado también** |

Si solo tienes `www.masterstreet.cl`, las visitas a `masterstreet.cl` devuelven **404 NOT_FOUND**.

Pasos en Vercel:
1. Ir a tu proyecto → **Settings** → **Domains**
2. **Add** → escribir `masterstreet.cl` (sin www)
3. Configurar DNS si lo pide Vercel
4. Repetir lo mismo con `www.masterstreet.cl` si no está

### DNS en tu proveedor (NIC Chile, Cloudflare, etc.)

Asegúrate de tener:

```
Tipo: A     | Nombre: @    | Valor: 76.76.21.21
Tipo: CNAME | Nombre: www  | Valor: cname.vercel-dns.com
```

### Verificación rápida

- `https://www.masterstreet.cl` → debe cargar el sitio
- `https://masterstreet.cl` → debe redirigir a `https://www.masterstreet.cl`

Si `masterstreet.cl` da 404 pero `www.masterstreet.cl` funciona, falta agregar `masterstreet.cl` en Domains.

---

## 2. Causa raíz: por qué ocurre

### Qué hace Vercel cuando entras a masterstreet.cl

1. Recibe la petición en su red (edge).
2. Mira el **hostname** (`masterstreet.cl` o `www.masterstreet.cl`).
3. Busca en qué proyecto está configurado ese dominio.
4. Si no hay proyecto para ese host → responde **404 NOT_FOUND**.

### Qué estaba mal

- Tenías `www.masterstreet.cl` configurado.
- **No** tenías `masterstreet.cl` configurado.
- Al entrar a `masterstreet.cl`, Vercel no encontraba ningún proyecto → 404.

### Por qué el redirect no ayudaba

En `vercel.json` tienes:

```json
"redirects": [{
  "source": "/(.*)",
  "destination": "https://www.masterstreet.cl/$1",
  "has": [{ "type": "host", "value": "masterstreet.cl" }]
}]
```

Esa regla solo se ejecuta **después** de que Vercel ya haya asociado la petición a tu proyecto. Si el dominio no está en Domains, nunca llega a tu proyecto y la regla no se aplica.

---

## 3. Concepto: dominios en Vercel

### Para qué existe este error

- Evita que un dominio sirva contenido sin configuración explícita.
- Obliga a declarar qué dominios sirve cada proyecto.

### Cómo pensarlo

```
Dominio en DNS → apunta a Vercel
Dominio en Vercel Domains → asocia dominio con tu proyecto

Si falta el segundo paso → 404 NOT_FOUND
```

### Varias variantes del mismo dominio

- `masterstreet.cl` (apex)
- `www.masterstreet.cl` (www)

Son hosts distintos. Cada uno debe estar agregado en Domains si quieres usarlo o redirigirlo.

---

## 4. Señales de alerta

### Cómo reconocer este tipo de problema

- El sitio funciona en `https://tu-proyecto.vercel.app` pero no en tu dominio.
- `https://www.tudominio.cl` funciona pero `https://tudominio.cl` da 404.
- Ves "404 NOT_FOUND" con `ID: gru1::...` (indica que la petición llega a Vercel).

### Errores parecidos

- **DNS_HOSTNAME_NOT_FOUND**: el DNS no está bien configurado.
- **NOT_FOUND**: el dominio no está asignado al proyecto en Vercel.
- Página en blanco: dominio bien configurado pero deployment fallido o código mal desplegado.

---

## 5. Alternativas

### Opción A: Dominio único (recomendada)

- Añadir `masterstreet.cl` y `www.masterstreet.cl` en Domains.
- Usar redirect en `vercel.json` para que `masterstreet.cl` → `www.masterstreet.cl`.

Ventaja: ambas URLs funcionan y el usuario siempre llega al sitio.

### Opción B: Solo www

- Mantener solo `www.masterstreet.cl` en Domains.
- Configurar en tu proveedor DNS un redirect de `masterstreet.cl` → `www.masterstreet.cl`.

Ventaja: menos config en Vercel. Inconveniente: depende de la configuración de tu proveedor DNS.

### Opción C: Solo apex (sin www)

- Priorizar `masterstreet.cl`.
- Redirect de `www.masterstreet.cl` → `masterstreet.cl`.

Para eso habría que cambiar el redirect en `vercel.json` para que el host con www redirija al apex.

---

## Checklist final

- [ ] `masterstreet.cl` añadido en Vercel → Domains
- [ ] `www.masterstreet.cl` añadido en Vercel → Domains
- [ ] DNS configurado (A y CNAME según la tabla)
- [ ] Último deployment en estado "Ready"
- [ ] Probar `https://masterstreet.cl` y `https://www.masterstreet.cl`
