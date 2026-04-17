# 📱 GUÍA PASO A PASO - GENERAR APK VCSA ANDROID

**Fecha**: 2026-04-15  
**App**: VCSA Mobile Enhanced  
**Objetivo**: Generar APK instalable para cualquier dispositivo Android

---

## 🚀 **MÉTODO RECOMENDADO: EAS BUILD**

### **PREREQUISITOS**

1. **Cuenta de Expo** (Gratis)
   - Visitar: https://expo.dev
   - Crear cuenta gratuita usando email/GitHub

2. **Node.js y npm** (Ya instalados ✅)
   - ✅ Node.js v22.22.2
   - ✅ npm 10.9.7

3. **Backend corriendo** (Ya operational ✅)
   - ✅ http://localhost:8001

---

## 📋 **PASOS DETALLADOS**

### **PASO 1: Instalar EAS CLI**

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
npm install -g eas-cli
```

**Verificar instalación**:
```bash
eas --version
# Debería mostrar: eas-cli/18.7.0 darwin-arm64 node-v22.22.2
```

---

### **PASO 2: Login en Expo**

```bash
eas login
```

**Esto abrirá tu navegador** para que te autentiques con:
- **Email** (tu correo electrónico)
- **Password** (tu contraseña de Expo)

**Alternativa**: Si estás en CI/CD, usa variable de entorno:
```bash
EXPO_TOKEN=xxx eas build ...
```

---

### **PASO 3: Configurar Proyecto**

```bash
eas build:configure
```

**Este comando creará**:
- `eas.json` - Configuración de build
- Vinculará tu proyecto con tu cuenta de Expo

**Respuestas esperadas**:
```
? Would you like to automatically create an EAS project for @vcsa-mobile?
✅ Yes
```

---

### **PASO 4: Generar APK**

```bash
eas build --platform android --profile preview
```

**Opciones disponibles**:
- `--platform android` - Para Android
- `--profile preview` - Build rápido (10-15 min)
- `--profile production` - Build optimizado (20-30 min)

---

### **PASO 5: Monitorear Build**

El build tomará **10-20 minutos**. Durante este tiempo:

**En tu terminal**:
```
✅ Build started...
✅ Waiting for queue...
✅ Build in progress...
✅ Build completed!
```

**En tu navegador**:
- Visita: https://expo.dev
- Navega a: Projects → vcsa-mobile
- Ver: Builds → Latest build

---

### **PASO 6: Descargar APK**

**Cuando el build termine**:

1. **Ir a**: https://expo.dev
2. **Seleccionar**: Projects → vcsa-mobile
3. **Abrir**: Builds
4. **Descargar**: APK generado
5. **Transferir**: A tu teléfono Android

---

### **PASO 7: Instalar APK en Android**

1. **Habilitar Unknown Sources**:
   - Settings → Security → Unknown sources
   - Habilitar opción

2. **Abrir APK**:
   - Usar File Manager
   - Encontrar archivo APK
   - Tap en archivo

3. **Instalar**:
   - Presionar "Install"
   - Esperar instalación
   - Abrir app "VCSA Mobile"

---

## 🧪 **ALTERNATIVA: TESTING INMEDIATO (MÁS RÁPIDO)**

### **OPCIÓN 1: Expo Go (Testing Instantáneo)**

**Ventajas**:
- ✅ No requiere build (5 minutos)
- ✅ Testing inmediato en tu teléfono
- ✅ Hot reload para cambios

**Pasos**:

1. **Instalar Expo Go**:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Iniciar desarrollo**:
   ```bash
   cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
   npx expo start
   ```

3. **Escanear QR**:
   - Se mostrará código QR
   - Abrir Expo Go app
   - Escanear QR
   - ¡App cargará en tu teléfono!

4. **Probar con Backend Real**:
   - Email: `demo@vcsa.com`
   - Password: `demo123`
   - Verás datos del backend real

---

## 📱 **MÉTODO 2: ANDROID STUDIO EMULATOR**

### **Prerrequisitos**:
- Android Studio instalado
- AVD (Android Virtual Device) configurado

**Pasos**:
```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
npx expo start
# Presiona 'a' para abrir en Android emulator
```

---

## 🎯 **RECOMENDACIÓN DE EJECUCIÓN**

### **PARA HOY (Testing Rápido)**:
1. ✅ **Probar con Expo Go** (5 minutos)
2. ✅ **Verificar integración con backend**
3. ✅ **Probar login y todas las screens**
4. ✅ **Identificar bugs o mejoras**

### **PARA MAÑANA (Generar APK)**:
1. ✅ **Crear cuenta Expo** (gratis)
2. ✅ **Ejecutar `eas build --platform android`**
3. ✅ **Esperar 10-20 minutos**
4. ✅ **Descargar e instalar APK**

### **PARA ESTA SEMANA (Distribution)**:
1. ✅ **Distribuir APK a testers**
2. ✅ **Recibir feedback**
3. ✅ **Hacer mejoras basadas en feedback**
4. ✅ **Preparar versión para Play Store**

---

## 🔧 **TROUBLESHOOTING**

### **EAS Build falla con "Invalid UUID appId"**

**Causa**: Proyecto no vinculado con cuenta Expo

**Solución**:
```bash
# 1. Login
eas login

