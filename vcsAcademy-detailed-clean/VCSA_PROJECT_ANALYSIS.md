# 🎯 VCSA - Análisis Completo del Proyecto

**Vacation Club Sales Academy** - Plataforma premium de entrenamiento para profesionales de ventas de vacation club/timeshare

---

## 📊 Resumen Ejecutivo

VCSA es un **"Sistema Operativo de Ventas"** diseñado como herramienta diaria para representantes de ventas en el floor, no solo una plataforma de cursos. Ayuda a sales reps a mejorar rendimiento, da a managers recursos estructurados para desarrollar equipos, y equipa a líderes con insights y conversaciones estratégicas.

### Posicionamiento Estratégico
- **Primary Tool**: Sistema de uso diario para reps en el sales floor
- **Three Pillars**: 
  1. Top Producer Development System (Rep performance engine)
  2. Manager Performance Resource Center (Team training tools - Phase 2)
  3. Industry Leadership Network (Strategic content - Phase 3)

---

## 🏗️ Stack Tecnológico

| Componente | Tecnología | Versión | Propósito |
|------------|------------|---------|-----------|
| **Frontend** | React 19 | ^19.0.0 | UI con hooks y context |
| **Styling** | Tailwind CSS | ^3.4.17 | Utilidades CSS |
| **Components** | shadcn/ui | latest | Componentes UI premium |
| **Animations** | Framer Motion | ^12.35.1 | Micro-animaciones |
| **Backend** | FastAPI | latest | API async Python |
| **Database** | MongoDB | motor driver | Base de datos NoSQL |
| **Auth** | JWT + OAuth | httpOnly cookies | Sesiones seguras |
| **Payments** | Stripe | subscriptions | Membresías VIP |
| **AI** | Ollama LLM | llama3.1 | Asistente AI local |

### Dependencies Clave

```json
{
  "frontend": {
    "react": "^19.0.0",
    "react-router-dom": "^7.5.1",
    "framer-motion": "^12.35.1",
    "recharts": "^3.6.0",
    "@radix-ui/*": "latest",
    "tailwindcss": "^3.4.17"
  },
  "backend": {
    "fastapi": "latest",
    "motor": "latest",
    "pydantic": "latest",
    "stripe": "latest",
    "httpx": "latest"
  }
}
```

---

## 🎨 Features Principales Implementadas

### 1. Sistema de Desarrollo "Top Producer" (Phase 1) ✅

#### 4 Etapas de Progresión
- **Stage 1: New Rep** - Build foundation (150 pts, 1-2 weeks)
- **Stage 2: Developing Rep** - Execute consistently (300 pts, 2-4 weeks)
- **Stage 3: Performing Rep** - Close consistently (500 pts, 4-8 weeks)
- **Stage 4: Top Producer** - Elite performer (750 pts, 8-12 weeks)

#### 6 Tracks de Entrenamiento (36 módulos totales)
1. **Pro Mindset** (6 modules)
2. **Discovery & Control** (6 modules)
3. **Value Architecture** (6 modules)
4. **Decision Management** (6 modules)
5. **Objection Mastery** (6 modules)
6. **Post-Decision Integrity** (6 modules)

#### Sistema de Puntos
- 10 puntos por training module
- 5 puntos por deal breakdown
- 3 puntos por quick win

#### Readiness Score Algorithm
```
= (Video Completion × 40%) +
  (Track Progress × 30%) +
  (Quick Wins Applied × 10%) +
  (Breakdowns Reviewed × 10%) +
  (Training Streak × 10%)
```

### 2. Gamificación Avanzada ✅

- **11 Badges** con lógica de otorgamiento automático
- **Training Streak** con ventana de 24 horas
- **Stage Gate Checks** para validación de progreso
- **Sistema de Watch Later/Bookmarks** con tags inteligentes
  - `before_tour`, `closing_help`, `objections`, `discovery`, etc.

### 3. AI Assistant Mejorado ✅

