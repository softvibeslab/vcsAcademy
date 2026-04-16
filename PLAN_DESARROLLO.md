# Plan Integral de Desarrollo - VCSA (Vacation Club Sales Academy)

**Fecha**: 2026-04-15  
**Estado del Proyecto**: Activo - Fase de desarrollo y mejoras  
**Últimos Commits**: VPS deployment, Mobile PWA, AI System enhancements

---

## 📋 Resumen Ejecutivo

Este plan cubre todas las áreas críticas de desarrollo para el proyecto VCSA:

1. **Tareas de Desarrollo** (Features + Bug Fixes)
2. **Testing y Builds** (Backend + Frontend)
3. **Operaciones de Base de Datos** (Seeding + Migrations)
4. **Despliegue Docker** (Local + Producción)
5. **Code Review y Análisis** (Calidad + Seguridad)

---

## 🎯 1. TAREAS DE DESARROLLO

### 1.1 Features Prioritarias

#### 🔴 Alta Prioridad
- [ ] **Integración de Academy Modules Routes**
  - Archivo: `backend/academy_modules_routes.py` (nuevo, sin trackear)
  - Acción: Revisar, testear y merge al código principal
  - Impacto: Sistema de módulos de academia alternativo

- [ ] **Sistema de Goal Sheets**
  - Archivos: `backend/goal_sheet_routes.py`, componentes frontend
  - Acción: Completar integración de goal sheets diarias
  - Impacto: Core functionality para reps

- [ ] **Mejoras Mobile PWA**
  - Commit reciente: `bde176d feat(mobile): implement comprehensive mobile PWA`
  - Acción: Testing en dispositivos reales, bug fixes
  - Impacto: UX móvil para reps en piso de venta

#### 🟡 Media Prioridad
- [ ] **AI Coach Enhancements**
  - Commit reciente: `96aeecf feat(ai-system): implement complete knowledge management`
  - Acción: Testing de integración de AI, mejoras de rendimiento
  - Impacto: Sistema de entrenamiento inteligente

- [ ] **Financial Planner Sprint**
  - Acción: Completar módulo de planificación financiera
  - Impacto: Herramienta clave para reps

#### 🟢 Baja Prioridad
- [ ] **Stripe Payment Integration**
  - Estado: Configurado pero necesita testing completo
  - Acción: Testing de flujos de pago
  - Impacto: Monetización de la plataforma

### 1.2 Bug Fixes Conocidos

#### Backend
```python
# Encontrados en análisis:
- TODO en frontend/src/pages/TrainingLibraryPage.jsx:108
  "TODO: Call API to mark complete"
- Token management en apps/mobile/src/store/slices/aiCoachSlice.ts:49
```

#### Frontend
```javascript
// Componentes v2 que necesitan validación:
- MetricHero.jsx
- ProgressRing.jsx  
- GlassCard.jsx
- AchievementChip.jsx
```

### 1.3 Technical Debt

- [ ] **Actualizar dependencias obsoletas**
  - Backend: Revisar `requirements.txt`
  - Frontend: Revisar `package.json`
  
- [ ] **Mejorar coverage de tests**
  - Objetivo actual: 40% backend, 5% frontend
  - Objetivo meta: 70%+ overall

- [ ] **Documentación de API**
  - Completar OpenAPI/Swagger specs
  - Documentar nuevos endpoints de academy modules

---

## 🧪 2. TESTING Y BUILDS

### 2.1 Backend Tests (pytest)

#### Estado Actual
```bash
cd backend
python -m pytest tests/ -v
```

#### Tests Implementados
- ✅ Authentication tests (`test_phase1_api.py::TestAuth`)
- ✅ Phase 1 API tests
- ✅ Progress tracking tests
- ✅ Badges tests
- ✅ Bookmarks tests

#### Tests Necesarios
- [ ] **Academy Modules Routes Tests**
  ```python
  # tests/test_academy_modules.py
  - Test GET /api/academy/public/bootstrap
  - Test GET /api/academy/admin/bootstrap
  - Test POST /api/academy/admin/modules/{module_key}
  - Test PUT /api/academy/admin/modules/{module_key}/{item_id}
  - Test DELETE /api/academy/admin/modules/{module_key}/{item_id}
  ```

