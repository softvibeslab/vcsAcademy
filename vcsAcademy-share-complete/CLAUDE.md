# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VCSA (Vacation Club Sales Academy)** is a premium sales training platform for vacation club/timeshare sales professionals. It's designed as a "Sales Operating System" - a daily tool that reps use on the sales floor, not just a course platform.

**Strategic Positioning**: The Performance Operating System for Vacation Club Sales Teams

**Target Users**:
- Sales Representatives (primary - improve floor performance)
- Sales Managers (Phase 2 - team training tools)
- Industry Leaders (Phase 3 - strategic content)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + Tailwind CSS + Framer Motion + shadcn/ui |
| Backend | FastAPI (Python) |
| Database | MongoDB (via motor - async driver) |
| Authentication | Email/Password + Google OAuth (Emergent Auth) |
| Payments | Stripe |

## Development Commands

### Quick Start (Docker - Recommended)

```bash
# Start all services (MongoDB, Backend, Frontend)
./deploy.sh deploy
# or manually: docker-compose up -d

# Check service health
./deploy.sh health

# View logs
./deploy.sh logs

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Backend (FastAPI + Python)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run development server (uvicorn)
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Lint code
flake8 server.py phase1_routes.py

# Format code
black server.py phase1_routes.py

# Type check
mypy server.py phase1_routes.py

# Run tests
pytest                          # All tests
pytest -v                       # Verbose output
pytest tests/test_phase1_api.py::TestAuth::test_demo_user_login  # Single test
pytest --cov=. --cov-report=html  # With coverage

# Seed content database
python seed_coaching.py         # Seed coaching content
python seed_knowledge_hub.py    # Seed knowledge hub content
```

### Frontend (React + Craco)

```bash
cd frontend

# Install dependencies (using yarn as package manager)
yarn install

# Run development server
yarn start
# or npm start

# Build for production
yarn build
# or npm run build

# Run tests
yarn test                       # Watch mode
yarn test:ci                    # CI mode (run once)
yarn test:ci -- --coverage      # With coverage
```

## Architecture

### Backend Structure

**Core Files**:
- `backend/server.py` - Main FastAPI app, authentication, core routes (auth, users, courses, lessons, community, events, resources, admin)
- `backend/phase1_routes.py` - Phase 1 Development System content (stages, tracks, modules, deal breakdowns, quick wins, badges, progress tracking)

**API Router Structure**:
- Main router: `/api` prefix
- Phase 1 router: `/api/development` prefix

**Database Collections**:
- `users` - User accounts with authentication
- `user_progress` - Training progress, streaks, badges, readiness scores
- `user_activity` - Activity tracking for analytics
- `bookmarks` - Watch Later items with tags
- `posts` - Community posts
- `events` - Calendar events
- `resources` - Downloadable files
- `courses` - Training courses (legacy)
- `lessons` - Course lessons (legacy)

### Frontend Structure

**Entry Point**:
- `frontend/src/App.js` - Main router with auth context, protected routes

**Pages** (`frontend/src/pages/`):
- `LandingPage.jsx` - Public marketing page
- `LoginPage.jsx` / `RegisterPage.jsx` - Authentication
- `DashboardPage.jsx` - Main dashboard
- **Phase 1 Development System**:
  - `TopProducerPath.jsx` - 4-stage progression dashboard
  - `TrackDetailPage.jsx` - Track modules + video player
  - `DealBreakdownsPage.jsx` - Deal breakdown scenarios
  - `QuickWinsPage.jsx` - Tactical knowledge library
- **Additional Learning**:
  - `CoachingPage.jsx` - Coaching content page
  - `MasterclassesPage.jsx` - Masterclasses library
- `CoursesPage.jsx` / `CourseDetailPage.jsx` - Legacy training library
- `CommunityPage.jsx` - Community feed
- `EventsPage.jsx` - Events calendar
- `ResourcesPage.jsx` - Downloads
- `MembershipPage.jsx` - Subscription tiers
- `ProposalPage.jsx` - Proposal/prospectus page
- `ProfilePage.jsx` - User profile
- `AdminPage.jsx` - Admin panel

**Components** (`frontend/src/components/`):
- `layout/DashboardLayout.jsx` - Dashboard layout wrapper
- `ui/` - shadcn/ui components (use these for new UI)

### Auth & Session Management

