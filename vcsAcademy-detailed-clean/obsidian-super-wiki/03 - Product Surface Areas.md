---
tags:
  - vcsa
  - product
  - modules
---

# Product Surface Areas

## Usuarios principales

- `rep`: representante de ventas
- `manager`: líder de equipo
- `director`: visión de director
- `org_admin`: administración white-label / organización
- `admin`: administración global

## Superficies funcionales del producto

### 1. Core de rendimiento para reps

- Daily Performance
- Goal Sheet
- Financial Planner
- Analytics
- Pre-Tour Mode
- Post-Tour Debrief
- AI Coach

Código relacionado:

- `frontend/src/pages/DailyPerformancePage.jsx`
- `frontend/src/pages/GoalSheetPage.jsx`
- `frontend/src/pages/FinancialPlanningPage.jsx`
- `frontend/src/pages/AnalyticsPage.jsx`
- `frontend/src/v2/pages/PreTourMode.jsx`
- `frontend/src/v2/pages/PostTourDebrief.jsx`
- `frontend/src/v2/pages/AICoachChat.jsx`

### 2. Formación y progresión

- Top Producer Path
- Training Library
- Sessions
- Quick Wins
- Deal Breakdowns
- Masterclasses

Código relacionado:

- `frontend/src/pages/TopProducerPath.jsx`
- `frontend/src/pages/TrainingLibraryPage.jsx`
- `backend/phase1_routes.py`
- `backend/dashboard_routes.py`

### 3. Coaching en vivo

- Events
- Group Live Coaching
- Roleplay Sessions
- Q&A Sessions

Código relacionado:

- `frontend/src/pages/CoachingPage.jsx`
- `frontend/src/pages/coaching/*`
- `backend/dashboard_routes.py`

### 4. Recursos y entregables

- PDFs
- Ebooks
- Checklists
- Resource packs
- Lecciones Skool / YouTube en la app alterna

Código relacionado:

- `frontend/src/pages/ResourcesPage.jsx`
- `alternate-project/src/pages/RepModulePage.jsx`
- `backend/academy_modules_routes.py`

### 5. Community / social

- Feed
- Posts
- Comments
- Pinned content

Código relacionado:

- `frontend/src/pages/CommunityPage.jsx`
- `frontend/src/pages/CommunityFeedPage.jsx`
- modelos y rutas dentro de `backend/server.py`

### 6. White-label y school creation

- Organizations
- Branding
- Onboarding wizard
- Create School flow
- Organization settings

Código relacionado:

- `backend/organization_routes.py`
- `backend/branding_routes.py`
- `backend/school_routes.py`
- `frontend/src/pages/OnboardingWizard.jsx`
- `frontend/src/pages/CreateSchoolPage.jsx`
- `frontend/src/pages/OrganizationSettings.jsx`

### 7. AI assistant y knowledge layer

- Claude assistant
- Enhanced AI assistant
- Memory
- Knowledge uploads
- Team stats
- Notifications

Código relacionado:

- `backend/claude_routes.py`
- `backend/ai_assistant_enhanced.py`
- `backend/models/ai_memory.py`
- `backend/services/ai_assistant_service.py`

## Mapa por app

| App | Cobertura funcional |
|---|---|
| `frontend/` | Cobertura más amplia del producto |
| `apps/mobile/` | AI Coach + Quick Wins + performance móvil |
| `alternate-project/` | Strategy + Top Producer Path + Coaching + Resources |
| `vcsa-mobile/` | Preview móvil legacy de dashboard/training/coaching/resources/profile |

## Módulos academy alternos

La app `alternate-project/` concentra un slice claro del producto:

- `Strategy`
- `Top Producer Path`
- `Coaching`
- `Resources`

Ese slice se alimenta de `backend/academy_modules_routes.py` y hoy ya incluye demo de cursos de `wiki/skool`.

Ver también:

- [[07 - Alternate Academy App]]
- [[04 - Backend & API]]