- [ ] **Goal Sheet Routes Tests**
  ```python
  # tests/test_goal_sheets.py
  - Test CRUD operations
  - Test validation logic
  - Test permissions
  ```

- [ ] **AI Assistant Tests**
  ```python
  # tests/test_ai_assistant.py
  - Test chat endpoints
  - Test knowledge retrieval
  - Test context management
  ```

#### Comandos de Testing
```bash
# Run all tests
pytest

# Verbose output
pytest -v

# Specific test
pytest tests/test_phase1_api.py::TestAuth::test_demo_user_login

# With coverage
pytest --cov=. --cov-report=html

# Coverage report target
pytest --cov=. --cov-report=html --cov-fail-under=70
```

### 2.2 Frontend Tests (Jest + React Testing Library)

#### Estado Actual
```bash
cd frontend
yarn test:ci
```

#### Tests Implementados
- ⚠️ ~5% coverage (infraestructura inicial)

#### Tests Necesarios
- [ ] **Component Tests**
  ```javascript
  // components/__tests__/MetricHero.test.jsx
  // components/__tests__/ProgressRing.test.jsx
  // components/__tests__/GlassCard.test.jsx
  ```

- [ ] **Page Tests**
  ```javascript
  // pages/__tests__/Dashboard.test.jsx
  // pages/__tests__/TopProducerPath.test.jsx
  // pages/__tests__/TrainingLibraryPage.test.jsx
  ```

- [ ] **Integration Tests**
  ```javascript
  // __tests__/integration/authFlow.test.jsx
  // __tests__/integration/progressTracking.test.jsx
  ```

#### Comandos de Testing
```bash
# Watch mode
yarn test

# CI mode
yarn test:ci

# With coverage
yarn test:ci -- --coverage

# Coverage target: 70%
```

### 2.3 Build Process

#### Backend Build
```bash
cd backend

# Lint
flake8 server.py phase1_routes.py academy_modules_routes.py

# Format
black server.py phase1_routes.py academy_modules_routes.py

# Type check
mypy server.py phase1_routes.py academy_modules_routes.py
```

#### Frontend Build
```bash
cd frontend

# Development build
yarn build

# Production build
yarn build

# Check build output
ls -la build/
```

---

## 🗄️ 3. OPERACIONES DE BASE DE DATOS

### 3.1 Seeding Scripts

#### Scripts Existentes
```bash
cd backend

# Seed coaching content
python seed_coaching.py

# Seed knowledge hub
python seed_knowledge_hub.py

# Seed all (if exists)
python seed_all.py

# Create demo user
python create_demo_user.py

# Add organizations
python seed_organizations.py
```

#### Scripts Necesarios
- [ ] **Academy Modules Seeder**
  ```python
  # backend/seed_academy_modules.py
  - Already implemented in academy_modules_routes.py
  - Extract to standalone script
  - Add CLI interface
  ```

- [ ] **Production Data Seeder**
  ```python
  # backend/seed_production.py
  - Seed real content (videos, PDFs, etc.)
  - From CONTENT_NEEDED.md requirements
  ```

### 3.2 Migrations

#### Migrations Existentes
```
backend/migrations/
├── __init__.py
├── add_organization_support.py
└── assign_roles.py
```

#### Migrations Necesarias
- [ ] **Academy Modules Collection**
  ```python
  # migrations/create_academy_modules_collections.py
  - Create academy_module_items collection
  - Add indexes for module_key, id, status
  - Add validation schemas
  ```

- [ ] **Goal Sheets Collection**
  ```python
  # migrations/create_goal_sheets_collection.py
  - Create goal_sheets collection
  - Add indexes for user_id, date
  - Add validation schemas
  ```

### 3.3 Database Operations

#### Backup
```bash
# Using Docker
./deploy.sh backup

# Manual mongodump
mongodump --uri="MONGO_URL" --out=/backup/path

# From running container
docker exec vcsa-mongodb mongodump --db=vcsa --out=/data/backup
```

