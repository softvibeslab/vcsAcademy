# Docker & Deployment

Guía completa de deployment con Docker para VCSA.

## 🐳 Stack de Contenedores

- **Frontend**: React 19 (Nginx)
- **Backend**: FastAPI (Uvicorn)
- **Database**: MongoDB

---

## 📁 Estructura de Archivos

```
vcsa/
├── docker-compose.yml           # Orquestación de servicios
├── frontend/
│   ├── Dockerfile              # Frontend container
│   └── nginx.conf              # Nginx config
├── backend/
│   ├── Dockerfile              # Backend container
│   └── requirements.txt        # Python dependencies
└── .dockerignore               # Archivos a ignorar
```

---

## 🐳 Dockerfiles

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build production bundle
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile

FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔧 docker-compose.yml

```yaml
version: '3.8'

services:
  # Frontend (React + Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - vcsa-network
    restart: unless-stopped

  # Backend (FastAPI)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=vcsa
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_API_KEY=${STRIPE_API_KEY}
    depends_on:
      - mongodb
    networks:
      - vcsa-network
    restart: unless-stopped
    volumes:
      - ./backend:/app
    command: uvicorn server:app --host 0.0.0.0 --port 8000 --reload

  # Database (MongoDB)
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=vcsa
    volumes:
      - mongodb-data:/data/db
    networks:
      - vcsa-network
    restart: unless-stopped

networks:
  vcsa-network:
    driver: bridge

volumes:
  mongodb-data:
```

---

## 🚀 Comandos de Docker

### Desarrollo

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Reconstruir contenedores
docker-compose up -d --build

# Entrar a un contenedor
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Producción

```bash
# Crear imagen de producción
docker build -t vcsa-frontend:latest ./frontend
docker build -t vcsa-backend:latest ./backend

# Ejecutar contenedor individual
docker run -d -p 3000:3000 --name vcsa-frontend vcsa-frontend:latest
docker run -d -p 8000:8000 --name vcsa-backend vcsa-backend:latest

# Detener y eliminar contenedor
docker stop vcsa-frontend
docker rm vcsa-frontend
```

---

## 🌐 Nginx Configuration

```nginx
# frontend/nginx.conf

server {
    listen 3000;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔒 Variables de Entorno

### .env para Producción

```env
# .env

# Database
MONGO_URL=mongodb://mongodb:27017
DB_NAME=vcsa

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe
STRIPE_API_KEY=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret

# CORS
FRONTEND_URL=https://your-domain.com
```

---

## 🚀 Deployment en Producción

### Opción 1: Docker Compose en VPS

```bash
# 1. Clonar repositorio
git clone https://github.com/your-repo/vcsa.git
cd vcsa

# 2. Configurar variables de entorno
cp .env.example .env
nano .env

# 3. Iniciar servicios
docker-compose up -d

# 4. Verificar que todo funcione
curl http://localhost:3000  # Frontend
curl http://localhost:8000/api/health  # Backend
```

### Opción 2: Cloud Platforms

#### AWS ECS

```json
{
  "family": "vcsa-task",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "your-registry/vcsa-frontend:latest",
      "memory": 512,
      "cpu": 256,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ]
    },
    {
      "name": "backend",
      "image": "your-registry/vcsa-backend:latest",
      "memory": 512,
      "cpu": 256,
      "essential": true,
      "environment": [
        {
          "name": "MONGO_URL",
          "value": "mongodb://your-mongodb-instance:27017"
        }
      ],
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ]
    }
  ]
}
```

#### Google Cloud Run

```bash
# Deploy frontend
gcloud run deploy vcsa-frontend \
  --image gcr.io/your-project/vcsa-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy backend
gcloud run deploy vcsa-backend \
  --image gcr.io/your-project/vcsa-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URL=mongodb+srv://...
```

#### DigitalOcean App Platform

```yaml
# app.yaml

name: vcsa
services:
  - name: frontend
    github:
      repo: your-repo/vcsa
      branch: main
    dockerfile_path: frontend/Dockerfile
    run_command: nginx -g 'daemon off;'
    http_port: 3000

  - name: backend
    github:
      repo: your-repo/vcsa
      branch: main
    dockerfile_path: backend/Dockerfile
    run_command: uvicorn server:app --host 0.0.0.0 --port 8000
    http_port: 8000
    envs:
      - key: MONGO_URL
        value: ${MONGO_URL}
      - key: JWT_SECRET
        value: ${JWT_SECRET}

databases:
  - name: mongodb
    engine: MONGODB
```

---

## 🔧 SSL/HTTPS

### Usar Certbot con Nginx

```bash
# Instalar certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d your-domain.com

# Renovación automática
sudo certbot renew --dry-run
```

### Nginx con SSL

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # ... rest of config
}
```

---

## 📊 Monitoreo

### Health Checks

```python
# backend/server.py

@app.get("/api/health")
async def health_check():
    try:
        # Check database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow(),
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Unhealthy: {str(e)}")
```

### Logs

```bash
# Ver logs de Docker
docker-compose logs -f --tail=100

# Logs de Nginx
docker-compose exec frontend tail -f /var/log/nginx/access.log
docker-compose exec frontend tail -f /var/log/nginx/error.log

# Logs de Uvicorn
docker-compose logs -f backend
```

---

## 🔥 Hot Tips

1. **Usar .dockerignore**: Excluir node_modules, .git, etc.
2. **Multi-stage builds**: Reducir tamaño de imágenes
3. **Volume mounts**: Para desarrollo, montar código como volumen
4. **Health checks**: Implementar /health endpoint
5. **Environment variables**: Nunca hardcodear secrets
6. **Logs**: Configurar logging apropiado
7. **Backups**: Hacer backup de volumen de MongoDB regularmente
8. **SSL**: Siempre usar HTTPS en producción
9. **Caching**: Configurar headers de cache para static files
10. **Monitoring**: Usar herramientas de monitoreo en producción

---

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)