```python
Features del sistema AI:
├── Memory System (conversación a largo plazo)
├── Sentiment Analysis (ajusta respuestas según estado emocional)
├── Role Playing Scenarios (práctica interactiva)
├── Proactive Suggestions (basadas en gaps de rendimiento)
├── Knowledge Base (PDF upload con AI processing)
├── Enhanced Chat (contexto completo del usuario)
├── Notification System (alertas inteligentes)
└── Admin Dashboard (estadísticas de equipo)
```

**Modelo AI**: Ollama Llama 3.1 (local deployment)

### 4. Sistema de Branding Personalizable ✅

**8 Categorías de Configuración:**
1. **Colores**: primary, secondary, accent, background, card, text
2. **Imágenes**: logo, favicon, hero background, login background
3. **Tipografía**: font_heading, font_body, font_mono
4. **Textos**: site_name, tagline, description
5. **UI Config**: border_radius, button_style, card_style, animation_level
6. **Gradientes**: primary, secondary
7. **Social**: facebook, twitter, instagram, linkedin, youtube
8. **Advanced**: custom_css, head_scripts, body_scripts

**Features:**
- Variables CSS dinámicas
- Múltiples configuraciones simultáneas
- Activación instantánea de temas
- Previsualización en tiempo real
- CRUD completo

### 5. Multi-Tenancy / Organizaciones ✅

- Soporte para múltiples organizaciones
- Branding por organización
- Límites y features configurables
- Gestión de equipos y roles
- Onboarding flow completo

### 6. Mobile PWA Completo ✅

- Service Worker con caching estratégico
- Manifest instalable (144x144 icon)
- UX optimizada para móvil
- Responsive design completo
- Touch-friendly interactions

---

## 📂 Arquitectura de Archivos

```
vcsAcademy/
├── backend/
│   ├── server.py                    # FastAPI main app (auth, core routes)
│   ├── phase1_routes.py            # Development system API
│   ├── ai_assistant_enhanced.py    # AI system completo
│   ├── branding_routes.py          # Branding configuration API
│   ├── organization_routes.py      # Multi-tenancy API
│   ├── school_routes.py            # School management API
│   ├── models/
│   │   ├── ai_memory.py           # AI data models
│   │   └── organization_models.py # Organization models
│   ├── services/
│   │   └── ai_assistant_service.py # AI business logic
│   ├── seed_*.py                   # Database seeding scripts
│   │   ├── seed_coaching.py        # Coaching content
│   │   ├── seed_knowledge_hub.py   # Knowledge hub
│   │   ├── seed_branding.py        # Branding configs
│   │   └── seed_organizations.py   # Organizations
│   └── tests/
│       └── test_phase1_api.py      # Backend tests
│
├── frontend/
│   ├── src/
│   │   ├── App.js                  # Main router + auth context
│   │   ├── pages/                  # Route pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TopProducerPath.jsx      # 4-stage progression
│   │   │   ├── TrackDetailPage.jsx      # Track modules
│   │   │   ├── DealBreakdownsPage.jsx   # 15 scenarios
│   │   │   ├── QuickWinsPage.jsx        # 20 tactics
│   │   │   ├── CoursesPage.jsx          # Legacy training
│   │   │   ├── CommunityPage.jsx        # Community feed
│   │   │   ├── EventsPage.jsx           # Calendar
│   │   │   ├── ResourcesPage.jsx        # Downloads
│   │   │   ├── MembershipPage.jsx       # Subscription tiers
│   │   │   ├── ProfilePage.jsx          # User profile
│   │   │   ├── AdminPage.jsx            # Admin panel
│   │   │   ├── AdminEnhancedPage.jsx    # Enhanced admin
│   │   │   └── AdminSimplePage.jsx      # Simple admin
│   │   ├── components/
│   │   │   ├── ui/                      # shadcn/ui components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── dropdown-menu.jsx
│   │   │   │   └── [40+ components]
│   │   │   ├── ai/                      # AI components
│   │   │   │   ├── AIAssistantButton.jsx
│   │   │   │   ├── RolePlayingInterface.jsx
│   │   │   │   └── NotificationCenter.jsx
│   │   │   ├── onboarding/              # Onboarding flow
│   │   │   │   ├── WelcomeStep.jsx
│   │   │   │   ├── BrandingStep.jsx
│   │   │   │   ├── ContentStep.jsx
│   │   │   │   ├── TeamStep.jsx
│   │   │   │   ├── SettingsStep.jsx
│   │   │   │   └── CompleteStep.jsx
│   │   │   ├── settings/                # Settings components
│   │   │   │   ├── AIAssistantSection.jsx
│   │   │   │   ├── BrandingSection.jsx
│   │   │   │   ├── DomainSection.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── LimitsSection.jsx
│   │   │   │   └── TeamSection.jsx
│   │   │   ├── layout/
│   │   │   │   └── DashboardLayout.jsx
│   │   │   └── admin/
│   │   │       ├── KnowledgeManagement.jsx
│   │   │       ├── FileManagement.jsx
│   │   │       └── TeamStatsDashboard.jsx
│   │   ├── contexts/
│   │   │   ├── BrandingContext.js       # Branding global state
│   │   │   └── AuthContext.js           # Authentication state
│   │   └── __tests__/                   # Frontend tests
│   │       ├── components/
│   │       └── pages/
│   ├── public/
│   │   ├── manifest.json                # PWA manifest
│   │   ├── service-worker.js            # PWA service worker
│   │   ├── index.html
│   │   └── icon-144x144.png             # App icon
│   ├── package.json
│   ├── craco.config.js
│   ├── tailwind.config.js
│   └── jest.config.js
│
├── docker-compose.yml                  # Docker orchestration
├── Dockerfile.backend
├── Dockerfile.frontend
├── deploy.sh                          # Deployment scripts
├── build.sh                           # Build scripts
├── CLAUDE.md                          # Project documentation
├── PRD.md                             # Product requirements
├── design_guidelines.json             # Design system spec
└── README.md                          # Project overview
```

