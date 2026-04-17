---
tags:
  - vcsa
  - backend
  - fastapi
---

# Backend & API

## Stack

- FastAPI
- Motor + MongoDB
- Pydantic
- bcrypt
- httpx
- Sentry opcional

## Entry point

- `backend/server.py`

Ahí viven:

- Inicialización de FastAPI
- Conexión Mongo
- Modelos base
- auth y endpoints del core
- inclusión de routers por feature
- CORS

## Routers activos detectados

| Archivo | Prefijo | Responsabilidad |
|---|---|---|
| `server.py` | `/api` | health, root y core histórico |
| `organization_routes.py` | `/api/organizations` | white-label orgs, branding, onboarding |
| `school_routes.py` | `/api/schools` | create school flow |
| `phase1_routes.py` | `/api/development` | tracks, stages, quick wins, breakdowns, progress |
| `branding_routes.py` | `/api/branding` | branding configs |
| `goal_sheet_routes.py` | `/api/goalsheet` | goal sheets diarias, streaks, leaderboard |
| `financial_routes.py` | `/api/financial` | metas financieras, ventas, attributes, challenges |
| `dashboard_routes.py` | `/api/dashboard` | strategy, performance, training, coaching |
| `claude_routes.py` | `/api/assistant` | chat assistant histórico |
| `ai_assistant_enhanced.py` | `/api/ai-assistant` | memoria, conocimiento, chat, team stats |
| `ai_assistant_enhanced.py` | `/api/ai-assistant/public` | endpoints públicos AI |
| `mobile_routes.py` | `/mobile` | login móvil, quick wins, performance, sync |
| `academy_modules_routes.py` | `/api/academy` | bootstrap y CRUD de módulos de la app alterna |

## Familias de endpoints relevantes

### Salud y root

- `GET /api/health`
- `GET /api/`

### Development / top producer system

- `GET /api/development/stages`
- `GET /api/development/tracks`
- `GET /api/development/progress`
- `GET /api/development/quickwins`
- `GET /api/development/breakdowns`
- `POST /api/development/content/{content_id}/complete`

### Dashboard lite

- `GET /api/dashboard/strategy`
- `PUT /api/dashboard/strategy`
- `GET /api/dashboard/performance`
- `POST /api/dashboard/performance/tour`
- `GET /api/dashboard/training/session/{session_id}`
- `GET /api/dashboard/coaching/events`
- `GET /api/dashboard/coaching/group`
- `GET /api/dashboard/coaching/roleplay`
- `GET /api/dashboard/coaching/qa`

### Goal sheet

- `POST /api/goalsheet/daily`
- `GET /api/goalsheet/today`
- `GET /api/goalsheet/weekly`
- `GET /api/goalsheet/streak`
- `GET /api/goalsheet/leaderboard/team`

### Financial planner

- `POST /api/financial/goals/setup`
- `GET /api/financial/goals/current`
- `GET /api/financial/goals/summary`
- `POST /api/financial/sales/daily`
- `GET /api/financial/sales/monthly`

### Academy modules alternos

- `GET /api/academy/public/bootstrap`
- `GET /api/academy/admin/bootstrap`
- `POST /api/academy/admin/reset`
- `POST /api/academy/admin/modules/{module_key}`
- `PUT /api/academy/admin/modules/{module_key}/{item_id}`
- `DELETE /api/academy/admin/modules/{module_key}/{item_id}`

### Mobile

- `POST /mobile/auth/login`
- `POST /mobile/ai/coach`
- `GET /mobile/quick-wins`
- `GET /mobile/performance/readiness`
- `GET /mobile/performance/daily-goal`
- `POST /mobile/performance/tour`
- `GET /mobile/sync/content`

## Modelos visibles en el core

Dentro de `server.py` aparecen modelos como:

- `User`
- `Team`
- `Course`
- `Lesson`
- `Event`
- `Post`
- `Comment`
- `Resource`

Modelos adicionales:

- `backend/models/goal_sheet.py`
- `backend/models/financial_goal.py`
- `backend/models/ai_memory.py`

## Seeds y utilidades operativas

El backend tiene muchos scripts de soporte:

- creación de admins y demo users
- seeds de coaching, phase1, branding, organizations, knowledge hub
- carga de cursos Skool
- scripts de diagnóstico y fixes

Ejemplos:

- `backend/create_admin_user.py`
- `backend/seed_phase1_content.py`
- `backend/seed_coaching.py`
- `backend/seed_skool_courses.py`
- `backend/load_skool_courses.py`

## Observaciones prácticas

- El backend mezcla core + features + seeds + utilidades en un mismo directorio
- `server.py` sigue siendo un archivo muy grande y concentra mucho contexto
- El árbol de routers es rico, pero no está documentado de forma única en un solo lugar fuera del código

## Para seguir leyendo

- [[08 - Data, Auth & Roles]]
- [[09 - Deployment & Environment]]
- [[11 - Current State & Risks]]
