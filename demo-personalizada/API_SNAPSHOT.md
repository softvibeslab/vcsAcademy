# API del Snapshot del CRM

Documentación completa de la estructura del snapshot JSON generado por el sistema.

## 📋 Estructura General

```json
{
  "snapshot_version": "1.0",
  "generated_at": "ISO 8601 timestamp",
  "organization": { ... },
  "configuration": { ... },
  "content": { ... },
  "users": { ... },
  "analytics": { ... },
  "features": { ... }
}
```

## 🏢 Organization

Información de la organización y su branding.

```json
{
  "organization": {
    "id": "uuid-v4",
    "name": "Acme Sales Academy",
    "slug": "acme-academy",
    "tagline": "Transform Your Sales Team",
    "type": "vacation_club | sales_training | customer_success",
    "industry_focus": "Sales Representatives | Sales Managers | ...",
    "created_at": "2026-03-25T12:00:00Z",
    "branding": {
      "logo_url": "data:image/png;base64,... o URL",
      "primary_color": "#D4AF37",
      "secondary_color": "#1E3A8A",
      "accent_color": "#F59E0B",
      "site_name": "Acme Sales Academy"
    }
  }
}
```

### Campos Requeridos

- `id`: UUID único (autogenerado)
- `name`: Nombre de la organización (mínimo 2 caracteres)
- `slug`: URL-friendly identifier (solo minúsculas, números, guiones)
- `type`: Uno de los tipos soportados

### Campos Opcionales

- `tagline`: Eslogan o descripción corta
- `logo_url`: URL del logo o base64 data URI
- `industry_focus`: Focus específico de la industria

## ⚙️ Configuration

Configuración de features y opciones del sistema.

```json
{
  "configuration": {
    "onboarding": {
      "custom_tracks_enabled": true,
      "industry_focus": "Sales Representatives",
      "organization_type": "vacation_club"
    },
    "gamification": {
      "enabled": true,
      "points_system": true,
      "badges_enabled": true,
      "streaks_enabled": true,
      "leaderboard_enabled": true
    },
    "community": {
      "enabled": false,
      "feed_enabled": false,
      "comments_enabled": false
    },
    "events": {
      "enabled": false,
      "calendar_enabled": false,
      "reminders_enabled": false
    },
    "training": {
      "auto_progress": true,
      "video_completion_required": true,
      "quiz_enabled": false,
      "certificate_enabled": true
    }
  }
}
```

## 📚 Content

Todo el contenido de entrenamiento.

```json
{
  "content": {
    "tracks": [
      {
        "id": "pro-mindset",
        "title": "Pro Mindset",
        "description": "Develop the elite performer mindset",
        "icon": "brain",
        "priority": "high | medium | low",
        "modules": [
          {
            "id": "vc-m1",
            "title": "Elite Performance Psychology",
            "keyMove": "Adopt the 1% rule",
            "duration": "8 min",
            "video_url": "o vacío"
          }
        ]
      }
    ],
    "total_tracks": 6,
    "total_modules": 36,
    "contexts": [
      {
        "id": "cold_tour",
        "title": "Cold Tour",
        "description": "First-time visitors",
        "tactics_count": 8
      }
    ],
    "stages": [
      {
        "id": 1,
        "name": "New Rep",
        "description": "Build your foundation",
        "pointsRequired": 150,
        "estimatedWeeks": "1-2",
        "color": "#94A3B8"
      }
    ],
    "badges": [
      {
        "id": "first_win",
        "name": "First Win",
        "description": "Complete your first module",
        "icon": "trophy",
        "requirement": "complete_1_module",
        "points": 10,
        "tier": "bronze | silver | gold | platinum"
      }
    ],
    "milestones": [ ... ],
    "quick_wins": [ ... ],
    "deal_breakdowns": [ ... ]
  }
}
```

## 👥 Users

Información de usuarios y permisos.

```json
{
  "users": {
    "demo_users": [
      {
        "id": "uuid",
        "email": "demo@acme.com",
        "name": "Demo User",
        "role": "admin | member",
        "status": "active | pending | inactive",
        "stage": "Stage 2: Developing Rep",
        "readiness_score": 68,
        "points": 245,
        "streak_days": 7,
        "completed_modules": 12,
        "total_modules": 36,
        "badges": [
          { "id": "first_win", "earned_at": "2026-03-20T12:00:00Z" }
        ],
        "progress": {
          "stage_1": true,
          "stage_2": true,
          "stage_3": false,
          "stage_4": false
        },
        "joined_at": "2026-03-11T12:00:00Z",
        "last_active": "2026-03-25T12:00:00Z"
      }
    ],
    "pending_invitations": [
      {
        "email": "user@example.com",
        "status": "pending",
        "role": "member",
        "invited_at": "2026-03-25T12:00:00Z"
      }
    ],
    "total_users": 2,
    "roles": {
      "admin": {
        "permissions": ["all"]
      },
      "member": {
        "permissions": ["view_content", "complete_training", "earn_badges"]
      }
    }
  }
}
```