---

## 🚀 API Endpoints

### Authentication
```http
POST /api/auth/register        # Create account
POST /api/auth/login           # Login
GET  /api/auth/me              # Get current user
POST /api/auth/logout          # Logout
```

### Phase 1 Development System
```http
GET  /api/development/stages                    # Get 4 stages
GET  /api/development/tracks                    # Get all 6 tracks
GET  /api/development/tracks/{track_id}         # Get track with modules
GET  /api/development/content/{content_id}      # Get content item
POST /api/development/content/{content_id}/complete  # Mark complete
GET  /api/development/breakdowns                # Get 15 deal breakdowns
GET  /api/development/quickwins                 # Get 20 quick wins
GET  /api/development/progress                  # Get user progress + readiness
GET  /api/development/badges                    # Get 11 badges
GET  /api/development/bookmarks                 # Get user bookmarks
POST /api/development/bookmarks                 # Create bookmark
```

### AI System
```http
POST /api/ai-assistant/chat/enhanced                  # Chat with full context
GET  /api/ai-assistant/suggestions/proactive          # Proactive suggestions
POST /api/ai-assistant/sentiment/analyze              # Sentiment analysis
GET  /api/ai-assistant/roleplay/scenarios             # Role playing scenarios
POST /api/ai-assistant/roleplay/start                 # Start roleplay session
POST /api/ai-assistant/knowledge/upload-pdf           # Upload + AI processing
POST /api/ai-assistant/knowledge/upload               # Upload knowledge
GET  /api/ai-assistant/knowledge/items                # Get knowledge items
GET  /api/ai-assistant/knowledge/item/{item_id}       # Get item detail
GET  /api/ai-assistant/notifications                  # Get notifications
POST /api/ai-assistant/notifications/{id}/mark-read   # Mark as read
GET  /api/ai-assistant/memory/recent                  # Get recent memories
GET  /api/ai-assistant/preferences                    # Get user preferences
```

### Branding
```http
GET  /api/branding/config                    # Get active configuration
GET  /api/branding/config/all                # Get all configurations
GET  /api/branding/config/{config_id}        # Get config by ID
POST /api/branding/config                    # Create configuration
PUT  /api/branding/config/{config_id}        # Update configuration
DELETE /api/branding/config/{config_id}      # Delete configuration
POST /api/branding/config/{config_id}/activate  # Activate theme
POST /api/branding/config/seed-default       # Create default config
```

