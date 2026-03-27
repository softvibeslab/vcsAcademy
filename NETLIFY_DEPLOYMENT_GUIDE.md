# 🚀 Guía de Deployment en Netlify - VCSA Platform

## 📦 Archivo de Deployment

**Archivo**: `vcsa-netlify-deploy.zip`
**Tamaño**: 1.4 MB (comprimido) / 5.9 MB (descomprimido)
**Ubicación**: `/rogervibes/vcs/Vcsa-/vcsa-netlify-deploy.zip`

---

## ⚡ VARIABLES DE ENTORNO REQUERIDAS

### Variables Obligatorias

```bash
# Backend API URL (REQUERIDO)
REACT_APP_BACKEND_URL=https://your-backend-api.com
```

### Variables Opcionales

```bash
# Stripe (si usas pagos)
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key

# Google Analytics
REACT_APP_GA_ID=UA-XXXXXXXXX-X

# Sentry (error tracking)
REACT_APP_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Environment
REACT_APP_ENV=production
```

---

## 📋 PASO A PASO - DEPLOYMENT EN NETLIFY

### Opción 1: Drag & Drop (MÁS RÁPIDO - Recomendado)

#### Paso 1: Preparar Backend
```bash
# Asegúrate de tener tu backend corriendo
# Ejemplo: Railway, Render, Heroku, tu servidor
```

#### Paso 2: Ir a Netlify Drop
1. Ve a: https://app.netlify.com/drop
2. Si no tienes cuenta, regístrate gratis

#### Paso 3: Subir el ZIP
1. Arrastra el archivo `vcsa-netlify-deploy.zip` al área indicada
2. Espera unos segundos mientras se sube y procesa

#### Paso 4: Configurar Variables
1. Una vez deployado, ve a "Site Configuration"
2. Click en "Environment variables"
3. Agrega las variables:
   ```
   REACT_APP_BACKEND_URL = https://tu-backend-api.com
   ```

#### Paso 5: Redeploy (si agregaste variables después)
1. Click en "Deploys"
2. Click en "Trigger deploy" → "Deploy site"

✅ **¡Listo! Tu sitio está en vivo**

---

### Opción 2: Desde el Dashboard de Netlify

#### Paso 1: Crear Cuenta
1. Ve a: https://app.netlify.com
2. Regístrate o inicia sesión

#### Paso 2: Crear Nuevo Sitio
1. Click en "Add new site" → "Deploy manually"
2. Arrastra el ZIP `vcsa-netlify-deploy.zip`

#### Paso 3: Configurar Dominio
1. Ve a "Domain settings"
2. Cambia el dominio si lo deseas
   - Default: `random-name.netlify.app`
   - Custom: `tudominio.com`

#### Paso 4: Configurar Variables
1. "Site settings" → "Build & deploy" → "Environment"
2. Click "Add a variable"
3. Agrega:
   ```
   REACT_APP_BACKEND_URL = https://tu-backend-api.com
   ```

#### Paso 5: Deploy
1. Click en "Trigger deploy" si es necesario

---

### Opción 3: Vía Git (Automático)

#### Paso 1: Subir Código a GitHub
```bash
git add .
git commit -m "Release for Netlify deployment"
git push origin main
```

#### Paso 2: Conectar Netlify a GitHub
1. En Netlify: "Add new site" → "Import an existing project"
2. Selecciona GitHub
3. Selecciona tu repositorio

#### Paso 3: Configurar Build
```
Build command: npm run build
Publish directory: frontend/build
```

#### Paso 4: Variables de Entorno
1. En "Site settings" → "Environment"
2. Agregar variables antes del primer deploy

---

## 🔧 CONFIGURACIÓN DEL BACKEND

### Opciones de Hosting para Backend

#### 1. Railway (Recomendado - Gratis)
```bash
# Instalar CLI
npm install -g railway

# Login y deploy
railway login
railway init
railway up

# Obtener URL
railway domain
```

#### 2. Render (Gratis)
```bash
# Subir código a GitHub
# Conectar repo en render.com
# Configurar variables de entorno
# Deploy automático
```

#### 3. Heroku (Pago)
```bash
# Instalar Heroku CLI
heroku create vcsa-backend
heroku addons:create mongolab:sandbox
heroku config:set MONGO_URL=mongodb://...
heroku config:set DB_NAME=vcsa

# Push
git push heroku main
```

#### 4. VPS Propio (DigitalOcean, AWS, etc.)
```bash
# Usar docker-compose
./deploy.sh deploy

# Configurar nginx como reverse proxy
# Configurar SSL con Let's Encrypt
```

---

## 🌐 CONFIGURACIÓN DE DOMINIO CUSTOM

### Paso 1: Comprar Dominio
- Namecheap
- GoDaddy
- Google Domains

### Paso 2: Configurar en Netlify
1. "Domain settings" → "Add custom domain"
2. Ingresar tu dominio: `tusitio.com`

### Paso 3: Configurar DNS
```
Tipo: A
Nombre: @
Valor: 75.2.70.75 (Netlify)

Tipo: CNAME
Nombre: www
Valor: tu-site.netlify.app
```

