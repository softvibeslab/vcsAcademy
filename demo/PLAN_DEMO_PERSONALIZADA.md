# 🎯 Plan Demo Personalizada con Onboarding + CRM Snapshot

## 📋 Resumen Ejecutivo

Crear una demo funcional que:
1. **Captura respuestas del onboarding** (tipo organización, branding, contenido, settings, equipo)
2. **Genera módulos personalizados** basados en las respuestas
3. **Crea snapshot del CRM** con configuración completa
4. **Exporta ZIP** con todo listo para compartir

---

## 🏗️ Arquitectura

### 1. Flujo de Datos

```
Onboarding → Respuestas Usuario → Configuración Demo → Snapshot JSON → Export ZIP
```

### 2. Componentes

#### A. Onboarding Data Collector
- Capturar: `organizationType`, `branding`, `content`, `settings`, `team`
- Guardar en `localStorage` para persistencia
- Generar `config.json`

#### B. Module Generator
- Basado en `organizationType` + `industryFocus`
- Generar tracks personalizados
- Crear badges específicos
- Configurar milestones

#### C. CRM Snapshot
- Configuración completa de la organización
- Usuarios demo pre-configurados
- Contenido personalizado
- Métricas y KPIs sugeridos

#### D. Demo Builder
- Compilar HTML con branding personalizado
- Incluir módulos específicos
- Configurar features activas/desactivadas

---

## 📁 Estructura de Archivos

```
demo-personalizada/
├── onboarding.html           # Wizard de configuración
├── demo-generator.html       # Preview + generar demo
├── snapshot-export.html       # Exportar snapshot del CRM
├── js/
│   ├── onboarding.js         # Lógica del wizard
│   ├── module-generator.js   # Generador de módulos
│   ├── snapshot-builder.js   # Constructor del snapshot
│   └── demo-compiler.js      # Compilador de HTML
├── templates/
│   ├── base-template.html    # Template base
│   ├── themes/               # Temas por industry
│   └── modules/              # Plantillas de módulos
├── data/
│   ├── organization-types.json # Config por tipo
│   ├── module-library.json     # Biblioteca de módulos
│   └── badge-definitions.json  # Badges disponibles
└── output/
    ├── demo-preview.html     # Preview de la demo
    ├── crm-snapshot.json     # Snapshot completo
    └── demo-package.zip      # Demo final
```

---

## 🎨 Módulos por Tipo de Organización

### Vacation Club (Default VCSA)
```
Tracks:
1. Pro Mindset (6 módulos)
2. Discovery & Control (6 módulos)
3. Value Architecture (6 módulos)
4. Decision Management (6 módulos)
5. Objection Mastery (6 módulos)
6. Post-Decision Integrity (6 módulos)

Contextos Pre-Tour:
- Cold Tour
- Warm Tour
- Con Objeciones
- Cierre
```

### Sales Training
```
Tracks:
1. Pipeline Management (6 módulos)
2. Lead Qualification (6 módulos)
3. Presentation Skills (6 módulos)
4. Negotiation Tactics (6 módulos)
5. Closing Techniques (6 módulos)
6. Account Expansion (6 módulos)

Contextos Pre-Call:
- Cold Call
- Discovery Call
- Demo Meeting
- Negotiation
```

### Customer Success
```
Tracks:
1. Onboarding Mastery (6 módulos)
2. Customer Health (6 módulos)
3. Renewal Strategies (6 módulos)
4. Upselling & Cross-selling (6 módulos)
5. Churn Prevention (6 módulos)
6. Advocacy Development (6 módulos)

Contextos Pre-Meeting:
- Check-in Call
- QBR Preparation
- Risk Mitigation
- Renewal Discussion
```

---

## 📊 CRM Snapshot Structure

```json
{
  "snapshot_version": "1.0",
  "generated_at": "2026-03-25T12:00:00Z",
  "organization": {
    "id": "org_uuid",
    "name": "Acme Sales Academy",
    "slug": "acme-academy",
    "tagline": "Transform Your Sales Team",
    "type": "vacation_club",
    "branding": {
      "logo_url": "data:image/png;base64,...",
      "primary_color": "#D4AF37",
      "secondary_color": "#1E3A8A"
    }
  },
  "configuration": {
    "features": {
      "gamification": true,
      "badges": true,
      "streaks": true,
      "community": true,
      "events": true
    },
    "content": {
      "custom_tracks_enabled": true,
      "industry_focus": "Sales Representatives",
      "modules_count": 36
    }
  },
  "content": {
    "tracks": [...],
    "modules": [...],
    "badges": [...],
    "milestones": [...]
  },
  "users": {
    "demo_users": [
      {
        "email": "demo@acme.com",
        "role": "admin",
        "stage": "Stage 2",
        "readiness_score": 68,
        "points": 245,
        "badges": ["first_win", "week_streak"]
      }
    ]
  },
  "analytics": {
    "kpis": {
      "target_onboarding_time": "4 weeks",
      "target_first_sale": "4 weeks",
      "expected_roi": "10x"
    }
  }
}
```