### Organizations (Multi-tenancy)
```http
GET   /api/organizations                     # Get organizations
POST  /api/organizations                     # Create organization
GET   /api/organizations/{org_id}            # Get organization by ID
PUT   /api/organizations/{org_id}            # Update organization
POST  /api/organizations/{org_id}/branding   # Update branding
```

### Admin (Public - No Auth for Testing)
```http
GET  /api/ai-assistant/public/admin/team-stats    # Team statistics
GET  /api/ai-assistant/public/knowledge/items     # Knowledge base
POST /api/ai-assistant/public/knowledge/upload-pdf # Upload PDF
POST /api/ai-assistant/public/chat                # Chat (no auth)
POST /api/ai-assistant/public/files/upload        # Upload files
GET  /api/ai-assistant/public/files/list          # List files
DELETE /api/ai-assistant/public/files/{file_id}   # Delete file
```

---

## 🎨 Design System

### Colores Principales

```css
:root {
  /* Backgrounds */
  --color-background: #020204;        /* Negro profundo */
  --color-card-background: #0A0A0B;  /* Fondo tarjetas */
  
  /* Accents */
  --color-primary: #D4AF37;          /* Oro premium - usar SOLO para high-value actions */
  --color-secondary: #1E3A8A;        /* Azul navy */
  --color-accent: #F59E0B;           /* Naranja vibrante */
  
  /* Text */
  --color-text-main: #F8FAFC;        /* Blanco suave - NUNCA usar #FFFFFF puro */
  --color-text-muted: #94A3B8;       /* Gris secondary */
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%);
  --gradient-secondary: linear-gradient(180deg, #020204 0%, #0F172A 100%);
}
```

### Tipografía

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Component Guidelines

✅ **DO:**
- Components MUST use named exports: `export const ComponentName = ...`
- Pages MUST use default exports: `export default function PageName() {...}`
- All cards need subtle 1px border using `white/10` or `white/5`
- Use asymmetric, bento-style grids
- Use 2-3x more spacing than feels comfortable
- Every interaction needs micro-animations (hover, transitions, entrance)
- Check `frontend/src/components/ui/` before creating new components

