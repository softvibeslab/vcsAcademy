# Guía de Implementación Técnica

Guía completa para implementar y extender el generador de demos personalizadas.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     onboarding.html                          │
│                   (Wizard Interfaz)                          │
└────────────┬────────────────────────────────────────────────┘
             │
             ├───► Module Generator
             │     └── Genera tracks/módulos personalizados
             │
             ├───► Snapshot Builder
             │     └── Construye JSON de configuración
             │
             ├───► Demo Compiler
             │     └── Compila HTML personalizado
             │
             └───► ZIP Exporter
                   └── Empaqueta todo
```

## 📦 Componentes

### 1. Module Generator (`js/module-generator.js`)

**Responsabilidad:** Generar contenido personalizado basado en el tipo de organización.

**Métodos Principales:**

```javascript
class ModuleGenerator {
  async loadData()                    // Carga data files
  generateModules(orgType, focus)     // Genera tracks
  generateBadges(orgType)             // Genera badges
  generateStages(orgType)             // Genera stages
  generateMilestones(stages, total)   // Genera milestones
  getOrganizationTheme(orgType)       // Retorna colores
}
```

**Flujo de Datos:**

```
organizationTypes.json → ModuleGenerator → Module Data
                                                    ↓
badge-definitions.json  → ModuleGenerator → Badge Data
```

**Extensión:**

Para agregar un nuevo tipo de organización:

1. Agregar entrada en `data/organization-types.json`:

```json
{
  "real_estate": {
    "id": "real_estate",
    "name": "Real Estate",
    "description": "Real estate sales training",
    "icon": "home",
    "default_theme": {
      "primary": "#059669",
      "secondary": "#0D9488",
      "accent": "34D399"
    },
    "tracks": [
      // 6 tracks con 36 módulos
    ],
    "contexts": [
      // 4 contextos
    ]
  }
}
```

2. Actualizar `WelcomeStep.jsx` en el frontend para incluir la nueva opción.

### 2. Snapshot Builder (`js/snapshot-builder.js`)

**Responsabilidad:** Construir el JSON completo de configuración del CRM.

**Métodos Principales:**

```javascript
class SnapshotBuilder {
  async buildSnapshot(onboardingData, moduleData)
  buildOrganization(onboardingData)
  buildConfiguration(onboardingData)
  buildContent(onboardingData, moduleData)
  buildUsers(onboardingData)
  buildAnalytics(onboardingData)
  buildFeatures(onboardingData)
  validateSnapshot(snapshot)
  exportSnapshot(snapshot)
  importSnapshot(jsonString)
}
```

**Estructura del Snapshot:**

```
Snapshot
├── organization (info + branding)
├── configuration (features + settings)
├── content (tracks, módulos, badges)
├── users (demo user + invitations)
├── analytics (KPIs + tracking)
└── features (enabled/disabled)
```

**Validación:**

```javascript
const validation = snapshotBuilder.validateSnapshot(snapshot);
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

### 3. Demo Compiler (`js/demo-compiler.js`)

**Responsabilidad:** Compilar HTML personalizado usando template system.

**Métodos Principales:**

```javascript
class DemoCompiler {
  async loadTemplate()
  async compileDemo(onboardingData, moduleData, snapshot)
  buildFeaturesConfig(onboardingData)
  injectCustomCSS(html, onboardingData)
  generateFilename(slug)
  previewDemo(html)
  downloadDemo(html, filename)
  validateDemo(html)
  compileSummary(html, onboardingData, moduleData)
}
```

**Sistema de Templates:**

El template usa variables con sintaxis `{{variable}}`:

```html
<title>{{siteName}}</title>
<style>
  :root {
    --primary: {{primaryColor}};
    --secondary: {{secondaryColor}};
  }
</style>
```

**Reemplazos:**

```javascript
const replacements = {
  'siteName': onboardingData.siteName,
  'primaryColor': onboardingData.primaryColor,
  'tracksJSON': JSON.stringify(moduleData.tracks),
  // ... más variables
};
```

### 4. ZIP Exporter (`js/zip-exporter.js`)

**Responsabilidad:** Empaquetar demo + snapshot en ZIP descargable.

**Métodos Principales:**

