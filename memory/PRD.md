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

### Core Curriculum (6 Tracks, 34 Modules)
- [x] Track 1: Pro Mindset (5 modules, 59 min)
- [x] Track 2: Discovery & Control (5 modules, 75 min)
- [x] Track 3: Value Architecture (5 modules, 75 min)
- [x] Track 4: Decision Management (6 modules, 95 min) - CRITICAL TRACK
- [x] Track 5: Objection Handling (8 modules, 119 min)
- [x] Track 6: Post-Decision Integrity (5 modules, 62 min)

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

## P1 - High Priority (Next Sprint)
- [ ] Populate all 36 modules across 6 tracks
- [ ] Add remaining 10 Deal Breakdowns (15 total)
- [ ] Add remaining 10 Quick Wins (20 total)
- [ ] Stage assessment gates
- [ ] Badge award logic
- [ ] Training streak tracking
- [ ] Readiness Score algorithm finalization

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
- **Date**: March 9, 2026
- **Status**: Phase 1 Video Embedding Complete
- **Version**: 2.1.0
- **Recent Changes**:
  - Fixed JSX syntax error in TrackDetailPage.jsx
  - Implemented YouTube video embedding with responsive player
  - Added "Introduction: The Pro Mindset" lesson with video
  - Added `type` field to Module schema for future content types