### Paso 4: Verificar
- Esperar propagación DNS (max 48 horas)
- Netlify detectará automáticamente
- SSL se configurará automáticamente

---

## 🔐 SEGURIDAD

### Headers de Seguridad (Configurados en netlify.toml)
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: enabled
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### Variables de Entorno Seguras
- ✅ Nunca incluir `.env` en el ZIP
- ✅ Usar variables de entorno de Netlify
- ✅ No hardcodear API keys

---

## 📊 MONITOREO

### Google Analytics
```bash
# Agregar variable en Netlify
REACT_APP_GA_ID = UA-XXXXXXXXX-X
```

### Sentry Error Tracking
```bash
# Agregar variable en Netlify
REACT_APP_SENTRY_DSN = https://xxxxx@sentry.io/xxxxx
```

### Netlify Analytics
1. "Site settings" → "Analytics"
2. Habilitar "Netlify Analytics" (gratis para planes de pago)

---

## 🔄 CI/CD AUTOMÁTICO

### Configurar Auto-Deploy desde Git

1. **Conectar GitHub Repository**
   ```
   Netlify → New Site → Import from GitHub
   ```

2. **Configurar Build Settings**
   ```
   Branch: main
   Build command: npm run build
   Publish directory: frontend/build
   ```

3. **Variables de Entorno**
   ```
   REACT_APP_BACKEND_URL = https://api.tusitio.com
   ```

4. **Auto-Deploy Activado**
   - Cada push a `main` → Deploy automático
   - Cada Pull Request → Deploy preview

---

## 🧪 TESTING POST-DEPLOYMENT

### Checklist de Verificación

- [ ] Homepage carga correctamente
- [ ] Login/Register funciona
- [ ] Dashboard se carga
- [ ] API calls funcionan (verificar console)
- [ ] Las rutas SPA funcionan (refresh en /dashboard)
- [ ] Images y assets cargan
- [ ] CSS se aplica correctamente
- [ ] No errores en console
- [ ] Mobile responsive funciona

### Comandos Útiles

```bash
# Ver logs de Netlify CLI
netlify logs

# Deploy local para testing
netlify dev

# Deploy a staging
netlify deploy --site=your-site-id
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Blank page después del deploy"

**Causa**: Variables de entorno no configuradas

**Solución**:
```bash
# Agregar en Netlify → Site Settings → Environment Variables
REACT_APP_BACKEND_URL=https://tu-backend-api.com
```

### Problema: "API calls fallan con 404"

**Causa**: Netlify no está haciendo proxy del backend

**Solución 1**: Configurar redirect en `netlify.toml`
```toml
[[redirects]]
  from = "/api/*"
  to = "https://tu-backend-api.com/api/:splat"
  status = 200
```

**Solución 2**: Usar URL completa en frontend
```javascript
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
```

### Problema: "Rutas SPA no funcionan"

**Causa**: Netlify necesita redirect para SPA

**Solución**: Ya está configurado en `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Problema: "Build falla"

**Causa**: Dependencias faltantes

**Solución**:
```bash
# Limpiar cache de Netlify
# Site Settings → Build & deploy → Clear cache and deploy
```

---

## 📱 DEPLOYMENT A PRODUCCIÓN

### Pre-Deployment Checklist

- [ ] Backend deployado y accesible
- [ ] Variables de entorno configuradas
- [ ] Dominio custom configurado (opcional)
- [ ] SSL configurado (automático en Netlify)
- [ ] Analytics configurado (opcional)
- [ ] Error tracking configurado (opcional)
- [ ] Testing completado

### Deployment Command

```bash
# Subir a Netlify
netlify deploy --prod --dir=frontend/build
```

---

## 🎯 POST-DEPLOYMENT

### 1. Configurar Dominio
```
https://tu-sitio.netlify.app
o
https://tu-dominio-custom.com
```

### 2. Verificar Funcionalidad
- Testear login
- Testear dashboard
- Testear páginas principales

### 3. Monitorear
- Revisar logs de Netlify
- Verificar analytics
- Checkear errores de consola

### 4. Anunciar
- Compartir URL con el equipo
- Actualizar documentación
- Configurar backups

---

## 📞 SOPORTE

### Recursos Útiles
- Netlify Docs: https://docs.netlify.com
- React Deploy: https://create-react-app.dev/docs/deployment
- Netlify Community: https://answers.netlify.com

### Comandos Rápidos
```bash
# Ver logs
netlify logs

# Deploy local
netlify dev

# Deploy a producción
netlify deploy --prod

# Limpiar deploy
netlify deploy --prod --clean
```

---

## ✅ RESUMEN RÁPIDO

1. **Subir ZIP** a Netlify Drop
2. **Configurar variables**: `REACT_APP_BACKEND_URL`
3. **Testear** el sitio
4. **Configurar dominio** (opcional)
5. **¡Listo! 🎉**

---

**Tiempo estimado**: 10-15 minutos
**Costo**: Gratis (hasta 100GB/mes en Netlify)
**Dificultad**: Fácil

🚀 **¡A deployar!**
