# 📱 CÓMO VER VCSA POCKET EN ANDROID

## 🎯 PASO 1: PREPARAR TU COMPUTADORA

### ABRE UNA NUEVA TERMINAL:

```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
./INICIAR_EXPO_MANUAL.sh
```

O manualmente:

```bash
ulimit -n 10240
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
npx expo start
```

---

## 📲 PASO 2: PREPARAR TU ANDROID

### Opción A: Con QR Code (Más fácil)

1. **Instala Expo Go:**
   - Abre Google Play Store
   - Busca "Expo Go"
   - Instala la app

2. **Escanea el QR:**
   - Abre Expo Go
   - Toca "Scan QR Code"
   - Escanea el QR que aparece en tu terminal

### Opción B: Con URL Manual

1. **Instala Expo Go** (como arriba)

2. **En Expo Go:**
   - Toca "Enter URL manually"
   - Escribe la URL que aparece en tu terminal
   - Ejemplo: `exp://192.168.1.xxx:19000`

---

## ✅ PASO 3: DISFRUTA LA APP

Una vez conectado, verás:

- 🎯 **AI Voice Coach** - Entrenamiento de voz
- 🎮 **Gamificación** - Puntos, badges, leaderboards
- 📊 **Financial Goals** - Planificación financiera
- 📈 **Daily Tracking** - Seguimiento diario
- 🎨 **Dark Theme Premium** - Diseño de lujo

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Si no aparece el QR:
- Presiona `w` en la terminal → Abre en web
- Presiona `a` → Abre en Android emulator
- Presiona `i` → Abre en iOS simulator

### Si la app no carga:
- Asegúrate de estar en la misma red WiFi
- Reinstala Expo Go
- Reinicia el servidor: `Ctrl+C` luego vuelve a ejecutar

### Si ves errores de dependencias:
- Son warnings, la app funciona igual
- O ejecuta: `npm install --legacy-peer-deps`

---

## 📞 ¿NECESITAS AYUDA?

Si tienes problemas, asegúrate de:
1. Estar en el directorio correcto: `/Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile`
2. Tener Expo Go instalado
3. Estar en la misma red WiFi
4. Tener el límite de archivos aumentado: `ulimit -n 10240`

---

## 🚀 ¡LISTO!

Una vez que veas la app funcionando, puedes:
- Probar el AI Voice Coach
- Crear metas financieras
- Hacer tracking diario
- Competir en leaderboards
- ¡Y mucho más!

**¡Disfruta VCSA Pocket!** 🎉