---

## 🚀 Plan de Implementación

### Fase 1: Onboarding Enhanced ✅ (EXISTE)
- [x] WelcomeStep - Selección tipo organización
- [x] BrandingStep - Logo, colores, nombre
- [x] ContentStep - Configuración contenido
- [x] SettingsStep - Features toggles
- [x] TeamStep - Invitaciones
- [x] CompleteStep - Resumen

### Fase 2: Module Generator (NUEVO)
- [ ] Crear `module-generator.js`
  - Función: `generateModules(organizationType, industryFocus)`
  - Retornar: tracks personalizados basados en tipo
- [ ] Biblioteca de módulos por industry
  - `data/organization-types.json`
  - `data/module-library.json`

### Fase 3: CRM Snapshot Builder (NUEVO)
- [ ] Crear `snapshot-builder.js`
  - Función: `buildSnapshot(onboardingData)`
  - Retornar: JSON completo con configuración
- [ ] Export functionality
  - Download JSON
  - Copy to clipboard
  - Preview snapshot

### Fase 4: Demo Compiler (NUEVO)
- [ ] Crear `demo-compiler.js`
  - Función: `compileDemo(onboardingData, modules)`
  - Retornar: HTML personalizado
- [ ] Template system
  - Base template con branding variables
  - Dynamic content injection
  - Custom CSS based on colors

### Fase 5: ZIP Exporter (NUEVO)
- [ ] Crear `zip-exporter.js` (usando JSZip)
  - Empaquetar: demo HTML + assets + snapshot JSON
  - Download automático
  - Naming: `{slug}-demo-{timestamp}.zip`

### Fase 6: UI Integration (NUEVO)
- [ ] Modificar `CompleteStep.jsx`
  - Agregar botón: "Generate Demo Preview"
  - Agregar botón: "Export CRM Snapshot"
  - Agregar botón: "Download Complete Package (ZIP)"

---

## 🔧 Technical Implementation

### A. Module Generator Logic

```javascript
// js/module-generator.js
const MODULE_LIBRARY = {
  vacation_club: {
    tracks: [
      {
        id: "pro-mindset",
        title: "Pro Mindset",
        modules: [
          { id: "m1", title: "Elite Performance Psychology", keyMove: "Adopt the 1% rule" },
          // ... 5 más
        ]
      },
      // ... 5 tracks más
    ],
    contexts: ["cold_tour", "warm_tour", "objections", "closing"]
  },
  sales_training: {
    tracks: [
      {
        id: "pipeline-mgmt",
        title: "Pipeline Management",
        modules: [
          { id: "sm1", title: "Pipeline Stages Mastery", keyMove: "Define clear stage gates" },
          // ... 5 más
        ]
      },
      // ... 5 tracks más
    ],
    contexts: ["cold_call", "discovery", "demo", "negotiation"]
  },
  customer_success: {
    tracks: [
      {
        id: "onboarding-mastery",
        title: "Onboarding Mastery",
        modules: [
          { id: "cs1", title: "First 90 Days Blueprint", keyMove: "Create success plan in week 1" },
          // ... 5 más
        ]
      },
      // ... 5 tracks más
    ],
    contexts: ["checkin", "qbr", "risk", "renewal"]
  }
};

function generateModules(organizationType, industryFocus) {
  const base = MODULE_LIBRARY[organizationType] || MODULE_LIBRARY.vacation_club;
  // Personalizar basado en industryFocus
  return adaptModules(base, industryFocus);
}
```

### B. Snapshot Builder Logic

```javascript
// js/snapshot-builder.js
function buildSnapshot(onboardingData) {
  return {
    snapshot_version: "1.0",
    generated_at: new Date().toISOString(),
    organization: {
      id: generateUUID(),
      name: onboardingData.siteName,
      slug: onboardingData.slug,
      type: onboardingData.organizationType,
      branding: {
        logo_url: onboardingData.logoUrl,
        primary_color: onboardingData.primaryColor,
        secondary_color: onboardingData.secondaryColor
      }
    },
    configuration: {
      features: {
        gamification: onboardingData.enableGamification,
        badges: onboardingData.enableBadges,
        streaks: onboardingData.enableStreaks,
        community: onboardingData.enableCommunity,
        events: onboardingData.enableEvents
      },
      content: {
        custom_tracks_enabled: onboardingData.customTracksEnabled,
        industry_focus: onboardingData.industryFocus
      }
    },
    content: {
      tracks: generateModules(onboardingData.organizationType, onboardingData.industryFocus),
      badges: generateBadges(onboardingData),
      milestones: generateMilestones(onboardingData)
    },
    users: {
      demo_users: generateDemoUsers(onboardingData)
    },
    analytics: {
      kpis: generateKPIs(onboardingData)
    }
  };
}
```

