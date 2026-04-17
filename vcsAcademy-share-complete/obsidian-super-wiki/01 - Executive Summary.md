---
tags:
  - vcsa
  - overview
---

# Executive Summary

## Qué es VCSA

**Vacation Sales Club Academy** es una plataforma de entrenamiento y operación para equipos de ventas de vacation club / timeshare. En la práctica, el repo no contiene una sola app: contiene un ecosistema de apps, prototipos, módulos operativos y documentación acumulada por fases.

## Qué existe hoy

### Núcleo más importante

- `backend/`: API FastAPI con MongoDB y la mayor parte de la lógica de negocio
- `frontend/`: app web principal en React, con rutas legacy y rutas V2 coexistiendo

### Superficies activas o recientes

- `apps/mobile/`: app Expo/React Native nueva para reps
- `alternate-project/`: app React/Vite separada para `Strategy`, `Top Producer Path`, `Coaching` y `Resources`, conectada a FastAPI

### Superficies secundarias o legacy

- `vcsa-mobile/`: app Expo anterior de preview
- `vcsa-insight/`: app CRA adicional
- `netlify-deploy/`: artefacto estático para despliegue
- HTMLs sueltos como `SISTEMA_COMPLETO.html`

## Módulos de negocio que aparecen en el sistema

- Strategy
- Daily Performance
- Goal Sheet
- Financial Planner
- Analytics
- Top Producer Path
- Training Library
- Coaching
- Events / Group Coaching / Roleplay / Q&A
- Resources
- Community
- AI Assistant / AI Coach
- Branding / White Label Organizations
- School creation / onboarding

## La realidad arquitectónica

El proyecto tiene mucho trabajo real, pero también varias “fuentes de verdad” al mismo tiempo:

- Más de una app web
- Más de una app móvil
- Más de un árbol de documentación (`docs/wiki`, `wiki`, docs raíz)
- Más de una estrategia de deploy
- Rutas web superpuestas y evolución V1/V2 en paralelo

## Qué parece ser lo más canónico hoy

- Backend principal: `backend/server.py`
- Frontend principal: `frontend/src/App.js`
- Móvil nuevo: `apps/mobile/`
- App academy alternativa: `alternate-project/`

## Lectura ejecutiva del estado

### Fortaleza

- Hay producto real
- Hay módulos de negocio específicos para reps y admins
- Existe base backend suficiente para evolucionar
- Hay mucho contexto documental

### Riesgo

- Documentación excesivamente dispersa
- Varias apps con solapamiento funcional
- Algunas READMEs siguen en estado boilerplate
- Cobertura de tests baja
- Configuraciones de entorno y puertos no siempre alineadas

## Siguiente lectura recomendada

- [[02 - Repository Map]]
- [[03 - Product Surface Areas]]
- [[11 - Current State & Risks]]
