# 📱 EXPO GO - INSTRUCCIONES PARA ABRIR LA APP

## ⚡ MÉTODO MÁS RÁPIDO (2 minutos)

El servidor de desarrollo tuvo un problema técnico. Aquí está **cómo abrir la app manualmente**:

---

## 📋 PASO 1: INSTALAR EXPO GO

### Android
1. Abre **Google Play Store**
2. Busca: **"Expo Go"**
3. Instala la app oficial de Expo

### iPhone
1. Abre **App Store**
2. Busca: **"Expo Go"**
3. Instala la app oficial de Expo

---

## 🚀 PASO 2: INICIAR SERVIDOR DE DESARROLLO

Abre tu terminal y ejecuta:

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
npm start
```

**Esto iniciará el servidor de desarrollo de Expo**

---

## 📱 PASO 3: ESCANEAR QR

1. **Se abrirá una terminal** con un **QR code**
2. **Abre Expo Go** en tu teléfono
3. **Toca "Scan QR Code"**
4. **Escanea el QR** que aparece en tu terminal

---

## ✅ ¡LA APP SE ABRIRÁ EN TU TELÉFONO!

Verás las 5 pantallas:
- 📊 **Dashboard** - Readiness Score, Daily Goals
- 📚 **Training** - Biblioteca de training
- 🎯 **Coaching** - Events y registrations
- 📥 **Resources** - Downloads
- 👤 **Profile** - Perfil y settings

---

## 🔄 ALTERNATIVA: USAR EXPO WEB

Si no tienes teléfono handy:

1. Ejecuta en terminal:
```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
npm start
```

2. Cuando veas el QR, presiona **`w`** en tu terminal

3. Se abrirá en tu navegador: **http://localhost:19006**

---

## 🐛 PROBLEMAS COMUNES

### Error: "too many open files"
```bash
# Aumentar límite de archivos
ulimit -n 4096
npm start
```

### No aparece QR
```bash
# Asegúrate de estar en el directorio correcto
cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
pwd  # Debe mostrar: /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
npm start
```

### Expo Go no puede conectar
- Asegúrate de que tu teléfono y computadora estén en la **misma red WiFi**
- Deshabilita VPN si la tienes activada
- Reinicia Expo Go app

---

## 🎯 PRÓXIMOS PASOS

Una vez que la app esté abierta:

1. ✅ **Prueba la navegación** entre las 5 tabs
2. ✅ **Verifica que todos los componentes carguen**
3. ✅ **Revisa el diseño** en tu dispositivo real
4. ✅ **Toma screenshots** si necesitas mostrar el progreso

---

## 📞 AYUDA

Si encuentras problemas:

1. **Revisa la terminal** para ver logs de error
2. **Visita**: https://docs.expo.dev
3. **Expo Forums**: https://forums.expo.dev
4. **Expo Discord**: https://discord.gg/expo

---

## ⏱️ TIEMPO ESTIMADO

| Método | Tiempo |
|--------|--------|
| **Expo Go (QR)** | 2-3 minutos |
| **Expo Web** | 1 minuto |
| **APK Build** | 10-20 minutos |

---

**📱 VCSA Mobile está lista para probar!**

**Método recomendado**: Expo Go con QR code (más rápido y simple)

---

*Última actualización: 8 de Abril, 2026*
