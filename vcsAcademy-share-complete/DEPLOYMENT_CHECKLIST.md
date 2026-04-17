# ✅ Checklist de Deployment - VCSA MVP

**Vacation Club Sales Academy**
**Versión**: 1.0.0

---

## 📋 Pre-Deployment Checklist

### 1. Preparación del Servidor

#### Hardware/Infrastructure
- [ ] **Servidor provisionado** (VPS/Cloud)
  - [ ] CPU: 4+ cores confirmado
  - [ ] RAM: 8GB+ confirmado
  - [ ] Storage: 100GB+ SSD confirmado
  - [ ] Network: 100 Mbps+ confirmado

- [ ] **Sistema Operativo**
  - [ ] Ubuntu 22.04 LTS instalado
  - [ ] System updates ejecutados
  - [ ] Timezone configurado
  - [ ] NTP synchronization activo

- [ ] **Acceso**
  - [ ] SSH key configurado
  - [ ] Firewall (UFW) activo
  - [ ] Root access disponible
  - [ ] Non-root user creado

#### Software Base
- [ ] **Docker**
  - [ ] Docker 24.0+ instalado
  - [ ] Docker Compose 2.20+ instalado
  - [ ] Docker daemon running
  - [ ] User added to docker group

- [ ] **Nginx**
  - [ ] Nginx 1.24+ instalado
  - [ ] Nginx enabled para iniciar en boot
  - [ ] Ports 80 y 443 abiertos

- [ ] **Utilities**
  - [ ] Git instalado
  - [ ] Curl instalado
  - [ ] htop instalado (monitoring)
  - [ ] fail2ban instalado (security)

### 2. Configuración de Dominio y DNS

#### Dominio
- [ ] **Dominio comprado** y configurado
- [ ] **DNS A record** apuntando a server IP
- [ ] **www subdomain** configurado (opcional)
- [ ] **DNS propagation** completada (dig +short)