❌ **DON'T:**
- Never use pure white (#FFFFFF) text on black
- Never use generic centered layouts without purpose
- Never create duplicate components
- Never skip loading and error states
- Never use gold (#D4AF37) for common actions (reserve for high-value)

### Layout Patterns

```jsx
// Bento-style grid example
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-2">
    {/* Main content - larger */}
  </div>
  <div>
    {/* Secondary content - smaller */}
  </div>
</div>

// Card with border example
<div className="bg-white/5 border border-white/10 rounded-lg p-6">
  {/* Card content */}
</div>
```

---

## 📈 Database Collections

### Core Collections
```javascript
users                  // User accounts with authentication
user_progress          // Training progress, streaks, badges, readiness scores
user_activity          // Activity tracking for analytics
bookmarks              // Watch Later items with tags
posts                  // Community posts
events                 // Calendar events
resources              // Downloadable files
courses                // Training courses (legacy)
lessons                // Course lessons (legacy)
daily_sales            // Daily sales records
financial_goals        // Monthly financial goals
daily_attributes       // Daily attribute tracking
```

### AI System Collections
```javascript
conversation_memory    // Long-term conversation memory
user_preferences       // Learned user preferences
sentiment_analysis     // Sentiment tracking
proactive_suggestions  // Generated suggestions
skill_gaps             // Identified skill gaps
roleplay_sessions      // Role playing session data
knowledge_base         // Uploaded and generated content
notifications          // User notifications
```

### Branding & Organizations
```javascript
branding_configs       // Branding configurations
organizations          // Organization data
organization_users     // Organization memberships
admin_files            // Uploaded admin files
```

---

## 🧪 Testing & Calidad

### Backend Testing (pytest)
- **Location**: `backend/tests/test_phase1_api.py`
- **Coverage**: ~40%
- **Tests**: authentication, Phase 1 API, progress tracking, badges, bookmarks
- **Run**: `pytest` or `pytest -v` or `pytest --cov=. --cov-report=html`

### Frontend Testing (Jest + React Testing Library)
- **Location**: `frontend/src/__tests__/`
- **Coverage**: ~5%
- **Tests**: AuthContext, DashboardPage, TopProducerPath
- **Run**: `yarn test` (watch) or `yarn test:ci` (CI mode)
- **Target**: 70%+ overall coverage

---

## 🚀 Development Commands

### Docker (Recommended)
```bash
# Start all services
./deploy.sh deploy
# or: docker-compose up -d

# Check health
./deploy.sh health

# View logs
./deploy.sh logs

# Stop all
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Backend
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Lint
flake8 server.py phase1_routes.py

# Format
black server.py phase1_routes.py

# Type check
mypy server.py phase1_routes.py

# Run tests
pytest

# Seed content
python seed_coaching.py
python seed_knowledge_hub.py
python seed_branding.py
```

### Frontend
```bash
cd frontend

# Install dependencies
yarn install

# Run development server
yarn start

# Build for production
yarn build

# Run tests
yarn test              # Watch mode
yarn test:ci           # CI mode
yarn test:ci -- --coverage  # With coverage
```

---

## 🎯 Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@vcsa.com | admin123 | admin |
| Demo User | demo@vcsa.com | demo123 | member |

---

## 📊 Recent Developments

### Latest Commits (Git Log)
1. **Mobile PWA UX Improvements** - Service worker, manifest, mobile optimizations
2. **AI System Phase 3** - Knowledge management + AI components integration
3. **Branding Module** - Complete personalization system with 8 configuration categories
4. **Multi-tenancy** - Organization support with custom branding per org

### Features en Desarrollo
- [ ] Pre-Tour Tactical Mode UI (Dashboard widget)
- [ ] Stage Gate Assessment UI
- [ ] Deal Simulator (interactive scenarios)
- [ ] Real video URLs (replace 35/36 placeholders)

---

## 🔐 Environment Variables

### Backend (.env)
```bash
MONGO_URL=mongodb://...
DB_NAME=vcsa
STRIPE_API_KEY=sk_test_...
SENTRY_DSN=...  # Optional
```

### Frontend (.env)
```bash
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 📚 Documentation

### Project Documentation
- `CLAUDE.md` - Complete project guide (this file)
- `PRD.md` - Product requirements document
- `design_guidelines.json` - Full design system spec
- `CONTENT_NEEDED.md` - List of 35 videos needed
- `DEPLOY.md` - Deployment guide
- `TESTING.md` - Testing guide

### Wiki (docs/wiki/)
- `Home.md` - Wiki home
- `Getting-Started.md` - Initial setup
- `Architecture.md` - System architecture
- `Frontend.md` - Frontend development
- `Backend.md` - Backend development
- `Database.md` - Database schema
- `API-Reference.md` - API documentation
- `DesignSystem.md` - Design system details
- `Docker.md` - Docker deployment

---

## 🎯 Key Design Principles

1. **Daily Usage Goal**: Pre-Tour Tactical Mode is key to making this a daily tool
2. **Strategic Direction**: Building a "Sales Operating System" not just a course platform
3. **Content Structure**: All modules have "Key Move" - one actionable takeaway
4. **Visual Style**: Dark luxury, premium feel, depth through layered design
5. **Component Reuse**: Always check `frontend/src/components/ui/` before creating new components
6. **Mobile First**: Optimized for mobile usage in the sales floor

---

## 🔮 Future Roadmap

### Phase 2: Manager Tools
- [ ] Team Training Modules
- [ ] Manager Dashboard
- [ ] New Rep Onboarding Structure
- [ ] Sales Meeting Resources
- [ ] Coaching Frameworks

### Phase 3: Leadership Network
- [ ] Leadership Conversations section
- [ ] Strategic Trend Discussions
- [ ] Guest Expert Sessions
- [ ] Leader-Only Community

### Phase 4: AI Multiplier
- [ ] AI Sales Coach (objection practice with voice feedback)

---

## 🤖 Prompt para Agente TRAE

Si quieres crear un agente especializado en TRAE para trabajar en este proyecto, usa este prompt:

```
## Smart Generate Agent - VCSA Development Assistant

### Role
You are an expert full-stack developer specialized in the VCSA (Vacation Club Sales Academy) platform. You have deep knowledge of the entire codebase, architecture, and best practices for this React 19 + FastAPI + MongoDB application.

### Primary Responsibilities

1. **Feature Development**: Implement new features following existing architecture patterns
2. **Code Quality**: Write clean, maintainable code with proper error handling
3. **UI/UX Consistency**: Follow the dark premium luxury design system strictly
4. **Testing**: Write tests for new components and endpoints
5. **Documentation**: Update CLAUDE.md and create documentation for new features

### Technical Stack

**Frontend:** React 19, Tailwind CSS, shadcn/ui, Framer Motion, React Router v7
**Backend:** FastAPI, MongoDB (motor), Stripe, Ollama LLM
**Design:** Dark luxury theme (#020204 background, #D4AF37 gold accents)

### When to Use This Agent

Use this agent when you need to:
- Add new features to the VCSA platform
- Fix bugs in existing functionality
- Refactor code for better performance
- Add new pages or components
- Implement API endpoints
- Add database collections or migrations
- Integrate new third-party services
- Enhance the AI assistant capabilities
- Improve the branding/organization system
- Add tests for existing code

### Key Patterns

1. **Check existing components** in `frontend/src/components/ui/` before creating new ones
2. **Use established API structure** with `/api` prefix and proper error responses
3. **Follow authentication pattern** with `require_auth` dependency
4. **Implement proper loading states** and error handling
5. **Use BrandingContext** for dynamic styling
6. **Write async/await queries** with motor driver
7. **Properly format dates** using ISO format and timezone awareness
8. **Named exports for components**: `export const ComponentName = ...`
9. **Default exports for pages**: `export default function PageName() {...}`

### Quality Standards

- **No generic layouts**: Use asymmetric, bento-style grids
- **No pure white text**: Use #F8FAFC or #F1F5F9
- **No centered content without purpose**: Be intentional with layout
- **Micro-animations**: Every interaction needs hover, transition, entrance
- **Error boundaries**: Implement proper error handling
- **Responsive design**: Mobile-first approach

### Before Starting Work

1. Read the relevant existing code files
2. Check for similar patterns already implemented
3. Verify design system requirements
4. Plan the database schema changes if needed
5. Consider the impact on existing features

### Important Notes

- Most videos are currently placeholders (2/36 provided)
- The platform is positioned as a "Sales Operating System" not just a course platform
- Daily usage is key: Pre-Tour Tactical Mode is the most important feature
- Always use shadcn/ui components from `frontend/src/components/ui/`
- Never create duplicate components
```

---

## 📞 Quick Reference

### URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MongoDB**: mongodb://localhost:27017

### Key Files to Edit
- **Backend**: `server.py`, `phase1_routes.py`, `ai_assistant_enhanced.py`
- **Frontend**: `App.js`, `src/pages/`, `src/components/`
- **Design**: `tailwind.config.js`, `design_guidelines.json`
- **Docker**: `docker-compose.yml`, `deploy.sh`

### Common Tasks

**Add New Page:**
1. Create in `frontend/src/pages/` with default export
2. Add route in `App.js`
3. Wrap with DashboardLayout if needed
4. Follow dark luxury design system

**Add API Endpoint:**
1. Create route in appropriate backend file
2. Use `require_auth` if protected
3. Implement error handling
4. Add Pydantic models
5. Document in CLAUDE.md

**Add Database Collection:**
1. Define schema/structure
2. Create seed script if needed
3. Add CRUD operations in routes
4. Update documentation

---

**Last Updated**: 2026-04-02
**Project Status**: Active Development
**Version**: 3.0.0+
**Repository**: [GitHub URL]
