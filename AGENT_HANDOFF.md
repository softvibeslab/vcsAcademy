# VCSA - Vacation Club Sales Academy
## Agent Handoff Document

---

## Project Overview

**VCSA** is a premium sales training platform for vacation club/timeshare sales professionals. It's designed as a **Sales Operating System** (not just a course platform) with the goal of becoming the daily tool reps use on the sales floor.

**Strategic Positioning**: The Performance Operating System for Vacation Club Sales Teams

**Target Users**:
- Sales Representatives (primary - improve floor performance)
- Sales Managers (Phase 2 - team training tools)
- Industry Leaders (Phase 3 - strategic content)

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + Tailwind CSS + Framer Motion + shadcn/ui |
| Backend | FastAPI (Python) |
| Database | MongoDB |
| Authentication | Email/Password + Google OAuth (Emergent Auth) |
| Payments | Stripe (test keys in environment) |

**Preview URL**: `https://sales-training-hub-11.preview.emergentagent.com`

---

## Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@vcsa.com | admin123 | admin |
| Demo User | demo@vcsa.com | demo123 | member |

---

## Current State (What's Built)

### Phase 1: Top Producer Development System ✅ COMPLETE

**Core Features**:
- ✅ User authentication (email/password + Google OAuth)
- ✅ Top Producer Path (4-stage progression system)
- ✅ 6 Training Tracks with 36 modules total
- ✅ 15 Deal Breakdowns (scenario analysis)
- ✅ 20 Quick Wins (tactical knowledge)
- ✅ Video embedding (YouTube/Vimeo)
- ✅ "Key Move" takeaway for each lesson
- ✅ Watch Later / Bookmarks with tags
- ✅ Training Streak tracking
- ✅ Readiness Score algorithm
- ✅ 11 Badges with auto-award logic
- ✅ Points system
- ✅ Community feed
- ✅ Events calendar
- ✅ Resources/downloads
- ✅ Admin panel

**Pricing Tiers** (Recently Updated):
- **Standard (Free)**: Community, Part 1 Roadmap, AI scripts, Strategy call
- **Premium ($19/mo)**: Full Roadmap, ALL recordings, VIP coaching, Weekly calls
- **VIP ($299/mo)**: Unlimited 1-on-1 coaching, Master Closer Secrets

---

## File Structure

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI app, auth, core routes
│   ├── phase1_routes.py       # Phase 1 content (tracks, modules, breakdowns, quick wins)
│   ├── requirements.txt
│   └── .env                   # MONGO_URL, DB_NAME, secrets
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main router
│   │   ├── index.css          # Global styles, theme
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── TopProducerPath.jsx    # Main dashboard
│   │   │   ├── TrackDetailPage.jsx    # Track modules + video player
│   │   │   ├── DealBreakdownsPage.jsx
│   │   │   ├── QuickWinsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CommunityPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── ResourcesPage.jsx
│   │   │   ├── MembershipPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── AdminPage.jsx
│   │   └── components/
│   │       ├── layout/
│   │       │   └── DashboardLayout.jsx
│   │       └── ui/            # shadcn components
│   └── .env                   # REACT_APP_BACKEND_URL
├── memory/
│   └── PRD.md                 # Product requirements
└── CONTENT_NEEDED.md          # List of videos/images needed
```

---

## Key API Endpoints

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
- `GET /api/development/tactical/before-tour` - Pre-tour mode content

### Community
- `GET /api/community/posts` - Get posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/{post_id}/like` - Like post

### Events
- `GET /api/events` - Get events
- `POST /api/events/{event_id}/register` - Register for event

### Resources
- `GET /api/resources` - Get downloadable resources

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform stats

---

## Database Schema (MongoDB)

**Collections**:
- `users` - User accounts
- `user_progress` - Training progress, streak, badges
- `user_activity` - Activity tracking for analytics
- `bookmarks` - Watch Later items
- `posts` - Community posts
- `events` - Calendar events
- `resources` - Downloadable files

**User Progress Structure**:
```json
{
  "user_id": "user_xxx",
  "current_stage": 1,
  "tracks_progress": {"track_1": 16.67, "track_2": 0, ...},
  "content_completed": ["mod_1_1", "mod_2_6", "breakdown_1", "qw_1"],
  "badges_earned": ["badge_foundation"],
  "training_streak": 3,
  "streak_last_date": "2026-03-11",
  "readiness_score": 7,
  "total_training_time": 16
}
```

---

## Content Status

### Videos (2/36 provided)
- ✅ mod_1_1: Introduction: The Pro Mindset (`https://youtu.be/wDjfOy5aks8`)
- ✅ mod_2_6: The Transition Technique (`https://youtu.be/zkOG6Eyi9Cc`)
- ⏳ 34 modules using placeholder videos

### Full content list: `/app/CONTENT_NEEDED.md`

---

## Readiness Score Algorithm

```
Readiness Score = 
  (Video Completion × 40%) +
  (Track Progress × 30%) +
  (Quick Wins Applied × 10%) +
  (Breakdowns Reviewed × 10%) +
  (Training Streak × 10%)
```

---

## Design System

- **Theme**: Dark premium luxury
- **Colors**: 
  - Background: `#020204`
  - Gold accent: `#D4AF37`
  - Navy: `#1E3A8A`
  - Text: `#F1F5F9` (primary), `#94A3B8` (secondary)
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Components**: shadcn/ui at `/app/frontend/src/components/ui/`

---

## Upcoming Tasks (P2 Sprint)

1. **Pre-Tour Tactical Mode UI** - Dashboard widget for quick 5-min prep
2. **Deal Simulator** - Interactive scenario-based training
3. **Badge Display Animations**
4. **Stage Gate Assessment UI**
5. **Replace remaining placeholder videos**

---

## Future Roadmap

- **Phase 2**: Manager Dashboard, Team Training Tools, Team Analytics
- **Phase 3**: Leadership Content, Private Community
- **Phase 4**: AI Sales Coach (objection practice with voice feedback)

---

## Important Notes

1. **Strategic Direction**: Building a "Sales Operating System" not just a course platform
2. **Daily Usage Goal**: Pre-Tour Tactical Mode is key to making this a daily tool
3. **Content Structure**: All modules have "Key Move" - one actionable takeaway
4. **Deployment Ready**: Passed all health checks, ready for Kubernetes deployment

---

## Quick Commands

```bash
# View backend logs
tail -f /var/log/supervisor/backend.err.log

# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend

# Test API
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
curl -s "$API_URL/api/development/tracks" | python3 -m json.tool
```

---

## Contact Points

- **PRD**: `/app/memory/PRD.md`
- **Content List**: `/app/CONTENT_NEEDED.md`
- **Design Guidelines**: Follow existing dark luxury theme

---

*Last Updated: March 11, 2026*