#### Restore
```bash
# Manual mongorestore
mongorestore --uri="MONGO_URL" --drop /backup/path

# From container
docker exec vcsa-mongodb mongorestore --db=vcsa --drop /data/backup
```

#### Monitoring
```bash
# MongoDB stats
docker exec vcsa-mongodb mongosh --eval "db.stats()"

# Collection counts
docker exec vcsa-mongodb mongosh --eval "db.getCollectionNames().forEach(c => print(c + ': ' + db[c].count()))"
```

---

## 🐳 4. DESPLIEGUE DOCKER

### 4.1 Local Development con Docker

#### Estado Actual
```bash
docker-compose ps
# Output: "Docker compose not running"
```

#### Start Services
```bash
# Using deploy script (RECOMMENDED)
./deploy.sh deploy

# Manual docker-compose
docker-compose up -d

# Check services
./deploy.sh health

# View logs
./deploy.sh logs

# Specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

#### Service URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- MongoDB: mongodb://localhost:27017

#### Environment Variables
```bash
# Create .env in project root
cat > .env << EOF
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=changeme
DB_NAME=vcsa
REACT_APP_BACKEND_URL=http://localhost:8000
STRIPE_API_KEY=sk_test_...
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
EOF
```

### 4.2 Producción con Docker

#### Build Images
```bash
# Using build script
./build.sh docker

# Manual build
docker-compose build

# Build without cache
docker-compose build --no-cache
```

#### Deploy to VPS
```bash
# Using master deployment script
./deployment-master.sh

# Or VPS-specific script
./deploy-vps.sh
```

#### Production Configuration
```yaml
# docker-compose.prod.yml
services:
  frontend:
    environment:
      - REACT_APP_BACKEND_URL=https://api.salesmastersminds.com
    ports:
      - "80:80"
      - "443:443"
  
  backend:
    environment:
      - MONGO_URL=mongodb://mongodb:27017/vcsa_prod
      - JWT_SECRET=${PROD_JWT_SECRET}
    ports:
      - "8000:8000"
```

### 4.3 Docker Maintenance

#### Health Checks
```bash
# All services
./deploy.sh health

# Individual services
curl http://localhost:8000/api/health
curl http://localhost:3000/health

# Container health
docker inspect vcsa-backend | grep -A 5 Health
```

#### Logs Management
```bash
# View logs
docker-compose logs -f --tail=100

# Specific service
docker-compose logs -f backend

# Export logs
docker-compose logs > logs/export.txt
```

#### Cleanup
```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Remove dangling images
docker image prune -a

# Remove everything
docker system prune -a --volumes
```

---

## 🔍 5. CODE REVIEW Y ANÁLISIS

### 5.1 Code Review Workflow

#### Pre-commit Checklist
- [ ] Tests pass locally
- [ ] Linting passes (flake8/black for backend, eslint for frontend)
- [ ] Type checking passes (mypy for backend)
- [ ] Build succeeds
- [ ] Documentation updated

#### Review Points
```markdown
## Security
- SQL injection prevention
- XSS protection
- CSRF tokens
- Authentication/authorization
- Environment variables handling
- Secrets management

## Performance
- Database query optimization
- Caching strategies
- Bundle size optimization
- Lazy loading
- Image optimization

## Code Quality
- DRY principles
- SOLID principles
- Naming conventions
- Error handling
- Logging strategy
- Documentation completeness
```

### 5.2 Security Review

#### Automated Security Scanning
```bash
# Backend dependency scan
pip install safety
cd backend
safety check

# Frontend dependency scan
cd frontend
yarn audit