```javascript
class ZipExporter {
  async loadJSZip()
  async exportPackage(demoHTML, snapshot, filename)
  async downloadZIP(demoHTML, snapshot, filename)
  generateREADME(snapshot)
  exportSnapshotOnly(snapshot, filename)
  validatePackage(demoHTML, snapshot)
}
```

**Dependencia:**

Usa JSZip desde CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
```

## 🔌 Integración con Frontend

### Paso 1: Importar Scripts

```html
<script src="js/module-generator.js"></script>
<script src="js/snapshot-builder.js"></script>
<script src="js/demo-compiler.js"></script>
<script src="js/zip-exporter.js"></script>
```

### Paso 2: Inicializar

```javascript
let moduleGenerator, snapshotBuilder, demoCompiler, zipExporter;

document.addEventListener('DOMContentLoaded', async function() {
  moduleGenerator = new ModuleGenerator();
  await moduleGenerator.loadData();

  snapshotBuilder = new SnapshotBuilder();
  demoCompiler = new DemoCompiler();
  zipExporter = new ZipExporter();
});
```

### Paso 3: Generar Demo

```javascript
async function generateDemo() {
  // 1. Generar módulos
  const moduleData = moduleGenerator.generateModules(
    onboardingData.organizationType,
    onboardingData.industryFocus,
    { customTracksEnabled: onboardingData.customTracksEnabled }
  );

  // 2. Agregar metadata
  moduleData.stages = moduleGenerator.generateStages(onboardingData.organizationType);
  moduleData.badges = moduleGenerator.generateBadges(onboardingData.organizationType);
  moduleData.milestones = moduleGenerator.generateMilestones(
    moduleData.stages,
    moduleData.totalModules
  );

  // 3. Construir snapshot
  const snapshot = await snapshotBuilder.buildSnapshot(onboardingData, moduleData);

  // 4. Compilar demo
  const demoHTML = await demoCompiler.compileDemo(onboardingData, moduleData, snapshot);

  // 5. Exportar
  await zipExporter.downloadZIP(demoHTML, snapshot, filename);
}
```

## 🎨 Personalización Visual

### Modificar Colores por Default

En `data/organization-types.json`:

```json
{
  "vacation_club": {
    "default_theme": {
      "primary": "#D4AF37",    // Oro
      "secondary": "#1E3A8A",  // Navy
      "accent": "#F59E0B"      // Naranja
    }
  }
}
```

### Agregar Nueva Fuente

En `templates/base-template.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Your Font', sans-serif;
}
```

### Modificar Estilos

Los estilos se inyectan dinámicamente en `demo-compiler.js`:

```javascript
injectCustomCSS(html, onboardingData) {
  const customCSS = `
    <style id="custom-branding">
      :root {
        --primary: ${onboardingData.primaryColor};
        --secondary: ${onboardingData.secondaryColor};
      }
    </style>
  `;
  return html.replace('</head>', `${customCSS}</head>`);
}
```

## 📊 Gestión de Datos

### Agregar Nuevos Módulos

En `data/organization-types.json`:

```json
{
  "modules": [
    {
      "id": "vc-m37",
      "title": "New Module",
      "keyMove": "New key move here",
      "duration": "8 min",
      "video_url": "https://youtube.com/embed/xxx"
    }
  ]
}
```

### Agregar Nuevos Badges

En `data/badge-definitions.json`:

```json
{
  "badges": [
    {
      "id": "new_badge",
      "name": "New Badge",
      "description": "Complete X achievement",
      "icon": "star",
      "requirement": "complete_x",
      "points": 50,
      "tier": "gold"
    }
  ]
}
```

### Modificar Stages

En `module-generator.js`:

```javascript
generateStages(organizationType) {
  const baseStages = {
    vacation_club: [
      {
        id: 1,
        name: 'New Rep',
        description: 'Build your foundation',
        pointsRequired: 150,
        estimatedWeeks: '1-2',
        color: '#94A3B8'
      },
      // ... más stages
    ]
  };

  return baseStages[organizationType] || baseStages.vacation_club;
}
```

## 🔐 Seguridad

### Sanitización de Input

```javascript
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

### Validación de Slug

