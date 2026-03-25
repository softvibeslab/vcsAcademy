# VCSA Demo Personalizada - Generador de Demos Interactivas

Sistema completo para generar demos personalizadas de VCSA basadas en las respuestas de un onboarding.

## 🚀 Quick Start

### Opción 1: Abrir Directamente

Simplemente abre `onboarding.html` en tu navegador:

```bash
# Linux/Mac
open onboarding.html

# Windows
start onboarding.html
```

### Opción 2: Servidor Local (Recomendado)

```bash
# Usando Python
python3 -m http.server 8000

# Usando Node.js
npx serve

# Luego abre http://localhost:8000/onboarding.html
```

### Opción 3: Publicar Online

**Netlify (Gratis):**
1. Ve a https://netlify.com
2. Arrastra toda la carpeta `demo-personalizada/` al dashboard
3. Listo: tendrás una URL como `https://vcsa-demo-generator.netlify.app`

## 📋 Características

### 1. Onboarding de 5 Pasos
- **Paso 1:** Tipo de organización (Vacation Club, Sales Training, Customer Success)
- **Paso 2:** Branding personalizado (nombre, colores, tagline)
- **Paso 3:** Configuración de contenido (tracks personalizados, industry focus)
- **Paso 4:** Features (gamificación, badges, streaks, community, events)
- **Paso 5:** Review y generación

### 2. Generación de Contenido Personalizado
- **36 módulos** organizados en **6 tracks**
- **Módulos específicos** por tipo de organización
- **Contextos pre-tour** personalizados
- **Badges** y **stages** adaptados al industry
- **Quick wins** y **deal breakdowns** relevantes

### 3. Múltiples Opciones de Exportación
- **Preview Demo:** Abre la demo en una nueva pestaña
- **Export Snapshot:** Descarga el JSON del CRM
- **Download ZIP:** Paquete completo con todo

## 📁 Estructura de Archivos

```
demo-personalizada/
├── onboarding.html           # Wizard de configuración (entrada principal)
├── js/
│   ├── module-generator.js   # Generador de módulos personalizados
│   ├── snapshot-builder.js   # Constructor del snapshot del CRM
│   ├── demo-compiler.js      # Compilador de HTML
│   └── zip-exporter.js       # Exportador de ZIP
├── data/
│   ├── organization-types.json  # Config de tipos de organización
│   └── badge-definitions.json   # Definición de badges
├── templates/
│   └── base-template.html    # Template base para compilación
└── output/                   # Demos generadas (creado automáticamente)
```

## 🎯 Tipos de Organización

### Vacation Club (Default)
- **6 Tracks:** Pro Mindset, Discovery & Control, Value Architecture, Decision Management, Objection Mastery, Post-Decision Integrity
- **36 Módulos** enfocados en ventas de timeshare
- **4 Contextos:** Cold Tour, Warm Tour, With Objections, Closing

### Sales Training
- **6 Tracks:** Pipeline Management, Lead Qualification, Presentation Skills, Negotiation Tactics, Closing Techniques, Account Expansion
- **36 Módulos** enfocados en ventas B2B
- **4 Contextos:** Cold Call, Discovery, Demo, Negotiation

### Customer Success
- **6 Tracks:** Onboarding Mastery, Customer Health, Renewal Strategies, Upselling & Cross-selling, Churn Prevention, Advocacy Development
- **36 Módulos** enfocados en éxito del cliente
- **4 Contextos:** Check-in Call, QBR Preparation, Risk Mitigation, Renewal Discussion

## 📊 Estructura del Snapshot JSON

```json
{
  "snapshot_version": "1.0",
  "generated_at": "2026-03-25T12:00:00Z",
  "organization": {
    "id": "uuid",
    "name": "Acme Sales Academy",
    "slug": "acme-academy",
    "type": "vacation_club",
    "branding": { ... }
  },
  "configuration": { ... },
  "content": {
    "tracks": [ ... ],
    "total_tracks": 6,
    "total_modules": 36,
    "contexts": [ ... ],
    "stages": [ ... ],
    "badges": [ ... ]
  },
  "users": { ... },
  "analytics": { ... }
}
```

## 🎨 Personalización