# 2. Configurar proyecto
eas build:configure

# 3. Volver a intentar
eas build --platform android
```

### **Build falla con "GraphQLError"**

**Causa**: Error de autenticación

**Solución**:
```bash
# Logout y login nuevamente
eas logout
eas login

# Intentar build nuevamente
eas build --platform android
```

### **Build tarda más de 30 minutos**

**Causa**: Cola de builds en EAS

**Solución**:
- Esperar a que se libere cola
- O usar `--profile production` para prioridad

---

## 📊 **ESTADO DEL PROYECTO**

**Configuración Actual**:
- ✅ **App Name**: VCSA Mobile
- ✅ **Package**: com.vcsa.mobile
- ✅ **Version**: 1.0.0
- ✅ **Backend**: http://localhost:8001/api
- ✅ **EAS CLI**: v18.7.0 instalado
- ✅ **Expo SDK**: v51.0.0

**Screens Implementadas**:
- ✅ Login Screen (con autenticación real)
- ✅ Dashboard (con API real)
- ✅ Training (con tracks API)
- ✅ Coaching
- ✅ Resources
- ✅ Profile

**Features**:
- ✅ Authentication completa
- ✅ Progress tracking
- ✅ Academy Modules
- ✅ Pull-to-refresh
- ✅ Error handling
- ✅ Loading states

---

## 🎉 **PRÓXIMOS PASOS**

### **INMEDIATO**:
1. **Probar app con Expo Go** (método más rápido)
2. **Verificar todas las funcionalidades**
3. **Identificar bugs o mejoras**

### **CORTO PLAZO**:
1. **Generar APK con EAS Build**
2. **Instalar en dispositivo real**
3. **Testing con datos reales**
4. **Iterar basado en feedback**

### **MEDIANO PLAZO**:
1. **Publicar en Play Store**
2. **Implementar analytics**
3. **Agregar notificaciones push**
4. **Optimizar performance**

---

## 📞 **SOPORTE**

Si encuentras problemas:

**Documentación Oficial**:
- EAS Build: https://docs.expo.dev/build/introduction/
- Expo Go: https://docs.expo.dev/getting-started/installation/
- Android Building: https://docs.expo.dev/android/building/

**Foros**:
- Expo Forums: https://forums.expo.dev/
- Discord de Expo: https://discord.gg/expo

**Proyecto VCSA**:
- Issues: https://github.com/softvibeslab/vcsAcademy/issues
- Wiki: /Users/newproject/Documents/GitHub/vcsAcademy/wiki/

---

## 🚀 **RESUMEN EJECUCIÓN**

**ESTADO ACTUAL**: 🟢 **LISTO PARA GENERAR APK**

**PRÓXIMO PASO RECOMENDADO**:
1. **Crear cuenta Expo gratuita** (2 minutos)
2. **Ejecutar `eas login`** (1 minuto)
3. **Ejecutar `eas build --platform android`** (10-20 minutos)
4. **Descargar e instalar APK** (2 minutos)

**TIEMPO TOTAL ESTIMADO**: ~20 minutos

**RESULTADO**: APK instalable en cualquier Android 8+

---

**¿Listo para generar tu primera VCSA Mobile APK?** 🚀

Sigue los pasos arriba y tendrás tu app funcionando en tu teléfono Android en menos de 30 minutos.

---

**Actualizado**: 2026-04-15  
**Versión App**: 2.0.0 Enhanced  
**Backend**: http://localhost:8001 ✅ Online
