---
tags:
  - vcsa
  - data
  - auth
---

# Data, Auth & Roles

## Base de datos

El backend usa:

- MongoDB
- Motor async driver

Inicialización visible en:

- `backend/server.py`

Variables principales:

- `MONGO_URL`
- `DB_NAME`

## Modelos y entidades visibles

### En `backend/server.py`

- `User`
- `Team`
- `Course`
- `Lesson`
- `Event`
- `Post`
- `Comment`
- `Resource`

### En `backend/models/`

- `goal_sheet.py`
- `financial_goal.py`
- `ai_memory.py`

## Roles

Jerarquía detectada en `backend/server.py`:

- `rep`
- `manager`
- `director`
- `org_admin`
- `admin`

El orden de permisos es acumulativo:

- `rep` < `manager` < `director` < `org_admin` < `admin`

## Auth web

La experiencia web principal usa endpoints tipo:

- `GET /api/auth/me`
- `POST /api/auth/logout`

La operación reciente del repo también confirma sesiones por cookie (`session_token`) para web/admin.

## Auth móvil

Aquí hay dos enfoques coexistiendo:

### API móvil nueva

- `apps/mobile/src/services/api/index.ts` usa `http://localhost:8001/mobile`
- guarda token en `AsyncStorage`

### Slice auth

- `apps/mobile/src/store/slices/authSlice.ts` usa `http://localhost:8001/api/auth/login`

Eso significa que el flujo auth móvil todavía no está completamente unificado.

## Contextos y acceso en frontend web

La app principal usa:

- `OrganizationContext`
- `BrandingContext`
- `RoleContext`
- `AuthContext`

Además existe un `RoleGuard` para rutas protegidas.

## Datos de academy alterna

La app `alternate-project/` usa una colección operativa para módulos academy administrables desde FastAPI.

Módulos:

- `strategy`
- `topProducerPath`
- `coaching`
- `resources`

## Seeds y datos demo

El repo contiene muchos scripts de seeding:

- users demo
- organizations
- coaching
- phase1 content
- knowledge hub
- skool
- academy modules

Esto es útil para demos, pero también indica que el proyecto depende bastante de data seeded para verse completo.

## Puntos importantes para mantenimiento

- Documentar qué colecciones son canónicas por feature
- Unificar auth móvil
- Reducir la mezcla entre datos demo, fallback y producción

## Ver también

- [[04 - Backend & API]]
- [[11 - Current State & Risks]]
