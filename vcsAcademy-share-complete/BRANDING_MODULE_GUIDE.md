# Módulo de Configuración de Branding

## 📋 Resumen

Sistema completo de configuración de branding y temas para la plataforma VCSA. Permite personalizar colores, tipografías, imágenes, textos y más sin necesidad de código.

## 🎯 Características

- ✅ CRUD completo de configuraciones de branding
- ✅ Múltiples configuraciones simultáneas
- ✅ Activación instantánea de temas
- ✅ Previsualización en tiempo real
- ✅ Variables CSS dinámicas
- ✅ Integración con React Context
- ✅ Persistencia en MongoDB

## 📁 Archivos Creados

### Backend
```
backend/
├── branding_routes.py          # Rutas API CRUD
└── seed_branding.py            # Script de inicialización
```

### Frontend
```
frontend/src/
├── contexts/
│   └── BrandingContext.js      # Contexto de React
└── pages/
    └── BrandingConfigPage.jsx  # Página de administración
```

## 🔧 Variables Configurables

### 1. Colores (BrandingColors)
```javascript
{
  primary: "#D4AF37",           // Color principal
  secondary: "#1E3A8A",         // Color secundario
  accent: "#F59E0B",            // Color de acento
  background: "#020204",        // Fondo principal
  card_background: "#0A0A0B",   // Fondo de tarjetas
  text_main: "#F8FAFC",         // Texto principal
  text_muted: "#94A3B8"         // Texto secundario
}
```

### 2. Imágenes (BrandingImages)
```javascript
{
  logo_url: "/logo.png",        // Logo principal
  logo_dark_url: "/logo-dark.png", // Logo modo oscuro
  favicon_url: "/favicon.ico",  // Favicon
  hero_background: "",          // Fondo hero (URL)
  login_background: ""          // Fondo login (URL)
}
```

### 3. Tipografía (BrandingTypography)
```javascript
{
  font_heading: "Playfair Display",  // Fuente títulos
  font_body: "DM Sans",              // Fuente cuerpo
  font_mono: "JetBrains Mono"        // Fuente código
}
```

### 4. Textos (BrandingTexts)
```javascript
{
  site_name: "Vacation Club Sales Academy",
  tagline: "The Performance Operating System",
  site_description: "Premium sales training platform"
}
```

### 5. Configuración UI (BrandingUIConfig)
```javascript
{
  border_radius: "0",          // 0, 4, 8, 12, 16
  button_style: "sharp",       // sharp, rounded, pill
  card_style: "glass",         // flat, elevated, glass
  animation_level: "normal"    // none, minimal, normal, high
}
```

### 6. Gradientes (BrandingGradients)
```javascript
{
  primary_gradient: "linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)",
  secondary_gradient: "linear-gradient(180deg, #020204 0%, #0F172A 100%)"
}
```

### 7. Redes Sociales (BrandingSocial)
```javascript
{
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  linkedin_url: "",
  youtube_url: ""
}
```

### 8. Avanzado (BrandingAdvanced)
```javascript
{
  custom_css: "",      // CSS personalizado
  head_scripts: "",    // Scripts para <head>
  body_scripts: ""     // Scripts para <body>
}
```

## 🚀 Instalación y Uso

### 1. Inicializar Base de Datos

```bash
cd backend
python seed_branding.py
```

Esto creará:
- 1 configuración por defecto (activa)
- 2 configuraciones de ejemplo

### 2. Acceder al Módulo

**URL**: `/admin/branding`

**Requisitos**: Usuario autenticado con rol de admin

### 3. Crear Nueva Configuración

1. Click en "Create New"
2. Personalizar las pestañas deseadas
3. Click en "Save Configuration"

### 4. Activar Configuración

1. Seleccionar configuración de la lista
2. Click en el ícono de ojo (Activate)
3. La configuración se aplicará automáticamente

## 🔌 API Endpoints

### Obtener Configuración Activa
```http
GET /api/branding/config
```

### Obtener Todas las Configuraciones
```http
GET /api/branding/config/all?skip=0&limit=20
```

### Obtener Configuración por ID
```http
GET /api/branding/config/{config_id}
```

