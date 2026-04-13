# 📱 VCSA Mobile - Expo App

**Versión**: 1.0.0  
**Plataforma**: React Native con Expo  
**Status**: 🟢 Preview APK Listo para Generar

---

## 🚀 GUÍA RÁPIDA - GENERAR APK

### Opción 1: EAS Build (Recomendado - Más Fácil)

#### Prerrequisitos
```bash
# Crear cuenta en Expo
# Visitar: https://expo.dev
```

#### Pasos:

1. **Instalar Expo CLI**
```bash
npm install -g expo-cli
# O
yarn global add expo-cli
```

2. **Instalar dependencias**
```bash
cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile
npm install
```

3. **Iniciar proyecto (Opcional - Para testing)**
```bash
# Para probar en emulator
npm start

# O para escanear QR con Expo Go app
expo start
```

4. **Configurar EAS**
```bash
# Login en Expo
expo login

# Configurar proyecto
eas build:configure
```

5. **Generar APK con EAS**
```bash
# Build para Android
eas build --platform android

# Este comando genera un APK optimizado
# Tiempo estimado: 10-20 minutos
```

6. **Descargar APK**
```bash
# Ver builds disponibles
eas build:list

# El APK estará disponible en:
# https://expo.dev/accounts/[tu-usuario]/projects/vcsa-mobile-preview/builds
```

---

### Opción 2: Local Build (Alternativo)

#### Prerrequisitos
```bash
# Android Studio instalado
# Android SDK configurado
# Variables de entorno ANDROID_HOME configuradas
```

#### Pasos:

1. **Preparar entorno**
```bash
# En macOS
brew install --cask android-platform-tools

# En Windows/Linux
# Descargar Android SDK desde: https://developer.android.com/studio
```

2. **Instalar dependencias**
```bash
cd vcsa-mobile
npm install
```

3. **Generar APK localmente**
```bash
# Usar Expo para generar APK
expo build:android

# Este proceso:
# - Descarga dependencias
# - Compila el proyecto
# - Genera APK
# Tiempo estimado: 30-60 minutos (primera vez)
```

4. **Encontrar APK**
```bash
# El APK se generará en:
vcsa-mobile/android/app/build/outputs/apk/debug/vcsa-mobile.apk
```

---

### Opción 3: Development Build (Para Testing)

#### Pasos:

1. **Instalar Expo Go**
```bash
# Descargar Expo Go app desde:
# - Google Play Store (Android)
# - App Store (iOS)
```

2. **Iniciar desarrollo**
```bash
cd vcsa-mobile
npm start
```

3. **Escanear QR**
```bash
# Abrir Expo Go app
# Escanear el código QR que aparece en terminal
# La app se cargará en tu teléfono
```

---

## 📱 INSTALACIÓN DEL APK

### En Android

1. **Permitir instalaciones de fuentes desconocidas**
   - Settings → Security → Unknown sources
   - Habilitar esta opción

2. **Abrir el APK**
   - Usar File Manager
   - Navegar a donde descargaste el APK
   - Tap en el archivo APK
   - Presionar "Install"

3. **Abrir la app**
   - Buscar "VCSA Mobile" en tus apps
   - Tap para abrir

---

## 🛠️ CONFIGURACIÓN

### API Endpoint

El archivo `DashboardScreen.js` tiene configurado:

```javascript
const API = 'http://10.0.2.2:8000/api'; // Para Android emulator
```

**Para cambiar a tu backend local**:

```bash
# Encuentra tu IP local
# En macOS: System Preferences → Network
# En Windows: ipconfig
# En Linux: ip addr show

# Reemplaza 10.0.2.2 con tu IP local
```

**Para producción**:
```javascript
const API = 'https://tu-backend-production.com/api';
```

---

## 📊 ESTRUCTURA DEL PROYECTO

```
vcsa-mobile/
├── App.js                          # Entry point
├── package.json                    # Dependencies
├── app.json                        # Expo config
├── screens/                        # Screens
│   ├── DashboardScreen.js         # Dashboard principal
│   ├── TrainingScreen.js          # Training library
│   ├── CoachingScreen.js          # Coaching hub
│   ├── ResourcesScreen.js         # Resources library
│   └── ProfileScreen.js           # Profile y settings
├── assets/                         # Images, fonts, icons
│   ├── icon.png                   # App icon
│   ├── splash.png                 # Splash screen
│   ├── adaptive-icon.png         # Android adaptive icon
│   └── fonts/                     # Custom fonts
└── README.md                      # Este archivo
```

