---
tags:
  - vcsa
  - frontend
  - react
---

# Frontend Web

## Stack

- React 19
- CRACO sobre Create React App
- React Router
- Tailwind + utilidades UI
- Radix UI / shadcn-style primitives
- Framer Motion
- Axios

## Entry points

- `frontend/package.json`
- `frontend/src/App.js`

## Estructura visible

- `frontend/src/pages/`: páginas legacy y administrativas
- `frontend/src/v2/pages/`: experiencia V2 con nuevo design system
- `frontend/src/components/ui/`: primitives UI
- `frontend/src/contexts/`: `OrganizationContext`, `BrandingContext`, `RoleContext`

## Providers y auth

En `frontend/src/App.js` aparecen:

- `OrganizationProvider`
- `BrandingProvider`
- `AuthProvider`
- `RoleProvider`

La app usa verificación de sesión contra:

- `GET /api/auth/me`
- `POST /api/auth/logout`

y construye `API` desde:

- `REACT_APP_BACKEND_URL`
- fallback actual: `http://localhost:2345`

## Problema importante de entorno

El backend local reciente del repo está corriendo en `8001`, pero la app principal tiene fallback en `2345`. Eso convierte la variable `REACT_APP_BACKEND_URL` en prácticamente obligatoria cuando se corre el frontend web principal.

## Grupos de rutas

### Legacy / principal

- landing, login, register
- dashboard
- courses
- community
- coaching
- training library
- resources
- membership
- profile

### Performance / reps

- `/path`
- `/goals`
- `/financial`
- `/daily-performance`
- `/analytics`
- `/strategy`

### Org / admin

- `/admin`
- `/manager`
- `/director/dashboard`
- `/onboarding/*`
- `/settings/organization`
- `/admin/branding`

### V2

- `/v2/dashboard`
- `/v2/training`
- `/v2/coaching`
- `/v2/resources`
- `/v2/financial`
- `/v2/analytics`
- `/v2/pre-tour`
- `/v2/debrief`
- `/v2/ai-coach`

## Observaciones relevantes del router

Hay rutas duplicadas o superpuestas en `frontend/src/App.js`:

- `/dashboard` aparece más de una vez
- `/community` aparece más de una vez

Eso sugiere evolución por capas y posibles conflictos entre superficies legacy y nuevas.

## Páginas y superficies

- ~`61` páginas en `frontend/src/pages/`
- `frontend/src/v2/pages/` concentra 9 vistas V2 más estilos base
- existe mezcla de dashboards legacy, subpáginas MVP Lite y V2

## Qué parece más importante dentro del frontend

### Para negocio / operación

- `DashboardPage`
- `TopProducerPath`
- `GoalSheetPage`
- `FinancialPlanningPage`
- `AnalyticsPage`

### Para V2

- `v2/pages/Dashboard.jsx`
- `v2/pages/TrainingLibrary.jsx`
- `v2/pages/CoachingHub.jsx`
- `v2/pages/ResourcesLibrary.jsx`

### Para white-label y orgs

- `OnboardingWizard`
- `CreateSchoolPage`
- `OrganizationSettings`
- `BrandingConfigPage`

## Conclusión operativa

`frontend/` es la app con mayor cobertura funcional, pero también la más heterogénea. Conviven:

- rutas legacy
- módulos MVP Lite
- rutas V2
- administración
- white-label onboarding

Si alguien necesita “la web oficial”, hoy la respuesta es: `frontend/`, pero con varias generaciones de UI dentro.

## Relación con otras notas

- [[03 - Product Surface Areas]]
- [[09 - Deployment & Environment]]
- [[11 - Current State & Risks]]