**Frontend**:
- Auth context in `App.js` with `useAuth()` hook
- Protected routes via `<ProtectedRoute>` wrapper
- OAuth callback handling in `AuthCallback.jsx`

**Backend**:
- JWT-based authentication with http-only cookies
- `require_auth` dependency for protected routes
- Google OAuth via Emergent Auth integration

## Design System

**Theme**: Dark premium luxury (refer to `design_guidelines.json` for full specs)

**Colors**:
- Background: `#020204`
- Gold accent: `#D4AF37` (use ONLY for high-value actions)
- Navy: `#1E3A8A`
- Text: `#F1F5F9` (primary), `#94A3B8` (secondary)

**Typography**:
- Headings: Playfair Display (import from Google Fonts)
- Body: DM Sans (import from Google Fonts)
- Mono: JetBrains Mono (for data, stats)

**Component Guidelines**:
- Use shadcn/ui components from `frontend/src/components/ui/`
- Components MUST use named exports: `export const ComponentName = ...`
- Pages MUST use default exports: `export default function PageName() {...}`
- All cards need subtle 1px border using white/10 or white/5
- Avoid generic centered layouts - use asymmetric, bento-style grids
- Use 2-3x more spacing than feels comfortable
- Every interaction needs micro-animations (hover, transitions, entrance)