```javascript
function validateSlug(slug) {
  // Solo minúsculas, números, guiones
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slugRegex.test(slug)) {
    throw new Error('Invalid slug format');
  }

  // No debe empezar/terminar con guión
  if (slug.startsWith('-') || slug.endsWith('-')) {
    throw new Error('Slug cannot start or end with hyphen');
  }

  return true;
}
```

### Validación de Colores

```javascript
function validateColor(color) {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (!hexRegex.test(color)) {
    throw new Error('Invalid color format');
  }

  return true;
}
```

## 🧪 Testing

### Unit Tests (Concepto)

```javascript
// Test Module Generator
async function testModuleGeneration() {
  const gen = new ModuleGenerator();
  await gen.loadData();

  const modules = gen.generateModules('vacation_club', 'Sales Representatives');

  assert(modules.tracks.length === 6);
  assert(modules.totalModules === 36);
  assert(modules.contexts.length === 4);
}

// Test Snapshot Builder
async function testSnapshotBuilding() {
  const builder = new SnapshotBuilder();
  const snapshot = await builder.buildSnapshot(mockData, mockModules);

  assert(snapshot.organization.name === 'Test Academy');
  assert(snapshot.content.total_tracks === 6);
}

// Test Demo Compiler
async function testDemoCompilation() {
  const compiler = new DemoCompiler();
  const html = await compiler.compileDemo(mockData, mockModules, mockSnapshot);

  assert(html.includes('Test Academy'));
  assert(html.includes('#D4AF37'));
}
```

### Integration Testing

1. **Onboarding completo**
   - Completar los 5 pasos
   - Verificar que se generen todos los datos
   - Validar snapshot final

2. **Generación de ZIP**
   - Descargar ZIP
   - Verificar contenido
   - Abrir demo.html

3. **Cross-browser**
   - Chrome/Edge
   - Firefox
   - Safari

## 🚀 Deployment

### Opción 1: Static Hosting (Netlify/Vercel)

```bash
# 1. Build (si es necesario)
npm run build

# 2. Deploy a Netlify
netlify deploy --prod --dir=demo-personalizada

# 3. Deploy a Vercel
vercel --prod
```

### Opción 2: Servidor Propio

```nginx
# nginx.conf
server {
    listen 80;
    server_name demo.vcsa.com;
    root /var/www/demo-personalizada;
    index onboarding.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Opción 3: CDN

```bash
# Subir a AWS S3 + CloudFront
aws s3 sync demo-personalizada/ s3://demo-vcsa/
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## 📈 Monitoring

### Analytics (Concepto)

```javascript
// Track onboarding completion
function trackOnboardingComplete(snapshot) {
  analytics.track('onboarding_complete', {
    organizationType: snapshot.organization.type,
    industryFocus: snapshot.organization.industry_focus,
    customTracks: snapshot.configuration.onboarding.custom_tracks_enabled,
    featuresEnabled: snapshot.features.enabled_features.length
  });
}

// Track demo generation
function trackDemoGeneration(summary) {
  analytics.track('demo_generated', {
    size: summary.size.bytes,
    modules: summary.content.totalModules,
    tracks: summary.content.tracks
  });
}
```

## 🐛 Debugging

### Habilitar Debug Mode

```javascript
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}

// Uso
debugLog('Generating modules for:', orgType);
debugLog('Generated:', modules);
```

### Common Issues

**Issue:** JSZip no carga
```javascript
// Solución: Cargar manualmente
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
script.onload = () => console.log('JSZip loaded');
document.head.appendChild(script);
```

**Issue:** Template no reemplaza variables
```javascript
// Verificar que el template tenga las variables correctas
console.log(template.includes('{{siteName}}')); // debe ser true
```

**Issue:** Colores no se aplican
```javascript
// Verificar formato hexadecimal
const isValidHex = /^#[0-9A-F]{6}$/i.test(color);
console.log('Color valid:', isValidHex);
```

## 📚 Recursos Adicionales

- **MDN Web Docs:** https://developer.mozilla.org
- **JSZip Documentation:** https://stuk.github.io/jszip/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Font Awesome:** https://fontawesome.com/docs

---

**Versión:** 1.0
**Última actualización:** 2026-03-25
