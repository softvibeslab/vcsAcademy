# VCSA - Vacation Club Sales Academy PRD

## Project Overview
Premium online education and community platform for vacation club/timeshare sales professionals. Designed to help sales reps, managers, and industry leaders become consistent top producers through structured sales training, community interaction, and live industry events.

## Strategic Positioning
**VCSA helps sales reps improve performance, gives sales managers structured resources to develop teams, and equips industry leaders with the insights and conversations needed to elevate the industry.**

### Three Pillars
1. **Top Producer Development System** - Rep performance engine
2. **Manager Performance Resource Center** - Team training tools (Future)
3. **Industry Leadership Network** - Strategic content (Future)

## Target Audience
- **Sales Representatives**: Primary users - improve performance on the floor
- **Sales Managers**: Operational users - train teams faster (Phase 2)
- **Industry Leaders**: Strategic users - elevate organizations (Phase 3)

## Architecture

### Tech Stack
- **Frontend**: React 19 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: Email/Password + Google OAuth (Emergent Auth)
- **Payments**: Stripe (VIP Membership subscriptions)

### Design System
- **Theme**: Dark premium luxury (black #020204, gold #D4AF37, navy #1E3A8A)
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **UI Components**: Radix UI / shadcn

## Phase 1: Top Producer Development System ✅

### Rep Journey (4 Stages)
- **Stage 1: New Rep** - Build foundation (150 pts, 1-2 weeks)
- **Stage 2: Developing Rep** - Execute with consistency (300 pts, 2-4 weeks)
- **Stage 3: Performing Rep** - Close consistently (500 pts, 4-8 weeks)
- **Stage 4: Consistent Top Producer** - Elite performer (750 pts, 8-12 weeks)

### Core Curriculum (6 Tracks, 36 Modules)
- [x] Track 1: Pro Mindset (6 modules)
- [x] Track 2: Discovery & Control (6 modules)
- [x] Track 3: Value Architecture (6 modules)
- [x] Track 4: Decision Management (6 modules)
- [x] Track 5: Objection Mastery (6 modules)
- [x] Track 6: Post-Decision Integrity (6 modules)

### Content Library
- [x] 36 Training Modules with Key Move for each lesson
- [x] 15 Deal Breakdowns (full scenario analysis)
- [x] 20 Quick Wins (tactical knowledge)

### Engagement Layer
- [x] Watch Later / Bookmarks with tags (before_tour, closing_help, etc.)
- [x] User Activity tracking for analytics
- [x] Training Streak (24h window)

### Gamification
- [x] Readiness Score algorithm (40% video + 30% track + 10% QW + 10% BD + 10% streak)
- [x] 11 Badges with automatic award logic
- [x] Stage gate completion checks
- [x] Points system (10 pts/module, 5 pts/breakdown, 3 pts/quick win)

### Features Implemented
- [x] Top Producer Path (guided journey UI)
- [x] 4-stage progression system
- [x] 6-track progress display
- [x] Current assignment block ("Your Next Step")
- [x] Milestone tracker
- [x] Stage badge display
- [x] Module completion tracking
- [x] Real Deal Breakdowns (5 scenarios)
- [x] Quick Wins Library (10 tactics)
- [x] Readiness Score calculation
- [x] Badge system (7 badges defined)
- [x] Points system for all actions

### Deal Breakdowns (5 Initial)
1. Lost Control After Price Reveal
2. The Missing Spouse Objection
3. The "Think About It" Collapse
4. Momentum Lost Mid-Presentation
5. Price Objection After Strong Value Build

### Quick Wins (10 Initial)
1. How to Recover After Losing Control
2. How to Answer "We Need to Think About It"
3. How to Create Urgency Without Pressure
4. How to Reset After Price Resistance
5. How to Handle "We're Just Looking"
6. How to Re-engage a Quiet Buyer
7. How to Respond to "That's Too Expensive"
8. How to Handle the Missing Spouse
9. How to Prevent Early Price Questions
10. How to Build Value Before Numbers

## Legacy Features (Pre-Phase 1) ✅
- Landing Page
- Authentication (Email/Password + Google OAuth)
- User Dashboard
- Training Library (courses page)
- Community Feed
- Events System
- Resource Library
- Membership/Payments (Stripe)
- Admin Panel

## API Endpoints

### Phase 1 Development System
- GET /api/development/stages
- GET /api/development/tracks
- GET /api/development/tracks/:id
- GET /api/development/modules
- GET /api/development/badges
- GET /api/development/breakdowns
- GET /api/development/quickwins
- GET /api/development/progress
- POST /api/development/modules/:id/complete
- POST /api/development/breakdowns/:id/review
- POST /api/development/quickwins/:id/apply

## Test Credentials
- **Admin**: admin@vcsa.com / admin123
- **Demo User**: demo@vcsa.com / demo123

---

## P0 - Critical (Completed)
- [x] Phase 1 Shell: Top Producer Path UI
- [x] Phase 1 Curriculum architecture
- [x] Decision Management Track (Track 4)
- [x] Deal Breakdowns library
- [x] Quick Wins library
- [x] Measurement layer (basic)
- [x] Video embedding for training modules (YouTube/Vimeo support)

## P1 - High Priority (Completed)
- [x] Content Layer architecture (36 modules populated)
- [x] All 15 Deal Breakdowns with full analysis
- [x] All 20 Quick Wins with examples
- [x] Readiness Score algorithm
- [x] Badge award logic (11 badges)
- [x] Training Streak tracking
- [x] Watch Later / Bookmarks feature
- [x] User Activity tracking
- [x] "Key Move" for each lesson
- [x] Pre-Tour Tactical Mode API

## P2 - Next Sprint (Current Focus)
- [ ] Pre-Tour Tactical Mode UI (Dashboard widget)
- [ ] Stage gate assessment UI
- [ ] Badge display/award animations
- [ ] Deal Simulator (interactive scenarios)
- [ ] Real video URLs (replace placeholders)

## P2 - Phase 2: Manager Tools
- [ ] Team Training Modules
- [ ] Manager Dashboard
- [ ] New Rep Onboarding Structure
- [ ] Sales Meeting Resources
- [ ] Coaching Frameworks

## P3 - Phase 3: Leadership Network
- [ ] Leadership Conversations section
- [ ] Strategic Trend Discussions
- [ ] Guest Expert Sessions
- [ ] Leader-Only Community

## P4 - AI Multiplier
- [ ] AI Sales Coach (practice layer)

---

## Last Updated
- **Date**: March 10, 2026
- **Status**: P1 Sprint Complete - Content Population & Engagement Layer
- **Version**: 3.0.0
- **Recent Changes**:
  - Complete content architecture refactor (Content Layer abstraction)
  - Populated 36 modules across 6 tracks with key_move for each
  - Added 15 Deal Breakdowns (full analysis for each)
  - Added 20 Quick Wins (tactical knowledge library)
  - Implemented Watch Later / Bookmarks feature with tags
  - User Activity tracking for analytics
  - Training Streak tracking with 24h window
  - Readiness Score algorithm (40% video + 30% track + 10% QW + 10% BD + 10% streak)
  - 11 Badge definitions with award logic
  - Stage gate completion checks
  - "Key Move From This Lesson" UI element
  - Pre-Tour Tactical Mode API endpoint