**Critical**: Never use pure white (#FFFFFF) text on black. Use `#F8FAFC` or `#F1F5F9`.

## Phase 1: Top Producer Development System

### Content Architecture (4 layers)

1. **Content Layer** - Universal content model (videos, breakdowns, quick wins)
2. **Track Layer** - 6 tracks with 6 modules each (36 total)
3. **Engagement Layer** - Activity tracking, bookmarks with tags
4. **Gamification Layer** - Points, badges, readiness score, streaks

### 4-Stage Progression

- **Stage 1: New Rep** - Build foundation (150 pts, 1-2 weeks)
- **Stage 2: Developing Rep** - Execute consistently (300 pts, 2-4 weeks)
- **Stage 3: Performing Rep** - Close consistently (500 pts, 4-8 weeks)
- **Stage 4: Top Producer** - Elite performer (750 pts, 8-12 weeks)

### 6 Training Tracks

1. Pro Mindset (6 modules)
2. Discovery & Control (6 modules)
3. Value Architecture (6 modules)
4. Decision Management (6 modules)
5. Objection Mastery (6 modules)
6. Post-Decision Integrity (6 modules)

### Key Algorithms

**Readiness Score**:
```
= (Video Completion × 40%) +
  (Track Progress × 30%) +
  (Quick Wins Applied × 10%) +
  (Breakdowns Reviewed × 10%) +
  (Training Streak × 10%)
```

**Points System**:
- 10 points per training module
- 5 points per deal breakdown
- 3 points per quick win

### Key Features

- **Key Move**: Every content item has one actionable takeaway
- **Smart Bookmarks**: Tagged for Pre-Tour Mode (before_tour, closing_help, objections, etc.)
- **Training Streak**: 24-hour window for consecutive days
- **Badges**: 11 badges with auto-award logic
- **Watch Later**: Save content for later with custom tags

## Important API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Phase 1 Development System
- `GET /api/development/stages` - Get 4 stages
- `GET /api/development/tracks` - Get all 6 tracks
- `GET /api/development/tracks/{track_id}` - Get track with modules
- `GET /api/development/content/{content_id}` - Get content item
- `POST /api/development/content/{content_id}/complete` - Mark complete
- `GET /api/development/breakdowns` - Get 15 deal breakdowns
- `GET /api/development/quickwins` - Get 20 quick wins
- `GET /api/development/progress` - Get user progress + readiness score
- `GET /api/development/badges` - Get 11 badges
- `GET /api/development/bookmarks` - Get user bookmarks
- `POST /api/development/bookmarks` - Create bookmark

## Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@vcsa.com | admin123 | admin |
| Demo User | demo@vcsa.com | demo123 | member |

## Environment Variables

**Backend** (`backend/.env`):
```
MONGO_URL=mongodb://...
DB_NAME=vcsa
STRIPE_API_KEY=sk_test_...
```

**Frontend** (`frontend/.env`):
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Docker & Deployment

### Local Development with Docker

The project includes Docker support for streamlined local development:

```bash
# Start all services (MongoDB, Backend, Frontend)
./deploy.sh deploy

# Access services
# Frontend: http://localhost
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
# MongoDB: mongodb://localhost:27017
```

### Deployment Scripts

- `./deploy.sh deploy` - Deploy all services
- `./deploy.sh health` - Check service health
- `./deploy.sh logs` - View service logs
- `./deploy.sh backup` - Backup database
- `./deploy.sh stop` - Stop all services
- `./build.sh docker` - Build Docker images

### Environment Variables for Docker

Create `.env` in project root (or use defaults in docker-compose.yml):

```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=changeme
DB_NAME=vcsa
REACT_APP_BACKEND_URL=http://localhost:8000
STRIPE_API_KEY=sk_test_...
```

## Monitoring & Error Tracking

### Sentry Integration

The backend includes Sentry integration for error tracking and performance monitoring:

**Backend** (`backend/sentry_config.py`):
- Initialize Sentry in `server.py` by calling `init_sentry()`
- Set `SENTRY_DSN` environment variable to enable
- Configurable sampling rates for traces and profiles
- Integrations: FastAPI, MongoDB, Logging

**Frontend** (`frontend/src/sentry.js`):
- Browser error tracking
- Performance monitoring
- Session replay (optional)

### Health Checks

```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend health (when using nginx)
curl http://localhost/health
```

## Documentation

### Project Wiki

Comprehensive documentation is available in the `wiki/` directory:

- `wiki/Home.md` - Wiki home page
- `wiki/getting-started/Setup.md` - Initial setup guide
- `wiki/development/Architecture.md` - System architecture
- `wiki/development/Frontend.md` - Frontend development
- `wiki/development/Backend.md` - Backend development
- `wiki/development/Database.md` - Database schema
- `wiki/api/Development.md` - API reference
- `wiki/design/DesignSystem.md` - Design system details
- `wiki/deployment/Docker.md` - Docker deployment

### Additional Documentation

- `DEPLOY.md` - Comprehensive deployment guide
- `TESTING.md` - Testing guide (backend + frontend)
- `memory/PRD.md` - Product requirements document
- `design_guidelines.json` - Full design system spec (JSON)

## Key Design Principles

1. **Daily Usage Goal**: Pre-Tour Tactical Mode is key to making this a daily tool
2. **Strategic Direction**: Building a "Sales Operating System" not just a course platform
3. **Content Structure**: All modules have "Key Move" - one actionable takeaway
4. **Visual Style**: Dark luxury, premium feel, depth through layered design
5. **Component Reuse**: Always check `frontend/src/components/ui/` before creating new components

## Important Notes

- Video embedding: Use YouTube/Vimeo URLs (convert to embed format)
- Most modules currently use placeholder videos - 2/36 provided
- Content list: `CONTENT_NEEDED.md` (35 videos needed)
- PRD: `memory/PRD.md`
- Design guidelines: `design_guidelines.json` (full JSON spec)

## Content Seeding

The project includes seed scripts to populate the database with initial content:

```bash
cd backend

# Seed coaching content (tactical sales training)
python seed_coaching.py

# Seed knowledge hub content (educational resources)
python seed_knowledge_hub.py
```

**Note**: These scripts populate MongoDB with structured content for the coaching system and knowledge hub. Run them after setting up the database.

## Testing Infrastructure

### Backend Testing (pytest)

- Located in `backend/tests/test_phase1_api.py`
- Covers authentication, Phase 1 API, progress tracking, badges, bookmarks
- Run with `pytest` (see Development Commands above)
- See `backend/README_TESTS.md` for detailed testing guide

### Frontend Testing (Jest + React Testing Library)

- Located in `frontend/src/__tests__/`
- Test structure: `components/` and `pages/` directories
- Run with `yarn test` (watch mode) or `yarn test:ci` (CI mode)
- See `frontend/TESTING.md` for detailed testing guide

### Test Coverage

- Backend: ~40% coverage (authentication, Phase 1 API)
- Frontend: ~5% coverage (initial infrastructure)
- Target: 70%+ overall coverage

## Future Roadmap

- **Phase 2**: Manager Dashboard, Team Training Tools, Team Analytics
- **Phase 3**: Leadership Content, Private Community
- **Phase 4**: AI Sales Coach (objection practice with voice feedback)
