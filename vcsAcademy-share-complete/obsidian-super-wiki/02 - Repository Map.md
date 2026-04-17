---
tags:
  - vcsa
  - repo
  - architecture
---

# Repository Map

## Top-level map

| Ruta | Rol actual |
|---|---|
| `backend/` | API FastAPI, auth, datos, módulos de negocio, móvil, AI |
| `frontend/` | App web principal React + CRACO |
| `apps/mobile/` | App móvil nueva Expo + TypeScript + Redux |
| `alternate-project/` | App academy separada, mobile-first para reps y admin CRUD |
| `vcsa-mobile/` | App Expo legacy de preview |
| `vcsa-insight/` | App React adicional, probablemente enfocada en insight/analytics |
| `docs/` | Reportes de proyecto, planes MVP y un wiki adicional |
| `wiki/` | Wiki técnico/documental anterior |
| `netlify-deploy/` | Sitio estático listo para deploy |
| `DESIGN_V2_REPORT/` | Reportes de diseño/implementación V2 |
| `memory/` | PRD y memoria de producto |
| `tests/` | Tests sueltos a nivel raíz |

## Entry points clave

### Backend

- `backend/server.py`
- Routers adicionales en `backend/*_routes.py`

### Frontend principal

- `frontend/src/App.js`
- `frontend/package.json`

### Móvil nuevo

- `apps/mobile/App.tsx`
- `apps/mobile/src/navigation/AppNavigator.tsx`
- `apps/mobile/package.json`

### App academy alterna

- `alternate-project/src/App.jsx`
- `alternate-project/src/context/AppContext.jsx`
- `alternate-project/package.json`

## Archivos raíz importantes

### Infraestructura y deploy

- `docker-compose.yml`
- `docker-compose.local.yml`
- `docker-compose.preview.yml`
- `docker-compose.production.yml`
- `docker-compose.vps.yml`
- `render.yaml`
- `netlify.toml`
- `deploy*.sh`

### Documentación importante

- `PLAN_DESARROLLO.md`
- `ANALISIS_COMPLETO_SISTEMA.md`
- `REPOSITORY_ANALYSIS.md`
- `SYSTEM_FLOW.md`
- `VCSA_PROJECT_ANALYSIS.md`
- `WHITE_LABEL_PLATFORM_IMPLEMENTATION.md`

### Artefactos estáticos / demos

- `SISTEMA_COMPLETO.html`
- `reset-onboarding.html`
- `verificar_modulos.html`

## Tamaño práctico del repo

- `backend/`: ~`70` archivos útiles
- `frontend/src/`: ~`198` archivos
- `frontend/src/pages/`: ~`61` páginas
- `apps/mobile/src/`: ~`20` archivos fuente
- `alternate-project/src/`: ~`12` archivos fuente

## Cómo leer este repositorio

### Si vas a tocar backend

Empieza por [[04 - Backend & API]] y luego [[08 - Data, Auth & Roles]]

### Si vas a tocar web

Empieza por [[05 - Frontend Web]]

### Si vas a tocar móvil

Empieza por [[06 - Mobile Apps]]

### Si vas a tocar la app academy alterna

Empieza por [[07 - Alternate Academy App]]

### Si vas a tomar decisiones técnicas

Lee [[11 - Current State & Risks]] antes de mover piezas grandes
