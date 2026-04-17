# 🔧 Backend Deployment Guide

## Opciones de Hosting para el Backend

### 1. Railway (Recomendado - Gratis/$5/mes)

#### Paso a Paso:

```bash
# 1. Instalar Railway CLI
npm install -g railway

# 2. Login
railway login

# 3. Inicializar proyecto
cd /rogervibes/vcs/Vcsa-/backend
railway init

# 4. Crear archivo railway.json
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port 8000",
    "healthcheckPath": "/api/health"
  }
}
EOF

# 5. Desplegar
railway up

# 6. Obtener URL del backend
railway domain

# 7. Configurar variables de entorno
railway variables set MONGO_URL=mongodb+srv://...
railway variables set DB_NAME=vcsa
railway variables set STRIPE_API_KEY=sk_test_...
```

**Ventajas:**
- ✅ Gratis hasta $5/mes
- ✅ MongoDB incluido gratis
- ✅ SSL automático
- ✅ Despliegue desde Git

---

### 2. Render (Gratis/$7/mes)

#### Paso a Paso:

1. **Crear cuenta en render.com**
2. **Fork del repositorio** a tu GitHub
3. **Crear nuevo Web Service**
   - Name: `vcsa-backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port 8000`

4. **Configurar variables de entorno:**
   ```
   MONGO_URL=mongodb+srv://...
   DB_NAME=vcsa
   STRIPE_API_KEY=sk_test_...
   PYTHON_VERSION=3.11
   ```

5. **Deploy automático desde GitHub**

**Ventajas:**
- ✅ Despliegue automático desde Git
- ✅ SSL automático
- ✅ Logs en tiempo real
- ✅ Preview deployments

---

### 3. DigitalOcean App Platform ($5-12/mes)

```bash
# 1. Instalar doctl
apt-get install doctl

# 2. Autenticar
doctl auth init

# 3. Crear app
doctl apps create --spec spec.yaml

# spec.yaml
name: vcsa-backend
services:
- name: api
  source_dir: /backend
  github:
    repo: tu-usuario/vcsa
    branch: main
  run_command: uvicorn server:app --host 0.0.0.0 --port 8000
  environment_slug: python-3
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: MONGO_URL
    value: ${MONGO_URL}
  - key: DB_NAME
    value: vcsa
  - key: STRIPE_API_KEY
    value: ${STRIPE_API_KEY}

databases:
- name: db
  engine: MONGODB
  production: false
```

---

### 4. VPS Propio (DigitalOcean Droplet, AWS EC2, etc.)

#### Con Docker (Recomendado):

```bash
# 1. Crear VPS (ej: DigitalOcean Droplet)
# - Ubuntu 22.04
# - 2GB RAM mínimo
# - $12-24/mes

# 2. SSH al servidor
ssh root@tu-server-ip

# 3. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 4. Clonar repositorio
git clone https://github.com/tu-usuario/vcsa.git
cd vcsa

# 5. Configurar .env
cp .env.example .env
nano .env

# 6. Desplegar con docker-compose
docker-compose up -d

# 7. Configurar Nginx reverse proxy
apt-get install nginx
nano /etc/nginx/sites-available/vcsa

# 8. Configurar SSL con Certbot
apt-get install certbot python3-certbot-nginx
certbot --nginx -d api.tudominio.com
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🗄️ MongoDB Deployment

### Opción 1: MongoDB Atlas (Recomendado - Gratis)

```bash
1. Crear cuenta en mongodb.com/cloud/atlas
2. Crear cluster gratuito (512MB)
3. Configurar whitelist IP: 0.0.0.0/0
4. Crear usuario de base de datos
5. Obtener connection string:
   mongodb+srv://usuario:password@cluster.mongodb.net/vcsa
```

### Opción 2: Railway MongoDB (Incluido)
```bash
railway add mongodb
```

### Opción 3. Render MongoDB
```bash
# Crear database en Render
# Copiar URL interna
```

---

## 🔐 Variables de Entorno del Backend

### Archivo .env (No incluir en Git)

```bash
# MongoDB
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/vcsa
DB_NAME=vcsa

# Stripe
STRIPE_API_KEY=sk_test_your_stripe_key

