# 🚀 CÓMO CREAR EL APK DE VCSA POCKET - INSTRUCCIONES DEFINITIVAS

## ✅ SITUACIÓN ACTUAL:
- ✅ El código está 100% completado
- ✅ Todas las pantallas funcionales
- ✅ 0 errores de TypeScript
- ❌ Necesitas un `projectId` válido de Expo

## 🎯 SOLUCIÓN MÁS RÁPIDA (Recomendada):

### **Opción 1: Expo Go (INSTANTÁNEO)**

**Abre una terminal NUEVA y ejecuta:**

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
npx expo start
```

**Aparecerá un código QR en tu terminal. Escanéalo con la app Expo Go en tu teléfono.**

- ⚡ **Instantáneo** (vs 10-15 minutos)
- 🔄 **Actualizaciones en tiempo real**
- 📱 **Sin configuración compleja**
- ✅ **Perfecto para pruebas**

---

### **Opción 2: APK Manual (5 minutos)**

**PASO 1:** Ve a https://expo.dev
**PASO 2:** Inicia sesión con `softvibeslab@gmail.com`
**PASO 3:** Crea un nuevo proyecto llamado "vcsa-pocket"
**PASO 4:** Copia el `projectId` que te den (algo como "abcd1234-efgh-5678-ijkl-90mnopqrstu")
**PASO 5:** Actualiza el archivo `app.json`:

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
nano app.json
```

Busca la sección `"extra"` y agrega:

```json
"extra": {
  "eas": {
    "projectId": "AQUI_PEGA_EL_ID_DE_EXPO"
  }
}
```

**PASO 6:** Guarda (Ctrl+O, Enter, Ctrl+X)

**PASO 7:** Ejecuta el build:

```bash
./build-apk.sh
```

o

```bash
eas build --platform android --profile apk
```

---

### **Opción 3: Método Web (Más Fácil)**

1. **Ve a:** https://expo.dev
2. **Inicia sesión** con tu cuenta
3. **Crea un nuevo proyecto** desde el dashboard
4. **Sube tu código** o conecta tu repositorio de GitHub
5. **Haz clic en "Build" → "Android" → "APK"
6. **Espera 10-15 minutos**
7. **Descarga el APK** cuando esté listo

---

## 📋 RESUMEN DE LO IMPLEMENTADO:

**🆕 Goal Sheet** - Hoja de metas financieras
**🎭 Play Role** - Práctica de escenarios con IA
**📱 + 5 pantallas** funcionales
**🎨 Sistema completo** de diseño
**✅ 0 errores TypeScript**

---

## 🎯 MI RECOMENDACIÓN:

**Para PRUEBAS INMEDIATAS:**
```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
npx expo start
```
Escanea el QR con **Expo Go**. Es instantáneo.

**Para APK DE PRODUCCIÓN:**
Sigue los pasos de la **Opción 2** anterior. Tarda 10-15 minutos pero obtienes un APK real.

---

## 🆘 AYUDA ADICIONAL:

Si necesitas ayuda visual:
- **Documentación de EAS:** https://docs.expo.dev/build/introduction/
- **Dashboard de Expo:** https://expo.dev
- **Soporte:** https://expo.dev/tickets

---

**✅ El proyecto está completo y listo. Elige la opción que más te convenga.**
