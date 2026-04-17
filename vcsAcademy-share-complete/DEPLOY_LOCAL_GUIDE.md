# 🚀 DEPLOY LOCAL - VCSA ACADEMY

## 📋 CONFIGURACIÓN

**Contenedores nuevos:**
- Frontend: `vcsa-web-local` → Puerto **3002**
- Backend: `vcsa-api-local` → Puerto **8002**
- MongoDB: `vcsa-db-local` → Puerto **27020**

**Sin conflictos con otros proyectos** ✅

---

## 🚀 CÓMO INICIAR

### **Opción 1: Script Automático** ⚡

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy
./INICIAR_LOCAL.sh
```

### **Opción 2: Manual**

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy
docker-compose -f docker-compose.local.yml up -d
```

---

## 🌐 ACCESO AL SISTEMA

### **Frontend (Nueva URL):**
```
http://localhost:3002
```

### **Backend API:**
```
http://localhost:8002
```

### **MongoDB:**
```
mongodb://localhost:27020
```

---

## 👥 USUARIOS DEMO

### **Usuario Demo:**
```
Email: demo@vcsa.com
Password: demo123
Rol: Member
```

### **Usuario Admin:**
```
Email: admin@vcsa.com
Password: admin123
Rol: Admin
```

---

## 🛠️ COMANDOS ÚTILES

### **Ver estado de los contenedores:**
```bash
docker-compose -f docker-compose.local.yml ps
```

### **Ver logs en tiempo real:**
```bash
docker-compose -f docker-compose.local.yml logs -f
```

### **Logs de un servicio específico:**
```bash
docker-compose -f docker-compose.local.yml logs -f vcsa-web-local
docker-compose -f docker-compose.local.yml logs -f vcsa-api-local
docker-compose -f docker-compose.local.yml logs -f vcsa-db-local
```

### **Detener los servicios:**
```bash
docker-compose -f docker-compose.local.yml down
```

### **Reiniciar los servicios:**
```bash
docker-compose -f docker-compose.local.yml restart
```

---

## 🔄 CAMBIOS ENTRE DEPLOY LOCAL Y NETLIFY

### **Deploy Local (Desarrollo):**
- URL: http://localhost:3002
- Backend: http://localhost:8002
- Contenedores: vcsa-*-local

### **Netlify (Producción):**
- URL: [Tu URL de Netlify]
- Backend: [Tu backend de producción]
- Archivo: netlify-deploy.zip

---

## 📊 VOLUMES DE DATOS

**Base de datos local:** `vcsa_mongo_local`
- Datos persistentes aunque detengas los contenedores
- Ubicación: Docker volumes

---

## 🆨 SOLUCIÓN DE PROBLEMAS

### **Si los contenedores no inician:**
```bash
# Verificar Docker
docker ps

# Verificar puertos disponibles
lsof -i :3002
lsof -i :8002
lsof -i :27020
```

### **Si hay errores de conexión:**
```bash
# Verificar que los servicios están healthy
docker-compose -f docker-compose.local.yml ps

# Ver logs de backend
docker logs vcsa-api-local
```

### **Para limpiar todo y empezar de cero:**
```bash
# Detener y eliminar contenedores
docker-compose -f docker-compose.local.yml down

# Eliminar volúmenes (Opcional - BORRA DATOS)
docker volume rm vcsa_mongo_local vcsa_mongo_config

# Reiniciar
./INICIAR_LOCAL.sh
```

---

## ✅ VERIFICACIÓN

Después de iniciar, verifica que todo funciona:

1. **Frontend responde:**
   ```bash
   curl http://localhost:3002
   ```

2. **Backend responde:**
   ```bash
   curl http://localhost:8002/api/health
   ```

3. **MongoDB responde:**
   ```bash
   mongosh mongodb://localhost:27020
   ```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Iniciar Docker Desktop
2. ✅ Ejecutar `./INICIAR_LOCAL.sh`
3. ✅ Abrir http://localhost:3002
4. ✅ Login con demo@vcsa.com / demo123
5. ✅ Probar todas las funcionalidades

---

**¡Sistema listo para desarrollo local sin conflictos!** 🚀
