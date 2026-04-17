# 🚀 EJECUTA AHORA - DEPLOYMENT MASTER

## **UN SOLO COMANDO - TODO AUTOMÁTICO**

```bash
./deployment-master.sh
```

---

## **📋 QUÉ HACE EL SCRIPT AUTOMÁTICAMENTE:**

1. ✅ **Fix Docker Compose conflict** - Resuelve el error que viste
2. ✅ **Verifica Docker** - Confirma instalación
3. ✅ **Prepara directorio** - Crea `/var/www/vcsa-academy`
4. ✅ **Deploy archivos** - Copia todo al VPS (via rsync)
5. ✅ **Configura .env** - Crea variables de entorno
6. ✅ **Build Docker images** - Compila contenedores
7. ✅ **Start containers** - Inicia todos los servicios
8. ✅ **Configure SSL** - Certificados Let's Encrypt
9. ✅ **Setup database** - Seed con datos iniciales
10. ✅ **Auto-renewal SSL** - Certificates se renuevan solos
11. ✅ **Firewall UFW** - Configura seguridad
12. ✅ **Verificación final** - Testea todo

---

## **⏱️ TIEMPO ESTIMADO: 15-20 minutos**

- 2 min: Fix Docker + preparación
- 5 min: Copiar archivos (depende de tu internet)
- 8 min: Build Docker images
- 3 min: SSL + configuración
- 2 min: Database + verificación

---

## **🔐 DURANTE LA EJECUCIÓN:**

El script te pedirá:
- **Contraseña SSH**: `Rogermck224@` (varias veces)
- Solo eso - todo lo demás es automático

---

## **📊 VERÁS ESTE PROGRESO:**

```
================================================================
  VCSA ACADEMY - MASTER DEPLOYMENT
================================================================

================================================================
  STEP 1: Fix Docker Compose Conflict
================================================================
>>> Removing conflicting docker-compose-plugin...
✓ Docker Compose conflict resolved

================================================================
  STEP 2: Verify Docker Installation
================================================================
>>> Checking Docker status...
✓ Docker version: 29.1.3
✓ Docker Compose version: 2.40.3

[... continúa por 14 pasos ...]

================================================================
  DEPLOYMENT COMPLETED SUCCESSFULLY
================================================================

Your VCSA Academy application is now live!

Access URLs:
  Frontend: https://salesmastersminds.com
  API: https://api.salesmastersminds.com
  API Docs: https://api.salesmastersminds.com/api/docs
```

---

## **⚠️ IMPORTANTE - POST-DEPLOYMENT:**

Cuando termine, **IMMEDIATAMENTE** ejecuta:

```bash
# 1. Cambiar passwords (CRÍTICO)
ssh root@31.220.63.211 "cd /var/www/vcsa-academy && nano .env"

# 2. Cambiar estos valores:
#    - MONGO_ROOT_PASSWORD
#    - JWT_SECRET

# 3. Restart backend
ssh root@31.220.63.211 "cd /var/www/vcsa-academy && docker-compose restart backend"
```

---

## **✅ LISTO - EJECUTA AHORA:**

```bash
./deployment-master.sh
```

**Avísame cuando termine y te ayudo a verificar que todo funciona.** 🚀
