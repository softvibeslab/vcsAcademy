# 🚀 DEPLOY LOCAL - PUERTOS SIMPLES

## 🎯 NUEVA CONFIGURACIÓN

**Contenedores nuevos con puertos memorables:**
- 🌐 **Frontend:** vcsa-web-local → Puerto **1234**
- ⚙️ **Backend:** vcsa-api-local → Puerto **2345**
- 🗄️ **MongoDB:** vcsa-db-local → Puerto **3456**

---

## 🚀 CÓMO INICIAR

### **PASO 1: Iniciar Docker Desktop**
- Abre Docker Desktop en tu Mac
- Espera a que esté completamente iniciado

### **PASO 2: Ejecutar el script**

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy
./INICIAR_LOCAL.sh
```

---

## 🌐 ACCESO AL SISTEMA

### **Frontend (Nueva URL fácil):**
```
http://localhost:1234
```

### **Backend API:**
```
http://localhost:2345
```

### **MongoDB:**
```
mongodb://localhost:3456
```

---

## 👥 USUARIOS DEMO

### **Demo User:**
```
Email: demo@vcsa.com
Password: demo123
```

### **Admin User:**
```
Email: admin@vcsa.com
Password: admin123
```

---

## 📋 COMANDOS ÚTILES

### **Ver estado:**
```bash
docker-compose -f docker-compose.local.yml ps
```

### **Ver logs:**
```bash
docker-compose -f docker-compose.local.yml logs -f
```

### **Detener:**
```bash
docker-compose -f docker-compose.local.yml down
```

---

## ⚠️ SI HAY PROBLEMAS

### **Verificar puertos disponibles:**
```bash
lsof -i :1234
lsof -i :2345
lsof -i :3456
```

### **Verificar Docker:**
```bash
docker ps
```

### **Reiniciar todo:**
```bash
docker-compose -f docker-compose.local.yml down
./INICIAR_LOCAL.sh
```

---

## ✅ VERIFICACIÓN

### **Frontend:**
```bash
curl http://localhost:1234
```

### **Backend:**
```bash
curl http://localhost:2345/api/health
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Abre Docker Desktop
2. ✅ Ejecuta: `./INICIAR_LOCAL.sh`
3. ✅ Abre: **http://localhost:1234**
4. ✅ Login: **demo@vcsa.com** / **demo123**

---

## 📊 RESUMEN DE PUERTOS

| Servicio | Puerto Local | Puerto Interno |
|----------|--------------|----------------|
| Frontend | **1234** | 80 |
| Backend | **2345** | 8000 |
| MongoDB | **3456** | 27017 |

---

**¡PUERTOS FÁCILES DE RECORDAR!** 🎯

1234 (Frontend) → **Uno-dos-tres-cuatro**
2345 (Backend) → **Dos-tres-cuatro-cinco**
3456 (MongoDB) → **Tres-cuatro-seis-siete**

**¡Listo para usar!** 🚀