# Docker image scan
docker scan vcsa-backend:latest
docker scan vcsa-frontend:latest
```

#### Manual Security Checklist
- [ ] **Authentication**
  - JWT token validation
  - Password hashing (bcrypt)
  - Session management
  - OAuth integration security

- [ ] **Authorization**
  - Role-based access control
  - Admin endpoints protected
  - Resource ownership validation

- [ ] **Data Validation**
  - Input sanitization
  - SQL injection prevention (MongoDB injection)
  - File upload validation
  - XSS prevention

- [ ] **API Security**
  - Rate limiting
  - CORS configuration
  - API versioning
  - Error message sanitization

### 5.3 Performance Analysis

#### Backend Performance
```python
# Add profiling middleware
# backend/profiling.py
from time import time
from starlette.middleware.base import BaseHTTPMiddleware

class ProfilingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time()
        response = await call_next(request)
        duration = time() - start
        response.headers["X-Process-Time"] = str(duration)
        return response
```

#### Frontend Performance
```bash
# Bundle analysis
cd frontend
yarn build
npx build-bundle-analyzer build/static/js

# Lighthouse CI
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse.json
```

#### Database Performance
```bash
# MongoDB profiling
docker exec vcsa-mongodb mongosh --eval "db.setProfilingLevel(2)"
docker exec vcsa-mongodb mongosh --eval "db.system.profile.find().pretty()"

# Index analysis
docker exec vcsa-mongodb mongosh --eval "db.users.getIndexes()"
```

### 5.4 Code Quality Metrics

#### Backend Quality Tools
```bash
# Linting
flake8 backend/ --max-line-length=100 --ignore=E501

# Type checking
mypy backend/ --ignore-missing-imports

# Complexity analysis
pip install radon
radon cc backend/ -a

# Security scanning
bandit -r backend/
```

#### Frontend Quality Tools
```bash
# Linting
cd frontend
yarn lint

# Format check
yarn lint:check

# Prettier check
yarn prettier:check

# Complexity analysis
yarn eslint --print-config src/ > eslint-config.json
```

---

## 📊 6. MONITOREO Y MANTENIMIENTO

### 6.1 Application Monitoring

#### Sentry Integration
```python
# Backend (backend/sentry_config.py)
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

def init_sentry():
    sentry_sdk.init(
        dsn=os.environ.get("SENTRY_DSN"),
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )
```

#### Health Check Endpoints
```python
# backend/server.py
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": await check_database_connection(),
        "services": await check_external_services()
    }
```

### 6.2 Logging Strategy

#### Backend Logging
```python
# backend/logging_config.py
import logging
from pythonjsonlogger import jsonlogger

def setup_logging():
    logger = logging.getLogger()
    handler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter('%(asctime)s %(name)s %(levelname)s %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
```

#### Frontend Logging
```javascript
// frontend/src/utils/logger.js
export const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data);
    // Send to logging service
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to Sentry
  }
};
```

### 6.3 Alert Configuration

#### Critical Alerts
- [ ] Database connection failures
- [ ] API error rate > 5%
- [ ] Response time > 2s (p95)
- [ ] Memory usage > 80%
- [ ] Disk space < 20%

#### Warning Alerts
- [ ] API error rate > 1%
- [ ] Response time > 1s (p95)
- [ ] CPU usage > 70%

---

## 🎯 7. ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Fundamentos (Semanas 1-2)
- [x] Configuración inicial del proyecto
- [ ] Setup de entorno de desarrollo
- [ ] Configuración de Docker local
- [ ] Tests básicos funcionando

### Fase 2: Features Core (Semanas 3-4)
- [ ] Integración de Academy Modules
- [ ] Sistema de Goal Sheets
- [ ] Mejoras Mobile PWA
- [ ] Testing coverage > 50%

### Fase 3: AI y Analytics (Semanas 5-6)
- [ ] AI Coach enhancements
- [ ] Financial Planner Sprint
- [ ] Analytics Dashboard
- [ ] Testing coverage > 70%

### Fase 4: Producción (Semanas 7-8)
- [ ] Security review completo
- [ ] Performance optimization
- [ ] Deployment a VPS
- [ ] Monitoring setup
- [ ] Documentation completa

---

## 📋 8. CHECKLIST DIARIO DE DESARROLLO

### Antes de Empezar
- [ ] Pull latest changes from main
- [ ] Check Docker services status
- [ ] Run tests to ensure clean slate
- [ ] Check git status for uncommitted changes

### Durante Desarrollo
- [ ] Write tests before code (TDD)
- [ ] Run linter after each file change
- [ ] Commit frequently with descriptive messages
- [ ] Push to feature branch for review

### Antes de Commit
- [ ] All tests pass
- [ ] Code is formatted (black/prettier)
- [ ] No console.log/debugger statements
- [ ] Documentation updated
- [ ] Commit message follows conventions

### Fin de Día
- [ ] Push changes to remote
- [ ] Create/update PR if needed
- [ ] Update task tracking
- [ ] Document blockers or issues
- [ ] Backup database if major changes

---

## 🛠️ 9. HERRAMIENTAS Y COMANDOS ÚTILES

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/academy-modules
git add .
git commit -m "feat(academy): add academy modules routes"
git push origin feature/academy-modules

# Merge to main
git checkout main
git merge feature/academy-modules
git push origin main
```

