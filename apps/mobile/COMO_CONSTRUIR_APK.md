# 📱 CÓMO CONSTRUIR APK DE VCSA POCKET

## 🚀 OPCIÓN 1: Script Simple (Recomendado)

### Pasos:
1. **Abre una terminal y navega al directorio:**
   ```bash
   cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
   ```

2. **Ejecuta el script de construcción:**
   ```bash
   ./build-apk.sh
   ```

3. **Espera 5-10 minutos**
   - Recibirás un email cuando esté listo
   - También puedes ver el progreso en: https://expo.dev

---

## 🔧 OPCIÓN 2: Comando Manual

### Pasos:
1. **Navega al directorio:**
   ```bash
   cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
   ```

2. **Inicia sesión en Expo (si no estás logueado):**
   ```bash
   eas login
   ```

3. **Construye el APK:**
   ```bash
   eas build --platform android --profile apk
   ```

---

## 📋 QUÉ SUCEDE DURANTE LA CONSTRUCCIÓN:

1. **Subida de código** - Tu código se sube a los servidores de Expo
2. **Construcción** - Se compila la app nativa de Android
3. **Firma** - Se firma el APK con tu certificado
4. **Descarga** - Recibes un link para descargar el APK

---

## ⏱️  TIEMPOS ESTIMADOS:

- **Primera vez:** 10-15 minutos (necesita configurar proyecto)
- **Siguientes:** 5-10 minutos

---

## 📧 NOTIFICACIONES:

Recibirás un email en: **softvibeslab@gmail.com** con:
- Link de descarga del APK
- Información de la construcción
- QR code para descargar directamente

---

## 🔗 LINKS ÚTILES:

- **Panel de Expo:** https://expo.dev
- **Tus construcciones:** https://expo.dev/accounts/softvibeslab/projects/vcsa-pocket/builds

---

## 🆘 SOLUCIÓN DE PROBLEMAS:

### Si el script no funciona:
```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile
eas build --platform android --profile apk
```

### Si necesitas configurar el proyecto:
```bash
eas build:configure
```

---

## 📱 DESPUÉS DE OBTENER EL APK:

1. **Descarga el APK** del link del email
2. **Transfiérelo a tu teléfono** Android
3. **Instala el APK** (habilita "Fuentes desconocidas")
4. ¡**Disfruta VCSA Pocket!**

---

**✅ El proyecto está listo para construir el APK.**
**🚀 Ejecuta el script y espera tu email de confirmación.**
