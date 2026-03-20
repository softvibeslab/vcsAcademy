# VCSA Features Quick Reference

Cheat sheet for all VCSA platform features.

---

## 🎯 Phase 1: Top Producer Development System

### 4 Stages

| Stage | Name | Points | Duration | Tracks |
|-------|------|--------|----------|--------|
| 1 | New Rep 🌱 | 150 | 1-2 weeks | 1-2 |
| 2 | Developing Rep 📈 | 300 | 2-4 weeks | 3-4 |
| 3 | Performing Rep ⚡ | 500 | 4-8 weeks | 5-6 |
| 4 | Top Producer 👑 | 750 | 8-12 weeks | All |

### 6 Training Tracks (36 Modules)

| # | Track | Modules | Focus |
|---|-------|---------|-------|
| 1 | Pro Mindset | 6 | Sales psychology, confidence |
| 2 | Discovery & Control | 6 | Taking control, questioning |
| 3 | Value Architecture | 6 | Building value, urgency |
| 4 | Decision Management | 6 | Guiding decisions, closing |
| 5 | Objection Mastery | 6 | Handling any objection |
| 6 | Post-Decision Integrity | 6 | Relationships, referrals |

### Content Libraries

**15 Deal Breakdowns**:
- 5 Lost Control Situations
- 4 Objection Failures
- 3 Closing Mistakes
- 3 Post-Sale Issues

**20 Quick Wins**:
- 4 Pre-Tour Preparation
- 4 Discovery & Opening
- 4 Value Building
- 4 Objection Handling
- 4 Closing Techniques

---

## 🎮 Gamification

### Points System

| Action | Points |
|--------|--------|
| Complete Module | 10 |
| Review Breakdown | 5 |
| Apply Quick Win | 3 |
| Daily Login | 1 |
| Perfect Week | 20 |

### Badges (11 Total)

**Completion** (5):
- 🎯 First Steps
- 🌱 Foundation Builder (Stage 1)
- 📈 Rising Star (Stage 2)
- ⚡ Peak Performer (Stage 3)
- 👑 Top Producer (Stage 4)

**Engagement** (3):
- 🔥 Week Warrior (7-day streak)
- ⚡ Two Week Titan (14-day streak)
- 👑 Monthly Master (30-day streak)

**Achievement** (3):
- 📊 Deal Analyst (all breakdowns)
- 🎯 Tactician (all quick wins)
- 💯 Ready for Anything (100% readiness)

### Readiness Score Formula

```
= (Video Completion × 40%) +
  (Track Progress × 30%) +
  (Quick Wins Applied × 10%) +
  (Breakdowns Reviewed × 10%) +
  (Training Streak × 10%)
```

**Ranges**:
- 0-25%: Novice
- 26-50%: Developing
- 51-75%: Performing
- 76-100%: Top Producer

---

## 🏢 Multi-Tenant System

### Organization Hierarchy

```
Organization
└── School 1
    ├── Students
    ├── Courses
    └── Settings
└── School 2
    ├── Students
    ├── Courses
    └── Settings
```

### Roles

| Role | Org | School | Description |
|------|-----|--------|-------------|
| org_admin | ✅ | ✅ | Full control |
| school_admin | ❌ | ✅ | School control |
| member | ✅ | ✅ | Standard access |
| student | ❌ | ✅ | Learning only |

---

## 📚 Content Types

| Type | Description | Features |
|------|-------------|----------|
| Course | Structured learning | Multiple lessons, progress tracking |
| Masterclass | Expert presentation | Single video, expert info, rating |
| Workshop | Interactive training | Exercises, activities |
| Interview | Expert Q&A | Industry insights, tips |
| Coaching | Tactical training | Practical scripts, scenarios |

---

## 👥 Community Features

### Post Types

- **Success Stories** - Share wins
- **Questions** - Ask for help
- **Tips** - Share what works
- **Celebrations** - Announce achievements

### Interactions

- Like posts
- Comment with replies
- Follow users
- Share content
- Bookmark posts

---