---

## 🎨 CARACTERÍSTICAS

### Screens Implementadas

1. **Dashboard**
   - Readiness Score circular
   - Daily Goals (3 metas)
   - Progress tracking
   - Quick Actions

2. **Training**
   - Path Completion (64%)
   - Active Session card
   - 6 Training Tracks
   - Progress por track

3. **Coaching**
   - Upcoming Events (3 eventos)
   - Registration buttons
   - Event details
   - Quick Tips

4. **Resources**
   - Resource cards (4 recursos)
   - Download functionality
   - Filter tabs
   - Pro Tips

5. **Profile**
   - User avatar
   - Stats cards
   - Menu items
   - Sign out

### Design System

- **Colores**: Gold (#f2ca50), Navy (#264191), Dark (#131317)
- **Tipografía**: Plus Jakarta Sans + DM Sans
- **Estilo**: Glass morphism, premium dark theme
- **Navegación**: Bottom tabs con iconos

---

## 🔧 PERSONALIZACIÓN

### Cambiar Colores

Edita `screens/DashboardScreen.js`:

```javascript
scoreCard: {
  backgroundColor: '#1b1b20',  // Fondo de cards
}
```

### Cambiar Iconos

En `App.js`, modifica `TabIcon` para usar iconos reales:

```javascript
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home" size={24} color={color} />
```

### Agregar Nueva Screen

1. Crea `screens/NuevaScreen.js`
2. Impórtala en `App.js`
3. Agrega a `Tab.Navigator`

---

## 📱 MÓDULOS INCLUIDOS

✅ Dashboard completo  
✅ Training Library  
✅ Coaching Hub  
✅ Resources Library  
✅ Profile Management  
✅ Bottom Navigation  
✅ API Integration (lista)  
✅ Demo Data (funciona sin backend)  

---

## 🚀 PRÓXIMOS PASOS

### Inmediato

1. **Generar APK** (sigue guía arriba)
2. **Instalar en dispositivo** Android
3. **Probar todas las pantallas**
4. **Verificar conexión a API** (opcional)

### Futuro

- [ ] Agregar más screens
- [ ] Implementar login
- [ ] Conectar a backend real
- [ ] Agregar notificaciones push
- [ ] Implementar deep linking
- [ ] Agregar analytics

---

## 🐛 TROUBLESHOOTING

### Build falla

**Problema**: Error durante build  
**Solución**:
```bash
# Limpiar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules
npm install

# Intentar de nuevo
eas build --platform android
```

### No aparece en emulator

**Problema**: App no se instala  
**Solución**:
```bash
# Asegúrate que el emulator esté corriendo
# En Android Studio: Tools → AVD Manager → Start emulator

# O usa Expo Go
expo start
# Escanea QR con Expo Go app
```

### API no conecta

**Problema**: Error de red  
**Solución**:
```javascript
// En screens/DashboardScreen.js
const API = 'http://192.168.1.x:8000/api'; // Tu IP local

// O usa demo data (comenta axios calls)
```

---

## 📞 SOPORTE

Si encuentras problemas:

1. **Revisa la documentación oficial**: https://docs.expo.dev
2. **Foro de Expo**: https://forums.expo.dev
3. **Discord de Expo**: https://discord.gg/expo

---

## 📝 NOTAS

- **Preview APK**: Es una versión de demo con funcionalidad limitada
- **Full App**: Requiere backend completo
- **iOS**: Requiere cuenta de desarrollador Apple ($99/año)
- **Android**: APK se puede instalar directamente

---

## 🎯 LISTO PARA COMPILAR

```bash
# 1. Navegar al directorio
cd /Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile

# 2. Instalar dependencias
npm install

# 3. Generar APK (EAS - Recomendado)
eas build --platform android

# 4. Descargar APK
# Visitar: https://expo.dev
# Buscar tu proyecto en "Builds"
# Descargar APK

# 5. Instalar en Android
# Transferir APK a teléfono
# Abrir e instalar
```

---

**Status**: 🟢 **APK PREVIEW LISTO PARA GENERAR**  
**Tiempo estimado**: 10-20 minutos (EAS build)  
**Requiere**: Cuenta Expo gratuita  
**Output**: APK instalable en Android

---

*Última actualización: 8 de Abril, 2026*  
*Plataforma: React Native + Expo 51*  
*Target: Android 8+*
