# Solución: correos @masterstreet.cl no llegan a bandeja

Guía para que los correos enviados desde @masterstreet.cl lleguen a la bandeja de entrada (no a spam ni se pierdan).

---

## 1. Diagnóstico según tu cPanel (del PDF)

### Lo que ya tienes ✓

| Registro | Host | Tipo | Estado |
|----------|------|------|--------|
| DKIM Resend | `resend._domainkey.masterstreet.cl` | TXT | ✓ Presente |
| SPF Resend | `send.masterstreet.cl` | TXT `v=spf1 include:amazonses.com ~all` | ✓ Presente |

### Lo que falta o puede fallar ⚠️

| Registro | Host | Tipo | Valor | Estado |
|----------|------|------|-------|--------|
| **MX Resend** | `send.masterstreet.cl` | **MX** | `feedback-smtp.sa-east-1.amazonses.com` (Prioridad 10) | **Problema probable** |

Si este MX no está en cPanel, Resend no considera el dominio verificado y los correos pueden fallar o ir a spam.

---

## 2. Pasos en cPanel (Zone Editor)

### Agregar el MX para Resend

1. **Zone Editor** → dominio `masterstreet.cl`
2. **Add Record**
3. Completar:

| Campo | Valor |
|-------|--------|
| **Type** | MX |
| **Name** | `send` |
| **Priority** | `10` |
| **Destination** | `feedback-smtp.sa-east-1.amazonses.com` |

> El destino exacto aparece en Resend → Domains → masterstreet.cl → Enable Sending → SPF (registro MX).

4. Guardar.

---

## 3. Verificar en Resend

En **Resend → Domains → masterstreet.cl** revisa:

- **DKIM** → Verified  
- **SPF (Enable Sending)** → MX y TXT en **Verified**

Mientras SPF siga en **Pending**, la entrega puede fallar o ir a spam.

---

## 4. DMARC

En cPanel tienes:

```
_dmarc.masterstreet.cl → v=DMARC1;p=quarantine;...
```

Con `p=quarantine`, los correos que fallen SPF o DKIM van a **spam**. Por eso es crítico que SPF y DKIM estén bien configurados y verificados.

---

## 5. ¿Qué correos usan @masterstreet.cl?

En tu app hay varios tipos:

| Origen | Remitente | Estado |
|--------|-----------|--------|
| **Supabase Auth** (registro, recuperar contraseña) | Supabase por defecto | Para usar @masterstreet.cl hay que configurar SMTP personalizado en Supabase |
| **Resend** (app custom) | noreply@masterstreet.cl | Depende de que Resend esté verificado y bien configurado |

### Si los correos que no llegan son de Supabase (verificación, recuperar contraseña)

Debes configurar SMTP en Supabase:

1. **Supabase Dashboard** → **Project Settings** → **Auth** → **SMTP Settings**
2. Activar **Custom SMTP**
3. Usar las credenciales SMTP de Resend (las obtienes en Resend o en la integración Resend + Supabase)
4. **Sender email:** `noreply@masterstreet.cl`
5. **Sender name:** `The Master Street`

### Si los correos que no llegan son enviados por tu app con Resend

Revisa que:

- `EMAIL_FROM=noreply@masterstreet.cl` en Vercel
- `RESEND_API_KEY` esté definida y sea correcta
- El dominio masterstreet.cl esté verificado en Resend (incluido el MX de `send`)

---

## 6. Checklist rápido

- [ ] MX para `send.masterstreet.cl` agregado en cPanel
- [ ] Resend muestra DKIM y SPF como **Verified**
- [ ] Esperar 24–48 h tras cambios de DNS
- [ ] Si usas Supabase Auth, configurar SMTP con Resend
- [ ] Verificar que no haya otro SPF en `send` que entre en conflicto

---

## 7. Lo que muestra tu Network Tools (MXToolbox)

Tu PDF usó **www.masterstreet.cl** en el MX Lookup. Ese dominio es para la **web** (CNAME a Vercel), no para correo. Para que los correos lleguen, importan otros dominios.

### Dominios que debes revisar en MXToolbox

| Dominio a consultar | Herramienta | Para qué |
|---------------------|-------------|----------|
| `masterstreet.cl` | MX Lookup, SPF, DMARC | Dominio principal y políticas de correo |
| **`send.masterstreet.cl`** | **MX Lookup**, **SPF Lookup** | Resend (envío de correos) |

### Resultados de tu PDF (www.masterstreet.cl)

- CNAME a Vercel ✓ (correcto para la web)
- DNS Record Published ✓
- DMARC Record Published ✓
- **DMARC Policy Not Enabled** ⚠️ — Revisar en `masterstreet.cl` que la política DMARC esté bien configurada

---

## 8. Cómo comprobar que el DNS está bien

1. **MX de send** (crítico para Resend):
   - [mxtoolbox.com](https://mxtoolbox.com) → **MX Lookup**
   - Dominio: **`send.masterstreet.cl`** (no www)
   - Debe aparecer: `feedback-smtp.sa-east-1.amazonses.com` (Prioridad 10)

2. **SPF de send**:
   - mxtoolbox.com → **SPF Record Lookup**
   - Dominio: **`send.masterstreet.cl`**
   - Debe mostrarse: `v=spf1 include:amazonses.com ~all`

3. **DMARC** (en el dominio raíz):
   - Dominio: **`masterstreet.cl`**
   - Debe existir un registro `_dmarc.masterstreet.cl`

---

## Resumen de prioridad

1. **Agregar MX para `send`** en cPanel si falta.
2. Confirmar en Resend que SPF (MX + TXT) esté en **Verified**.
3. Si los correos son de Supabase, configurar SMTP con Resend y `noreply@masterstreet.cl`.