### Crear Configuración
```http
POST /api/branding/config
Content-Type: application/json

{
  "name": "My Branding",
  "is_active": false,
  "colors": {...},
  "images": {...},
  ...
}
```

### Actualizar Configuración
```http
PUT /api/branding/config/{config_id}
Content-Type: application/json

{
  "colors": {...},
  "ui_config": {...}
}
```

### Eliminar Configuración
```http
DELETE /api/branding/config/{config_id}
```

### Activar Configuración
```http
POST /api/branding/config/{config_id}/activate
```

### Crear Configuración por Defecto
```http
POST /api/branding/config/seed-default
```

## 💻 Uso en Componentes React

### Usar Contexto de Branding

```jsx
import { useBranding } from '@/contexts/BrandingContext';

function MyComponent() {
  const { branding, loading } = useBranding();

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{
      color: branding.colors.text_main,
      backgroundColor: branding.colors.background
    }}>
      <h1 style={{
        fontFamily: branding.typography.font_heading,
        color: branding.colors.primary
      }}>
        {branding.texts.site_name}
      </h1>
    </div>
  );
}
```

### Usar Variables CSS

```css
/* Las variables se inyectan automáticamente */
.my-component {
  color: var(--color-text-main);
  background: var(--color-background);
  border: 1px solid var(--color-primary);
  font-family: var(--font-body);
}

.heading {
  font-family: var(--font-heading);
  color: var(--color-primary);
}

.button {
  background: var(--gradient-primary);
  border-radius: var(--border-radius);
}
```

## 🎨 Personalización Avanzada

### CSS Personalizado

En la pestaña "Advanced" puedes agregar CSS personalizado:

```css
/* Ejemplo: Personalizar scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 5px;
}
```

### Scripts Personalizados

**Head Scripts** (Analytics, etc.):
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

**Body Scripts** (Chat widgets, etc.):
```html
<!-- Intercom -->
<script>
  window.intercomSettings = {
    app_id: "YOUR_APP_ID"
  };
</script>
```

## 🔄 Flujo de Trabajo

### 1. Desarrollo
```bash
# Backend
cd backend
uvicorn server:app --reload

# Frontend
cd frontend
npm start
```

### 2. Crear Tema
1. Acceder a `/admin/branding`
2. Crear nueva configuración
3. Personalizar colores, tipografías, etc.
4. Guardar

### 3. Previsualizar
1. Seleccionar configuración
2. Click en "Activate"
3. Recargar la página para ver cambios

### 4. Producción
```bash
# Deploy del backend
cd backend
# Deploy a producción

# Deploy del frontend
cd frontend
npm run build
# Deploy a Netlify/Vercel
```

## 🛠️ Troubleshooting

### Los cambios no se aplican
**Solución**: Recargar la página (Ctrl/Cmd + Shift + R) para limpiar caché

### Error "Cannot read properties of undefined"
**Solución**: Verificar que el componente esté envuelto en `BrandingProvider`

### Colores no se actualizan
**Solución**: Verificar que la configuración esté marcada como "is_active: true"

## 📊 Base de Datos

### Colección: `branding_configs`

```javascript
{
  _id: ObjectId,
  name: "Default Branding",
  is_active: true,
  colors: {...},
  images: {...},
  typography: {...},
  texts: {...},
  ui_config: {...},
  gradients: {...},
  social: {...},
  advanced: {...},
  created_at: ISODate,
  updated_at: ISODate,
  created_by: "user_id"
}
```

## 🔐 Seguridad

- Solo administradores pueden acceder a `/admin/branding`
- Las configuraciones se validan con Pydantic
- Los scripts se inyectan de forma segura

## 🎯 Mejoras Futuras

- [ ] Historial de cambios
- [ ] Importar/Exportar temas
- [ ] Marketplace de temas
- [ ] Previsualización en vivo sin guardar
- [ ] Variables custom por organización
- [ ] Soporte para dark/light mode toggle

## 📞 Soporte

Para problemas o preguntas:
1. Verificar los logs del backend
2. Revisar la consola del navegador
3. Consultar la documentación de FastAPI
4. Revisar BrandingContext.js para debugging
