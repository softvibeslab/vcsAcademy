---
tags:
  - vcsa
  - mobile
  - expo
---

# Mobile Apps

El repo contiene **dos** apps móviles principales y una tercera superficie web-mobile indirecta en `alternate-project/`.

## 1. `apps/mobile/` — app móvil nueva

### Stack

- Expo
- React Native
- TypeScript
- Redux Toolkit
- React Navigation

### Propósito

App móvil “VCSA Pocket” para reps con:

- Dashboard
- Pre-Tour Mode
- AI Coach Chat
- Quick Wins Library
- Post-Tour Debrief
- Goal Sheet
- Play Role / práctica

### Estructura

- `src/components/`
- `src/screens/`
- `src/services/api/`
- `src/store/`
- `src/navigation/`
- `src/types/`

### Endpoints esperados

El cliente API en `apps/mobile/src/services/api/index.ts` apunta a:

- `http://localhost:8001/mobile`

y consume:

- `/auth/login`
- `/ai/coach`
- `/quick-wins`
- `/performance/*`
- `/sync/content`

### Observaciones importantes

- `authSlice.ts` todavía hace login contra `http://localhost:8001/api/auth/login`
- `AppNavigator.tsx` devuelve `null` si el usuario no está autenticado
- hay una diferencia entre la capa API móvil y el slice de auth que conviene unificar

## 2. `vcsa-mobile/` — app móvil legacy

### Stack

- Expo
- React Native
- JavaScript

### Propósito

Preview APK / demo móvil anterior con pantallas de:

- Dashboard
- Training
- Coaching
- Resources
- Profile

### Estado

Parece más orientada a preview / entrega rápida que a evolución del código principal.

## 3. `alternate-project/` como experiencia mobile-first

Aunque no es React Native, sí representa una experiencia enfocada a móvil:

- `/rep`
- `/rep/strategy`
- `/rep/path`
- `/rep/coaching`
- `/rep/resources`

con admin separado:

- `/admin`

Ver [[07 - Alternate Academy App]]

## Cuál tomar como principal

### Si el objetivo es producto móvil nativo o Expo

Tomar `apps/mobile/`

### Si el objetivo es una experiencia rápida para reps en navegador móvil

Tomar `alternate-project/`

### Si el objetivo es rescatar material legacy

Revisar `vcsa-mobile/`

## Recomendación de lectura

- [[07 - Alternate Academy App]]
- [[09 - Deployment & Environment]]
- [[11 - Current State & Risks]]
