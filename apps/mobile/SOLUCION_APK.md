# 🔧 SOLUCIÓN PARA EL ERROR DEL APK

## ❌ EL PROBLEMA:
```
Invalid UUID appId
Request ID: 1ee61971-13c5-42b3-b327-014c4554b863
Error: GraphQL request failed.
```

## ✅ LA SOLUCIÓN:

El proyecto necesita un **ID de proyecto válido de Expo**. Sigue estos pasos:

### PASO 1: Crear proyecto en Expo

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
eas build:configure
```

Cuando te pregunte: **"Would you like to automatically create an EAS project?"**
- Responde: **"Yes"** o **"Sí"**

### PASO 2: Actualizar app.json

Después de ejecutar el comando anterior, tu archivo `app.json` tendrá automáticamente un `projectId` válido.

### PASO 3: Construir el APK

```bash
./build-apk.sh
```

o

```bash
eas build --platform android --profile apk
```

---

## 🚨 SI SIGUE FALLANDO:

### Opción A: Usar Expo Go (Más Rápido)

En lugar de crear un APK, usa **Expo Go**:

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
npx expo start
```

Escanéa el código QR con la app **Expo Go** en tu teléfono Android.

### Opción B: Construcción Manual

Si necesitas un APK real y automático no funciona:

1. **Ve a:** https://expo.dev
2. **Inicia sesión** con softvibeslab@gmail.com
3. **Crea un proyecto nuevo** llamado "vcsa-pocket"
4. **Copia el projectId** que te den
5. **Agrégalo al app.json:**

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "AQUI_PEGA_EL_ID"
      }
    }
  }
}
```

---

## 📱 RECOMENDACIÓN:

Para **desarrollo y pruebas**, usa **Expo Go**:
- Más rápido (instantáneo vs 10 minutos)
- Sin configuración compleja
- Actualizaciones en tiempo real

Para **producción**, construye el APK:
- Sigue los pasos anteriores
- Tarda 10-15 minutos la primera vez
- Necesitas configurar el proyecto

---

**🎯 ¿Cuál prefieres?**
- **Expo Go** (instantáneo) → Ejecuta `npx expo start`
- **APK** (10 minutos) → Sigue los pasos de arriba
