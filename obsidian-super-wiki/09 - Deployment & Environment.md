---
tags:
  - vcsa
  - deploy
  - local
---

# Deployment & Environment

## Estrategias de deploy detectadas

- Docker Compose
- Netlify
- VPS
- Render
- Expo / EAS para móvil
- previews locales y builds estáticos

## Archivos clave de infraestructura

- `docker-compose.yml`
- `docker-compose.local.yml`
- `docker-compose.preview.yml`
- `docker-compose.production.yml`
- `docker-compose.vps.yml`
- `render.yaml`
- `netlify.toml`
- `nginx/`

## Servicios en `docker-compose.yml`

- `mongodb`
- `backend`
- `frontend`

Puertos visibles:

- Mongo host: `27019`
- Backend host: `8001`
- Frontend containerizado: `80` y `443`

## Variables de entorno importantes

### Backend

- `MONGO_URL`
- `DB_NAME`
- `STRIPE_API_KEY`
- `CORS_ORIGINS`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`

### Frontend principal

- `REACT_APP_BACKEND_URL`

### App academy alterna

- `VITE_API_BASE_URL`

### Móvil nuevo

Documentación menciona:

- `REACT_APP_API_URL`

pero parte del código usa URLs hardcodeadas a `localhost:8001`.

## Comandos locales útiles

### Backend con Docker

```bash
docker compose up -d mongodb backend
```

### Frontend principal

```bash
cd frontend
yarn start
```

### App academy alterna

```bash
cd alternate-project
npm install
npm run dev
```

o para preview:

```bash
npm run build
npm run preview
```

### Móvil nuevo

```bash
cd apps/mobile
npm install
npm start
```

### Móvil legacy

```bash
cd vcsa-mobile
npm install
npm start
```

## URLs locales típicas

- Backend FastAPI: `http://localhost:8001`
- Frontend principal CRA dev: `http://localhost:3000`
- Frontend Docker: `http://localhost`
- Alternate app dev/preview: normalmente `5173`, `4173` o `4174`
- Expo: servidor local con QR

## Dónde vive la mayor fricción de entorno

- `frontend/` usa fallback a `2345`, pero backend local reciente vive en `8001`
- el alterno ya está alineado con `8001`
- el móvil nuevo mezcla `/mobile` y `/api/auth`
- hay varias guías de deploy en paralelo y no una sola guía canónica

## Documentos relevantes

### Deploy / infra

- `DEPLOY_LOCAL_GUIDE.md`
- `DEPLOY_LOCAL_SIMPLE.md`
- `DEPLOYMENT_README.md`
- `DEPLOYMENT_CHECKLIST.md`
- `PRODUCTION_DEPLOYMENT_GUIDE.md`
- `VPS_DEPLOYMENT_GUIDE.md`
- `NETLIFY_DEPLOY.md`
- `NETLIFY_DEPLOYMENT_GUIDE.md`

### Mobile / APK / Expo

- `MOBILE_PREVIEW_GUIDE.md`
- `MOBILE_TEST_INSTRUCTIONS.md`
- `DEPLOY_MOBILE_FINAL.md`
- `EXPO_GO_INSTRUCTIONS.md`
- `apps/mobile/*.md`
- `vcsa-mobile/README.md`

## Ver también

- [[10 - Documentation Atlas]]
- [[11 - Current State & Risks]]
