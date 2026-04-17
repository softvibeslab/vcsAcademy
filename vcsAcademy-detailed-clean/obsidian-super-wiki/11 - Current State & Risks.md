---
tags:
  - vcsa
  - status
  - risks
---

# Current State & Risks

## Resumen honesto

VCSA está **avanzado pero en transición**. El repo contiene trabajo real de producto, pero también evidencia clara de evolución por fases, prototipos paralelos y documentación no consolidada.

## Fortalezas

- Backend funcional con muchos dominios reales
- Frontend principal con cobertura amplia del negocio
- App móvil nueva ya iniciada
- App alterna academy bien delimitada
- Mucha documentación e historial de decisiones
- Seeds y demos que facilitan mostrar producto

## Riesgos principales

### 1. Muchas fuentes de verdad

- `frontend/`
- `apps/mobile/`
- `alternate-project/`
- `vcsa-mobile/`
- `vcsa-insight/`
- `docs/wiki/`
- `wiki/`
- docs raíz

Eso dificulta responder preguntas simples como:

- cuál es la app oficial
- cuál es el flujo canónico
- cuál es la guía vigente de deploy

### 2. Routing web superpuesto

En `frontend/src/App.js` existen rutas duplicadas como:

- `/dashboard`
- `/community`

Eso es señal de capas legacy y nuevas coexistiendo sin una limpieza final.

### 3. Configuración de entorno dispersa

- frontend principal con fallback a `2345`
- backend local reciente en `8001`
- alterno usando `8001`
- móvil nuevo usando `/mobile`
- auth slice móvil usando `/api/auth`

### 4. Cobertura de tests limitada

Hallazgos visibles:

- un solo test backend claro en `backend/tests/test_phase1_api.py`
- infraestructura de tests frontend muy ligera
- abundancia de guías y reportes comparada con el volumen de validación automatizada

### 5. Documentación excesiva pero no consolidada

Hay valor documental, pero el costo cognitivo también es alto. Por eso esta carpeta Obsidian existe.

## Qué parece más canónico hoy

### Para backend

- `backend/server.py`
- routers de `backend/*_routes.py`

### Para web

- `frontend/src/App.js`

### Para móvil

- `apps/mobile/`

### Para academy modular y demos de reps/admin

- `alternate-project/`
- `backend/academy_modules_routes.py`

## Qué parece legacy o experimental

- `vcsa-mobile/`
- `vcsa-insight/`
- `netlify-deploy/`
- varios `.md` de resumen/reporting que documentan momentos del proyecto más que el estado actual

## Qué limpiar primero si hubiera una fase de consolidación

1. Definir qué app web es la fuente oficial por audiencia
2. Eliminar o marcar rutas duplicadas en `frontend/src/App.js`
3. Unificar puertos, variables de entorno y convenciones API
4. Unificar auth móvil
5. Escoger una sola wiki/documentation spine
6. Subir cobertura de tests en backend y frontend

## Respuesta rápida a “por dónde empiezo”

### Si quieres operar el sistema actual

- usa `backend/` + `frontend/`

### Si quieres una experiencia academy más enfocada

- usa `alternate-project/`

### Si quieres rescatar móvil moderno

- usa `apps/mobile/`

## Ver también

- [[01 - Executive Summary]]
- [[09 - Deployment & Environment]]
- [[10 - Documentation Atlas]]