### C. Demo Compiler Logic

```javascript
// js/demo-compiler.js
async function compileDemo(onboardingData, modules) {
  // Cargar template base
  const template = await fetch('templates/base-template.html').then(r => r.text());

  // Reemplazar variables
  const demoHTML = template
    .replace(/\{\{siteName\}\}/g, onboardingData.siteName)
    .replace(/\{\{primaryColor\}\}/g, onboardingData.primaryColor)
    .replace(/\{\{secondaryColor\}\}/g, onboardingData.secondaryColor)
    .replace(/\{\{logoUrl\}\}/g, onboardingData.logoUrl || '')
    .replace(/\{\{modules\}\}/g, JSON.stringify(modules))
    .replace(/\{\{features\}\}/g, JSON.stringify({
      gamification: onboardingData.enableGamification,
      badges: onboardingData.enableBadges,
      // ...
    }));

  return demoHTML;
}
```

### D. ZIP Exporter Logic

```javascript
// js/zip-exporter.js (usando JSZip CDN)
async function exportPackage(demoHTML, snapshotJSON, filename) {
  const zip = new JSZip();

  // Agregar archivos
  zip.file("demo.html", demoHTML);
  zip.file("snapshot.json", JSON.stringify(snapshotJSON, null, 2));
  zip.file("README.md", generateReadme(snapshotJSON));

  // Generar ZIP
  const blob = await zip.generateAsync({type: "blob"});

  // Download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
```

---

## 📝 Deliverables

### 1. Onboarding con Generación de Demo
- **File**: `demo/onboarding.html`
- **Features**: Wizard completo + botones para generar preview/snapshot/zip

### 2. Module Generator
- **File**: `demo/js/module-generator.js`
- **Library**: `demo/data/module-library.json` (3 types × 6 tracks × 36 modules)

### 3. CRM Snapshot Builder
- **File**: `demo/js/snapshot-builder.js`
- **Output**: JSON completo con configuración

### 4. Demo Compiler
- **File**: `demo/js/demo-compiler.js`
- **Template**: `demo/templates/base-template.html`
- **Output**: HTML personalizado

### 5. ZIP Exporter
- **File**: `demo/js/zip-exporter.js`
- **Output**: `{slug}-demo-{timestamp}.zip`

### 6. Documentation
- **File**: `demo/GUIA_ONBOARDING.md` - Guía del usuario
- **File**: `demo/API_SNAPSHOT.md` - API del snapshot
- **File**: `demo/PLAN_IMPLEMENTACION.md` - Guía técnica

---

## 🎯 Success Metrics

### Funcionalidad
- ✅ Onboarding completo (5 steps)
- ✅ Generación de módulos personalizados
- ✅ Snapshot del CRM exportable
- ✅ Demo HTML personalizable
- ✅ ZIP con todo empaquetado

### Usabilidad
- ✅ Tiempo de onboarding: <5 min
- ✅ Tiempo de generación demo: <30 seg
- ✅ Tiempo de export ZIP: <10 seg
- ✅ Tamaño ZIP: <100 KB

### Calidad
- ✅ Módulos relevantes por industry (3 types)
- ✅ Branding 100% personalizable
- ✅ Snapshot válido para importación
- ✅ Demo funcional sin dependencias

---

## 📅 Timeline Estimado

| Tarea | Duración | Prioridad |
|-------|----------|-----------|
| Module Generator | 2h | Alta |
| Snapshot Builder | 1.5h | Alta |
| Demo Compiler | 2h | Alta |
| ZIP Exporter | 1h | Media |
| UI Integration | 1.5h | Alta |
| Testing | 1h | Alta |
| Documentation | 1h | Media |
| **Total** | **10h** | |

---

## 🚀 Quick Start (para implementar)

```bash
# 1. Crear estructura de archivos
mkdir -p demo/{js,data,templates,output}

# 2. Copiar onboarding existente al nuevo formato
cp frontend/src/components/onboarding/* demo/js/

# 3. Crear biblioteca de módulos
# TODO: Crear module-library.json con 3 organization types

# 4. Implementar generators
# TODO: module-generator.js, snapshot-builder.js, demo-compiler.js, zip-exporter.js

# 5. Crear HTML integrador
# TODO: onboarding.html con todos los JS integrados

# 6. Testing
# TODO: Probar flujo completo end-to-end

# 7. ZIP final
# TODO: Empaquetar todo en demo-personalizada.zip
```

---

## 📞 Next Steps

¿Confirmas que procedo con la implementación de este plan?

1. **Sí** - Creo todos los archivos y funcionalidades
2. **Modificar** - Ajustar algo del plan
3. **Priorizar** - Empezar por X parte específica

---

**© 2026 Vacation Club Sales Academy**
**Plan Demo Personalizada v1.0** | **Fecha: 2026-03-25**