#### SSL Certificate
- [ ] **Certbot instalado**
- [ ] **SSL certificate generado** (Let's Encrypt)
- [ ] **Auto-renewal configurado** (crontab)
- [ ] **HTTPS redirect** probado

### 3. Servicios Externos

#### Base de Datos
- [ ] **MongoDB Atlas**
  - [ ] Account creada
  - [ ] Cluster creado (M0 free tier o superior)
  - [ ] Database user creado
  - [ ] IP whitelist configurada (0.0.0.0/0 para server)
  - [ ] Connection string obtenida

  O

  - [ ] **MongoDB Local**
    - [ ] Volume creado
    - [ ] Persistency configurada
    - [ ] Backup script listo

#### Pagos
- [ ] **Stripe Account**
  - [ ] Account creada
  - [ ] API keys obtenidas (publishable + secret)
  - [ ] Webhook endpoint configurado
  - [ ] Webhook secret obtenido
  - [ ] Products y prices creados

#### Autenticación
- [ ] **Google OAuth** (opcional)
  - [ ] OAuth 2.0 credentials creadas
  - [ ] Client ID obtenido
  - [ ] Client secret obtenido
  - [ ] Authorized redirect URIs configuradas

#### Otros Servicios
- [ ] **Email Service** (SendGrid/Mailgun)
  - [ ] Account creada
  - [ ] API key obtenida
  - [ ] Sender verified

- [ ] **Sentry** (opcional)
  - [ ] Account creada
  - [ ] Project creado
  - [ ] DSN obtenida

- [ ] **Ollama AI** (local)
  - [ ] Docker service configurado
  - [ ] Llama 3.1 model descargado
  - [ ] API endpoint accesible

### 4. Configuración de Aplicación

#### Environment Variables
- [ ] **.env file creado**
- [ ] **Todas las variables requeridas** configuradas:
  ```bash
  # Database
  MONGO_URL=mongodb+srv://...
  DB_NAME=vcsa

  # Backend
  BACKEND_PORT=8000
  ALLOWED_ORIGINS=https://your-domain.com
  JWT_SECRET=<generated>

  # Frontend
  REACT_APP_BACKEND_URL=https://api.your-domain.com

  # Stripe
  STRIPE_API_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...

  # OAuth (opcional)
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  ```

- [ ] **.env file permissions** configuradas (chmod 600)
- [ ] **No valores hardcoded** en código

#### Código Fuente
- [ ] **Repositorio clonado**
- [ ] **Branch de producción** creada
- [ ] **Production build** probado localmente
- [ ] **No development dependencies** en production

---

## 🚀 Deployment Checklist

### 5. Build de Imágenes

#### Frontend
- [ ] **React build** completado sin errores
- [ ] **Build artifacts** generados (/build)
- [ ] **Environment variables** inyectadas
- [ ] **Static assets** optimizados
- [ ] **Service worker** generado

#### Backend
- [ ] **Python requirements** instaladas
- [ ] **Dependencies** verificadas
- [ ] **No dev dependencies** en producción
- [ ] **Entry point** configurado correctamente

#### Docker Images
- [ ] **Frontend image** built exitosamente
- [ ] **Backend image** built exitosamente
- [ ] **Images tagged** correctamente (version)
- [ ] **No cached stale** layers
- [ ] **Image size** optimizado

### 6. Database Setup

#### MongoDB
- [ ] **Connection test** exitoso
- [ ] **Database creada** si es local
- [ ] **Indexes creados**
- [ ] **Seed scripts** ejecutados:
  - [ ] seed_coaching.py
  - [ ] seed_knowledge_hub.py
  - [ ] seed_branding.py
  - [ ] create_admin.py

#### Data Verification
- [ ] **Users** creados (admin + demo)
- [ ] **Courses** poblados
- [ ] **Content** generado
- [ ] **Default branding** configurado

### 7. Docker Compose

#### Services
- [ ] **docker-compose.prod.yml** configurado
- [ ] **Network** creada (vcsa_network)
- [ ] **Volumes** montados correctamente:
  - [ ] mongodb_data
  - [ ] backend_uploads
  - [ ] frontend_cache
  - [ ] nginx_logs
- [ ] **Restart policy** configurada (always)

#### Nginx Configuration
- [ ] **nginx.conf** configurado
- [ ] **SSL certificates** mounted
- [ ] **Upstream servers** configurados
- [ ] **Reverse proxy** rules configuradas
- [ ] **Cache headers** configurados
- [ ] **CORS** configurado correctamente
- [ ] **Rate limiting** configurado

### 8. Startup y Verification

#### Services Start
- [ ] **docker-compose up -d** ejecutado
- [ ] **All containers running** (docker ps)
- [ ] **No container restarts** (docker ps -a)
- [ ] **Logs clean** (docker-compose logs)

#### Health Checks
- [ ] **Frontend**: http://localhost:3000 responde
- [ ] **Backend API**: http://localhost:8000/api/health responde
- [ ] **MongoDB**: Connection exitosa
- [ ] **Nginx**: http://localhost responde

#### External Access
- [ ] **HTTP redirect** a HTTPS funciona
- [ ] **HTTPS** funciona sin warnings
- [ ] **API accessible** desde internet
- [ ] **Frontend accessible** desde internet
- [ ] **CORS** funciona correctamente

---

## ✅ Post-Deployment Checklist

### 9. Testing Funcional

#### Authentication
- [ ] **User registration** funciona
- [ ] **User login** funciona
- [ ] **JWT token** se genera correctamente
- [ ] **Protected routes** require auth
- [ ] **Logout** funciona

#### Core Features
- [ ] **Dashboard** carga correctamente
- [ ] **Training videos** play correctamente
- [ ] **Progress tracking** funciona
- [ ] **Points system** funciona
- [ ] **Badges** se otorgan correctamente

#### AI Features
- [ ] **AI Chat** responde
- [ ] **Sentiment analysis** funciona
- [ ] **Proactive suggestions** se generan
- [ ] **Role playing** funciona

#### Admin Panel
- [ ] **Team stats** load correctamente
- [ ] **Knowledge base** funciona
- [ ] **File upload** funciona
- [ ] **Branding config** funciona

### 10. Monitoring Setup

#### Logging
- [ ] **Application logs** configurados
- [ ] **Error logs** configurados
- [ ] **Access logs** (Nginx) configurados
- [ ] **Log rotation** configurada

#### Monitoring
- [ ] **Health check script** creado
- [ ] **Uptime monitoring** configurado
- [ ] **Error tracking** (Sentry) configurado
- [ ] **Performance monitoring** configurado

#### Alerts
- [ ] **Email alerts** configuradas
- [ ] **Downtime alerts** configuradas
- [ ] **High error rate** alerts configuradas
- [ ] **Disk space** alerts configuradas

### 11. Backup & Recovery

#### Backups
- [ ] **MongoDB backup script** creado
- [ ] **Automated backups** configurados (cron)
- [ ] **Backup retention** configurada (7 días)
- [ ] **Offsite backups** configurados (opcional)

#### Recovery Test
- [ ] **Backup restoration** probado
- [ ] **Recovery time** medido
- [ ] **RTO/RPO** documentados
- [ ] **Disaster recovery plan** creado

### 12. Security Hardening

#### Server Security
- [ ] **SSH key-only auth** (no password)
- [ ] **Root login disabled**
- [ ] **Fail2ban** activo y configurado
- [ ] **Unnecessary ports** cerrados
- [ ] **Security updates** automatizadas

#### Application Security
- [ ] **Environment variables** no expuestas
- [ ] **Secrets** rotados (no defaults)
- [ ] **CORS** configurado correctamente
- [ ] **Rate limiting** activo
- [ ] **Input validation** activo
- [ ] **SQL injection** protection verificada

#### SSL/TLS
- [ ] **Strong ciphers** configurados
- [ ] **HTTP/2** habilitado
- [ ] **HSTS headers** configurados
- [ ] **Certificate auto-renewal** verificado

---

## 📊 Performance Checklist

### 13. Optimization

#### Frontend
- [ ] **Code splitting** implementado
- [ ] **Lazy loading** implementado
- [ ] **Image optimization** (WebP)
- [ ] **Gzip compression** activo
- [ ] **Browser caching** configurado
- [ ] **CDN** configurado (opcional)

#### Backend
- [ ] **Database indexes** creados
- [ ] **Query optimization** verificada
- [ ] **Caching** implementado (Redis opcional)
- [ ] **Connection pooling** configurado
- [ ] **Async operations** implementadas

#### Testing
- [ ] **Load test** ejecutado (100+ concurrent users)
- [ ] **Response time** < 500ms (p50)
- [ ] **Error rate** < 1%
- [ ] **Memory usage** estable
- [ ] **CPU usage** < 80%

---

## 🎯 Go-Live Checklist

### 14. Final Verification

#### Smoke Tests
- [ ] **Critical path** probado end-to-end:
  1. Registro → Login → Dashboard → Training Module → Complete
  2. Admin → Team Stats → Knowledge Base → Upload
  3. AI Chat → Role Play → Suggestion

#### Cross-Device Testing
- [ ] **Desktop** (Chrome, Firefox, Safari)
- [ ] **Mobile** (iOS Safari, Android Chrome)
- [ ] **Tablet** (iPad, Android tablets)

#### Browser Compatibility
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

### 15. Documentation

#### Handover
- [ ] **Admin credentials** documentadas
- [ ] **Server access** documentado
- [ ] **API keys** documentadas secure location
- [ ] **Backup procedures** documentadas
- [ ] **Troubleshooting guide** disponible

#### User Documentation
- [ ] **User manual** publicado
- [ ] **Admin guide** publicado
- [ ] **FAQ** publicado
- [ ] **Video tutorials** grabados (opcional)
- [ ] **Support contact** publicado

### 16. Rollback Plan

#### Rollback Prepared
- [ ] **Previous version** tagged en git
- [ ] **Database backup** pre-deployment
- [ ] **Rollback script** preparado
- [ ] **Rollback testado** al menos una vez
- [ ] **Rollback procedure** documentado

#### Communication Plan
- [ ] **Stakeholders** notificados de deployment
- [ ] **Users** notificados de mantenimiento
- [ ] **Maintenance window** comunicada
- [ ] **Emergency contacts** verificadas

---

## 🎉 Deployment Complete!

### Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Tech Lead** | | | |
| **DevOps Engineer** | | | |
| **QA Lead** | | | |
| **Product Owner** | | | |
| **Client Representative** | | | |

### Deployment Details

- **Deployment Date**: ____________________
- **Deployment Time**: ____________________
- **Downtime**: ____________________ minutes
- **Issues Encountered**: ____________________
- **Status**: ✅ **SUCCESS** | ❌ **FAILED**

---

## 📞 Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| **Tech Lead** | | | |
| **DevOps** | | | |
| **Backend Lead** | | | |
| **Frontend Lead** | | | |
| **On-Call Engineer** | | | |

---

**Última Actualización**: Abril 2026
**Versión**: 1.0.0
**Status**: Production Ready ✅