## 🎓 Training Features

### Video Player

- YouTube/Vimeo embed
- Playback speed
- Quality selection
- Full-screen
- Position memory

### Progress Tracking

- Modules completed
- Time spent
- Streak information
- Last activity
- Next recommendations

---

## 🤖 AI Features

### AI Assistant

- Content recommendations
- Q&A support
- Practice scenarios
- Performance analysis

### AI Content Generation

- Lesson outlines
- Quiz questions
- Sales scenarios
- Script generation

---

## 💳 Memberships

| Feature | Free | VIP |
|---------|------|-----|
| Phase 1 Training | ✅ | ✅ |
| Community | ✅ | ✅ |
| Progress Tracking | ✅ | ✅ |
| Masterclasses | ❌ | ✅ |
| AI Assistant | ❌ | ✅ |
| Private Community | ❌ | ✅ |
| Monthly Coaching | ❌ | ✅ |
| Certificates | ❌ | ✅ |
| Priority Support | ❌ | ✅ |

---

## 🔧 Quick Commands

### Development

```bash
# Start all services
docker-compose up -d

# Backend only
cd backend && uvicorn server:app --reload

# Frontend only
cd frontend && yarn start

# Run tests
pytest                    # Backend
yarn test:ci             # Frontend
```

### Database

```bash
# Seed content
python seed_coaching.py
python seed_knowledge_hub.py

# Backup
mongodump --archive=backup.gz

# Restore
mongorestore --archive=backup.gz
```

---

## 📱 Key Pages

| Page | Route | Purpose |
|------|-------|---------|
| Landing | `/` | Marketing page |
| Login | `/login` | User authentication |
| Dashboard | `/dashboard` | Main dashboard |
| Top Producer Path | `/top-producer-path` | Phase 1 progression |
| Tracks | `/tracks/:id` | Track modules |
| Deal Breakdowns | `/breakdowns` | Scenario analysis |
| Quick Wins | `/quick-wins` | Tactical scripts |
| Community | `/community` | Social feed |
| Events | `/events` | Upcoming events |
| Resources | `/resources` | Downloadable files |
| Profile | `/profile` | User settings |
| Admin | `/admin` | Admin panel |
| Create School | `/create-school` | School onboarding |
| School Dashboard | `/school/:id` | School management |

---

## 🎨 Design System

### Colors

```css
--primary: #020204        /* Main background */
--secondary: #0A0A0F      /* Cards */
--gold: #D4AF37           /* Primary accent */
--navy: #1E3A8A           /* Secondary accent */
--emerald: #10B981        /* Stage 1 */
--blue: #3B82F6           /* Stage 2 */
--amber: #F59E0B          /* Stage 3 */
```

### Typography

```css
--font-heading: 'Playfair Display', serif;
--font-body: 'DM Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Spacing

Use 2-3x more space than feels comfortable:
- Cards: 1.5rem padding
- Sections: 6rem vertical spacing
- Elements: 2rem gaps

---

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vcsa.com | admin123 |
| User | demo@vcsa.com | demo123 |

---

## 📊 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Development
- `GET /api/development/stages`
- `GET /api/development/tracks`
- `GET /api/development/progress`
- `POST /api/development/modules/:id/complete`

### Organizations
- `POST /api/organizations`
- `GET /api/organizations`
- `POST /api/organizations/:id/schools`
- `PUT /api/schools/:id`

---

## 💡 Pro Tips

### Daily Routine
1. Morning: Check progress (5 min)
2. Before Tour: Watch Later (2 min)
3. After Tour: Note learnings (5 min)
4. Evening: Complete modules (15 min)

### Weekly Goals
- Complete 3-4 modules
- Review 2-3 breakdowns
- Apply 2-3 quick wins
- Post in community

### Success Habits
- Maintain training streak
- Use Pre-Tour Tactical Mode
- Share wins in community
- Celebrate badge unlocks

---

**Version**: 3.0.0
**Last Updated**: March 20, 2026

For complete documentation, see [All Features](AllFeatures.md)