# Sentry (Opcional)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1

# JWT Secret (Generar uno único)
JWT_SECRET=your_super_secret_jwt_key_here

# Emergent Auth (si se usa)
EMERGENT_AUTH_URL=https://auth.emergent.com
EMERGENT_AUTH_API_KEY=your_api_key
```

---

## 🚀 Script de Deployment Rápido

```bash
#!/bin/bash
# deploy-backend.sh

echo "🚀 Deploying VCSA Backend..."

# Variables
BACKEND_DIR="/rogervibes/vcs/Vcsa-/backend"
GIT_REPO="https://github.com/tu-usuario/vcsa.git"

# Backup actual
echo "📦 Creating backup..."
mongodump --uri="$MONGO_URL" --out=backup-$(date +%Y%m%d)

# Pull latest changes
echo "📥 Pulling latest changes..."
cd $BACKEND_DIR
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run tests
echo "🧪 Running tests..."
pytest

# Seed database (si es necesario)
echo "🌱 Seeding database..."
python seed_branding.py

# Restart service
echo "🔄 Restarting service..."
sudo systemctl restart vcsa-backend

# Health check
echo "🏥 Health check..."
curl -f http://localhost:8000/api/health || exit 1

echo "✅ Deployment completed!"
```

---

## 📊 Monitoreo y Logs

### Logs en Railway:
```bash
railway logs
```

### Logs en Render:
- Ver en Dashboard → Logs

### Logs en VPS:
```bash
# Systemd service
sudo journalctl -u vcsa-backend -f

# Docker logs
docker-compose logs -f backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🔥 Configuración de CORS

### En server.py (backend):

```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://tu-sitio.netlify.app",
        "https://tudominio.com",
        "http://localhost:3000"  # Desarrollo
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ✅ Checklist Pre-Deployment

- [ ] MongoDB configurado y accesible
- [ ] Variables de entorno configuradas
- [ ] CORS configurado para dominio de frontend
- [�️ SSL certificado configurado (HTTPS obligatorio)
- [ ] Health check endpoint funcionando
- [ ] Logs configurados
- [ ] Error tracking (Sentry) configurado
- [ ] Backup automático configurado
- [ ] Rate limiting configurado (opcional)
- [ ] Firewall configurado (VPS)

---

## 🎯 URLs Finales

### Backend:
```
Railway: https://vcsa-backend.up.railway.app
Render: https://vcsa-backend.onrender.com
Custom: https://api.tudominio.com
```

### Frontend (Netlify):
```
Netlify: https://vcsa-frontend.netlify.app
Custom: https://tudominio.com
```

---

## 🔄 Pipeline Completo

```bash
# 1. Deploy Backend (Railway/Render/VPS)
cd backend
railway up  # o git push (Render)

# 2. Obtener Backend URL
railway domain  # Output: https://xxx.up.railway.app

# 3. Deploy Frontend (Netlify)
# - Subir ZIP a Netlify
# - Configurar variable: REACT_APP_BACKEND_URL=https://xxx.up.railway.app

# 4. Testear
curl https://xxx.up.railway.app/api/health
```

---

## 🆘 Troubleshooting Backend

### Error: "MongoDB connection failed"
```bash
# Verificar MONGO_URL
echo $MONGO_URL

# Testear conexión
python -c "from pymongo import MongoClient; client = MongoClient('$MONGO_URL'); print(client.list_database_names())"
```

### Error: "Port already in use"
```bash
# Matar proceso en puerto 8000
lsof -ti:8000 | xargs kill -9

# O usar otro puerto
uvicorn server:app --port 8001
```

### Error: "CORS policy"
```bash
# Verificar configuración de CORS en server.py
# Agregar dominio de frontend a allow_origins
```

---

## 💰 Costos Mensuales Estimados

| Servicio | Plan | Costo |
|----------|------|-------|
| Railway | Starter | Gratis / $5 |
| Render | Free | Gratis / $7 |
| MongoDB Atlas | Free | Gratis / $9 |
| DigitalOcean | Basic | $4-24/mes |
| Netlify | Starter | Gratis / $19 |

**Total gratis**: $0
**Total producción**: $15-50/mes

---

**¡Listo para deploy! 🚀**