### Colores
El sistema usa variables CSS que se inyectan dinámicamente:

```css
:root {
  --primary: #D4AF37;    /* Color primario (personalizable) */
  --secondary: #1E3A8A;  /* Color secundario (personalizable) */
  --accent: #F59E0B;     /* Color de acento */
}
```

### Branding
Cada demo generada incluye:
- Logo personalizado (opcional)
- Nombre del sitio
- Tagline
- Paleta de colores
- Tipo de organización

### Contenido
Los módulos se generan dinámicamente basados en:
- Tipo de organización
- Industry focus
- Preferencias de tracks personalizados

## 📦 Output del ZIP

Al descargar el ZIP obtienes:

```
acme-academy-demo-2026-03-25.zip
├── demo.html           # Demo interactiva completa
├── snapshot.json       # Configuración del CRM
└── README.md           # Instrucciones de uso
```

## 🔧 Uso Avanzado

### API Programática

```javascript
// Generar módulos
const moduleGen = new ModuleGenerator();
await moduleGen.loadData();
const modules = moduleGen.generateModules('vacation_club', 'Sales Representatives');

// Construir snapshot
const snapshotBuilder = new SnapshotBuilder();
const snapshot = await snapshotBuilder.buildSnapshot(onboardingData, modules);

// Compilar demo
const compiler = new DemoCompiler();
const demoHTML = await compiler.compileDemo(onboardingData, modules, snapshot);

// Exportar ZIP
const exporter = new ZipExporter();
await exporter.downloadZIP(demoHTML, snapshot, 'my-demo.zip');
```

### Personalización de Módulos

Edita `data/organization-types.json` para:

1. **Agregar nuevos tipos de organización**
2. **Modificar tracks existentes**
3. **Ajustar módulos y key moves**
4. **Cambiar contextos pre-tour**

### Personalización de Badges

Edita `data/badge-definitions.json` para:

1. **Crear nuevos badges**
2. **Ajustar requisitos**
3. **Modificar puntos y tiers**

## 🎓 Casos de Uso

### 1. Sales Demo para Prospects
- Configura con branding del prospecto
- Genera demo personalizada
- Comparte ZIP o link online

### 2. Onboarding de Nuevos Clientes
- Captura preferencias durante signup
- Genera configuración inicial
- Importa snapshot al CRM

### 3. Template Reutilizable
- Crea configuración base
- Exporta snapshot
- Comparte con equipo de ventas

### 4. Pruebas A/B
- Genera múltiples versiones
- Testea diferentes configuraciones
- Mide efectividad

## 📈 Métricas del Demo

### Tiempos de Generación
- **Onboarding:** ~3 minutos
- **Generación Preview:** <5 segundos
- **Export Snapshot:** <2 segundos
- **ZIP Package:** <10 segundos

### Tamaños
- **Demo HTML:** ~80-120 KB
- **Snapshot JSON:** ~15-25 KB
- **ZIP Final:** ~50-100 KB

## 🐛 Troubleshooting

### El preview no abre
- Verifica que hayas completado todos los pasos del onboarding
- Revisa la consola del navegador para errores
- Asegúrate de que los archivos JS estén cargados

### El ZIP no se descarga
- Verifica que JSZip se haya cargado correctamente
- Revisa la consola para errores de red
- Intenta en un navegador diferente

### Los colores no se aplican
- Verifica que los colores estén en formato hexadecimal válido
- Limpia la cache del navegador
- Regenera la demo

## 🚀 Roadmap

### v1.1 (Próximo)
- [ ] Más tipos de organización
- [ ] Editor visual de módulos
- [ ] Export a PDF
- [ ] Integración con CRM real

### v2.0 (Futuro)
- [ ] Multi-idioma
- [ ] Temas dark/light
- [ ] Analytics dashboard
- [ ] API REST completa

## 📞 Soporte

- **Documentación:** `PLAN_DEMO_PERSONALIZADA.md`
- **API:** `API_SNAPSHOT.md`
- **Guía de Implementación:** `PLAN_IMPLEMENTACION.md`

## 📄 Licencia

© 2026 Vacation Club Sales Academy

---

**Versión:** 1.0.0
**Fecha:** 2026-03-25
**Generado con:** VCSA Demo Generator