## 📊 Analytics

KPIs y configuración de analytics.

```json
{
  "analytics": {
    "kpis": {
      "onboarding_time_target": "4 weeks",
      "first_sale_target": "4 weeks",
      "expected_roi": "10x",
      "readiness_score_target": 75
    },
    "tracking": {
      "readiness_score_enabled": true,
      "completion_rate_enabled": true,
      "streak_tracking_enabled": true,
      "time_to_value_enabled": true
    },
    "reports": {
      "weekly_progress": true,
      "monthly_summary": true,
      "badge_achievements": true,
      "team_leaderboard": true
    }
  }
}
```

## ✨ Features

Lista de features habilitadas/deshabilitadas.

```json
{
  "features": {
    "enabled_features": [
      "readiness_score",
      "training_tracks",
      "video_modules",
      "points",
      "badges",
      "leaderboard",
      "streaks"
    ],
    "disabled_features": [
      "community_feed",
      "comments",
      "events_calendar"
    ],
    "beta_features": [],
    "coming_soon": [
      "ai_sales_coach",
      "mobile_app_v2",
      "advanced_analytics"
    ]
  }
}
```

## 🔧 Uso del Snapshot

### Importar a CRM

```javascript
// Leer snapshot
const snapshot = JSON.parse(snapshotJSON);

// Validar
const validation = validateSnapshot(snapshot);
if (!validation.valid) {
  console.error('Invalid snapshot:', validation.errors);
  return;
}

// Importar organización
const org = await createOrganization(snapshot.organization);

// Importar configuración
await updateConfiguration(org.id, snapshot.configuration);

// Importar contenido
await importContent(org.id, snapshot.content);

// Importar usuarios
await inviteUsers(org.id, snapshot.users.pending_invitations);
```

### Validación

```javascript
function validateSnapshot(snapshot) {
  const errors = [];

  // Validar organización
  if (!snapshot.organization?.name) {
    errors.push('Organization name is required');
  }
  if (!snapshot.organization?.slug) {
    errors.push('Organization slug is required');
  }

  // Validar slug format
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(snapshot.organization.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  // Validar contenido
  if (!snapshot.content?.tracks?.length) {
    errors.push('At least one track is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Actualización de Snapshot

```javascript
// Actualizar configuración
function updateSnapshotConfig(snapshot, configUpdates) {
  return {
    ...snapshot,
    configuration: {
      ...snapshot.configuration,
      ...configUpdates
    },
    generated_at: new Date().toISOString()
  };
}

// Agregar nuevo track
function addTrack(snapshot, newTrack) {
  return {
    ...snapshot,
    content: {
      ...snapshot.content,
      tracks: [...snapshot.content.tracks, newTrack],
      total_tracks: snapshot.content.total_tracks + 1
    }
  };
}
```

## 📝 Ejemplos de Uso

### Crear Organización Nueva

```bash
curl -X POST https://api.vcsa.com/organizations \
  -H "Content-Type: application/json" \
  -d @snapshot.json
```

### Exportar Configuración

```javascript
// Desde CRM existente
const snapshot = await exportOrganizationSnapshot(orgId);
downloadJSON(snapshot, 'org-snapshot.json');
```

### Comparar Snapshots

```javascript
function compareSnapshots(snapshot1, snapshot2) {
  return {
    organization: snapshot1.organization.name !== snapshot2.organization.name,
    features: JSON.stringify(snapshot1.features) !== JSON.stringify(snapshot2.features),
    modules: snapshot1.content.total_modules !== snapshot2.content.total_modules
  };
}
```

## 🔐 Seguridad

### Datos Sensibles
- **Nunca** incluir passwords en el snapshot
- **Nunca** incluir API keys o tokens
- **Nunca** incluir datos personales de usuarios reales

### Validación de Input
- Sanitizar todos los strings
- Validar formatos de email
- Validar URLs y URIs
- Escapar caracteres especiales

## 📄 Versionado

### v1.0 (Actual)
- Estructura base
- 3 tipos de organización
- 36 módulos por tipo
- Features configurables

### v1.1 (Roadmap)
- Campos adicionales para analytics
- Soporte para multi-idioma
- Custom fields metadata

## 🐛 Errores Comunes

### Snapshot Inválido

```json
{
  "error": "invalid_snapshot",
  "message": "Organization name is required",
  "field": "organization.name"
}
```

### Slug Inválido

```json
{
  "error": "invalid_slug",
  "message": "Slug must contain only lowercase letters, numbers, and hyphens",
  "field": "organization.slug"
}
```

### Tipo No Soportado

```json
{
  "error": "unsupported_type",
  "message": "Organization type 'xyz' is not supported",
  "supported_types": ["vacation_club", "sales_training", "customer_success"]
}
```

---

**Última actualización:** 2026-03-25
**Versión del snapshot:** 1.0
