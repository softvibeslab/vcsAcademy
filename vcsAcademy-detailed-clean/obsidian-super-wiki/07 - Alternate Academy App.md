---
tags:
  - vcsa
  - alternate-project
  - academy
---

# Alternate Academy App

## Qué es

`alternate-project/` es una app React/Vite separada del frontend principal. Está enfocada a un slice claro del producto:

- `Strategy`
- `Top Producer Path`
- `Coaching`
- `Resources`

## Stack

- React 19
- React Router
- Vite

## Rutas

### Reps

- `/rep`
- `/rep/strategy`
- `/rep/path`
- `/rep/coaching`
- `/rep/resources`

### Admin

- `/admin`

## Integración backend

La app usa `alternate-project/src/lib/api.js` y se conecta a:

- `GET /api/academy/public/bootstrap`
- `GET /api/academy/admin/bootstrap`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- CRUD `POST/PUT/DELETE` sobre `/api/academy/admin/modules/*`

## Estructura interna

- `src/App.jsx`
- `src/context/AppContext.jsx`
- `src/data/seedData.js`
- `src/lib/api.js`
- `src/pages/RepHomePage.jsx`
- `src/pages/RepModulePage.jsx`
- `src/pages/AdminPage.jsx`
- `src/components/AdminModuleManager.jsx`

## Relación con FastAPI

La fuente de datos real vive en:

- `backend/academy_modules_routes.py`

Ese router expone el bootstrap público y el CRUD admin para los módulos alternos.

## Demo y contenido cargado

La app ya quedó enriquecida con demo realista:

- items operativos para strategy
- sesiones para top producer path
- coaching live items
- resources descargables
- lecciones de `wiki/skool` integradas como contenido de demo

Ejemplos cargados:

- `Front to Back Challenge`
- `Breaking The Pact`
- `First Visit Incentives`
- `The Residence Story`
- `The Concept Pitch`
- `No Comes at a Price`

## Diferencia frente al frontend principal

| `frontend/` | `alternate-project/` |
|---|---|
| App web principal, mucho más amplia | Slice más enfocado y más limpio |
| CRA + CRACO | Vite |
| Legacy + V2 + admin + onboarding | reps + admin CRUD de academy |
| Más compleja | Más fácil de aislar y desplegar |

## Uso recomendado

Ideal para:

- demos rápidas de academy
- experiencia mobile-first de reps
- administración de módulos academy
- base para una app separada de entrenamiento operativo

## Para seguir leyendo

- [[04 - Backend & API]]
- [[09 - Deployment & Environment]]