### Docker Quick Commands
```bash
# Quick restart
docker-compose restart backend

# Rebuild single service
docker-compose up -d --build backend

# Enter container
docker-compose exec backend bash
docker-compose exec mongodb mongosh

# View logs
docker-compose logs -f backend --tail=50
```

### Database Quick Commands
```bash
# MongoDB shell
docker-compose exec mongodb mongosh
> use vcsa
> show collections
> db.users.find().pretty()

# Backup
docker-compose exec mongodb mongodump --db=vcsa --out=/data/backup

# Restore
docker-compose exec mongodb mongorestore --db=vcsa --drop /data/backup
```

---

## 📚 10. RECURSOS Y DOCUMENTACIÓN

### Documentación del Proyecto
- `CLAUDE.md` - Instrucciones para Claude Code
- `README.md` - Overview del proyecto
- `DEPLOY.md` - Guía de despliegue
- `TESTING.md` - Guía de testing
- `design_guidelines.json` - Sistema de diseño
- `CONTENT_NEEDED.md` - Contenido requerido (35 videos)

### Wiki
- `wiki/Home.md` - Wiki home
- `wiki/getting-started/Setup.md` - Setup inicial
- `wiki/development/Architecture.md` - Arquitectura
- `wiki/api/Development.md` - API reference

### Scripts Útiles
- `./deploy.sh` - Deployment management
- `./build.sh` - Build management
- `./deployment-master.sh` - VPS deployment
- `backend/seed_*.py` - Database seeding

---

## ✅ 11. CRITERIOS DE ÉXITO

### Funcionales
- [ ] Todos los tests pasando (>70% coverage)
- [ ] Build de producción exitoso
- [ ] Despliegue en VPS funcional
- [ ] Monitoreo operativo

### Técnicos
- [ ] Sin vulnerabilidades de seguridad críticas
- [ ] Performance: API response < 500ms (p95)
- [ ] Uptime > 99%
- [ ] Error rate < 1%

### Usuario
- [ ] Mobile PWA funcional en dispositivos reales
- [ ] Academy modules operativo
- [ ] Goal sheets funcionando
- [ ] AI coach respondiendo correctamente

---

## 🚀 12. PRÓXIMOS PASOS INMEDIATOS

### Hoy
1. Iniciar Docker services localmente
2. Correr test suite y documentar fallos
3. Revisar academy_modules_routes.py
4. Setup de environment de desarrollo

### Esta Semana
1. Completar integración de Academy Modules
2. Implementar tests para nuevos endpoints
3. Bug fixes de Mobile PWA
4. Mejorar coverage de tests

### Este Mes
1. Completar Goal Sheets system
2. AI Coach enhancements
3. Security review completo
4. Deployment a VPS de staging

---

**Notas**:
- Este plan es un documento vivo - actualizar según progreso
- Prioridades pueden cambiar según necesidades del negocio
- Mantener comunicación constante con stakeholders
- Documentar todo cambio significativo

**Contacto**:
- Para dudas sobre este plan, consultar en GitHub Issues
- Para emergencias de producción, seguir runbook de incidentes
- Para code review, crear PR con template apropiado
