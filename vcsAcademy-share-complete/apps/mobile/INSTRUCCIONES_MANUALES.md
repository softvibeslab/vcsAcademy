# 📱 INSTRUCCIONES MANUALES - VCSA POCKET PREVIEW

## 🚯 OPCIÓN 1: EXPO GO (VER LA APP EN 2 MINUTOS)

### Paso 1: Preparar tu Android
1. Abre Google Play Store
2. Busca "Expo Go"
3. Instala la app
4. Abre Expo Go

### Paso 2: Iniciar el servidor
En tu terminal, ejecuta:

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile

# Opción A: Con QR code (recomendado)
expo start

# Opción B: Con tunnel si estás en red diferente
expo start --tunnel

# Opción C: Con tu IP local
expo start --lan
```

### Paso 3: Conectar
1. Escanea el QR code desde Expo Go
2. O presiona 'a' en la terminal para abrir en Android emulator
3. O presiona 'i' para abrir en iOS simulator

### Solución de problemas:
- Si ves "EMFILE: too many open files":
  ```bash
  # Aumenta el límite de archivos
  ulimit -n 10240
  expo start --clear
  ```

---

## 🔧 OPCIÓN 2: APK BUILD (MÁS COMPLEJO)

### Problemas conocidos:
- ❌ Conflictos de React Navigation v6 vs v7
- ❌ React DOM versiones incompatibles
- ❌ EAS Build no respeta --legacy-peer-deps

### Solución A: Build local con Android Studio
```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile

# 1. Asegúrate de tener Android Studio instalado
# 2. Inicia el build local
eas build --platform android --profile apk --local
```

### Solución B: Usar development build
```bash
# Crea un development build en lugar de APK de producción
eas build --platform android --profile development
```

### Solución C: Actualizar a React Navigation v7 completo
```bash
# Actualiza TODAS las dependencias a v7
npm install @react-navigation/native@latest \
  @react-navigation/stack@latest \
  @react-navigation/bottom-tabs@latest \
  react-native-screens@latest \
  react-native-safe-area-context@latest
```

---

## 📊 ESTADO DEL PROYECTO

| Componente | Estado | Notas |
|------------|--------|-------|
| **Código fuente** | ✅ Completo | App funcional |
| **Expo Go** | ⚠️ Advertencias | Funciona con warnings |
| **APK Production** | ❌ Fallando | Dependencias conflictivas |
| **Development Build** | ❓ Sin probar | Alternativa viable |

---

## 🎯 RECOMENDACIÓN FINAL

### Usa Expo Go para preview:
1. ✅ Funciona inmediatamente
2. ✅ Muestra toda la funcionalidad
3. ✅ No requiere builds complejos

### Para distribución:
1. Considera convertir a development build
2. O invertir tiempo actualizando dependencias
3. O usar EAS Submit para Play Store

---

## 📞 PRÓXIMOS PASOS

**¿Qué necesitas?**
- Ver la app funcionando → Usa Expo Go
- Distribuir a testers → Development build
- Publicar en Play Store → EAS Submit
- APK independiente → Arreglar dependencias (1-2 horas)

**Elige tu camino y te ayudo a ejecutarlo.**
