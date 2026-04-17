# Missing Features Technical Specification
## VCSA Current Version - Priority Implementation

**Target**: Complete the VCSA vision for current release (excluding Phase 4 AI features)

---

## Priority Matrix

| Feature | Complexity | Value | Priority |
|---------|------------|-------|----------|
| Coaching Sessions | Medium | High | **P0** |
| Masterclasses Structure | Low | High | **P1** |
| Knowledge Hub Enhancements | Low | Medium | **P2** |

---

## P0: Coaching & Strategy Sessions

### Overview
Add live/group coaching capabilities to the existing Events infrastructure

### User Stories
- As a member, I want to see upcoming group coaching calls in the events calendar
- As a member, I want to RSVP to coaching sessions and receive reminders
- As an admin, I want to create coaching session events with Zoom/meeting links
- As a member, I want to access recordings of past coaching sessions

### Technical Implementation

#### Backend Changes

**New Collection: `coaching_sessions`**
```python
{
    "_id": ObjectId,
    "title": str,                    # "Weekly Group Coaching - Objection Handling"
    "description": str,              # Detailed session description
    "session_type": str,             # "group", "q&a", "strategy_review"
    "scheduled_date": datetime,      # When it happens
    "duration_minutes": int,         # 60, 90, etc
    "host": {                        # Who's running it
        "name": str,
        "bio": str,
        "avatar_url": str
    },
    "meeting_link": str,             # Zoom/Google Meet URL
    "meeting_password": str,         # Optional
    "max_attendees": int,            # Optional cap
    "attendees": [ObjectId],         # List of user IDs who RSVP'd
    "recording_url": str,            # Added after session
    "slides_url": str,               # Optional presentation
    "topics": [str],                 # ["objections", "closing", "discovery"]
    "status": str,                   # "scheduled", "live", "completed", "cancelled"
    "created_at": datetime,
    "updated_at": datetime
}
```

**New API Routes** (add to `server.py` or create `coaching_routes.py`):
```python
# GET /api/coaching/sessions - List all upcoming sessions
# GET /api/coaching/sessions/{id} - Get session details
# POST /api/coaching/sessions - Create session (admin only)
# PUT /api/coaching/sessions/{id} - Update session (admin only)
# POST /api/coaching/sessions/{id}/rsvp - RSVP to session
# GET /api/coaching/sessions/{id}/recording - Get recording (if available)
```

**Implementation Notes**:
- Reuse existing Events collection structure where possible
- Add `session_type` field to distinguish coaching from regular events
- Integrate with existing notification system for reminders

#### Frontend Changes

**New Page**: `frontend/src/pages/CoachingPage.jsx`
```jsx
// Features:
// - List of upcoming coaching sessions
// - Filter by session type (group, q&a, strategy)
// - RSVP functionality
// - Calendar view
// - Past recordings section
```

**New Components**:
```
frontend/src/components/coaching/
├── CoachingCard.jsx          # Session preview card
├── SessionDetailModal.jsx    # Full session info + RSVP
├── RecordingPlayer.jsx       # Video player for past sessions
└── CoachingFilter.jsx        # Filter controls
```

**Navigation Update**:
Add "Coaching" to dashboard menu in `DashboardLayout.jsx`

### Database Indexes
```python
# coaching_sessions collection
db.coaching_sessions.create_index([("scheduled_date", 1), ("status", 1)])
db.coaching_sessions.create_index([("session_type", 1)])
db.coaching_sessions.create_index([("attendees", 1)])
```

### Mock Data for Development
```python
[
    {
        "title": "Weekly Group Coaching: Advanced Objection Handling",
        "description": "Live role-play and feedback on handling tough objections",
        "session_type": "group",
        "scheduled_date": "2026-03-20T15:00:00Z",
        "duration_minutes": 60,
        "host": {
            "name": "Sarah Mitchell",
            "bio": "15 years vacation club sales, $50M+ career sales",
            "avatar_url": "https://example.com/avatars/sarah.jpg"
        },
        "meeting_link": "https://zoom.us/j/123456789",
        "max_attendees": 50,
        "topics": ["objections", "closing", "roleplay"],
        "status": "scheduled"
    },
    {
        "title": "Q&A Friday: Your Questions, Real Answers",
        "description": "Open floor for any sales questions from the week",
        "session_type": "q&a",
        "scheduled_date": "2026-03-22T14:00:00Z",
        "duration_minutes": 45,
        "host": {
            "name": "Marcus Chen",
            "bio": "Sales Coach, VCSA Founder",
            "avatar_url": "https://example.com/avatars/marcus.jpg"
        },
        "meeting_link": "https://zoom.us/j/987654321",
        "topics": ["general", "strategy"],
        "status": "scheduled"
    }
]
```

---

## P1: Masterclasses Structure

### Overview
Better organize and surface expert-led training content (reusing existing content infrastructure)

### User Stories
- As a member, I want to browse masterclasses by topic/expert
- As a member, I want to see which masterclasses are trending or most popular
- As a member, I want to know the difficulty level of each masterclass

### Technical Implementation

#### Backend Changes

**Enhance Content Metadata** (update existing content structure):
```python
# Add to existing content items in tracks/modules
{
    "content_type": "masterclass",  # New: distinguish from regular modules
    "expert": {                     # New: who's teaching
        "name": str,
        "title": str,
        "company": str,
        "bio": str,
        "photo_url": str
    },
    "duration_minutes": int,        # New: video length
    "difficulty": str,              # New: "beginner", "intermediate", "advanced"
    "view_count": int,              # New: popularity tracking
    "rating": float,                # New: user ratings (optional)
    "recorded_date": datetime,      # New: when it was recorded
}
```

**New API Route**:
```python
# GET /api/development/masterclasses - Get all masterclass-type content
# Query params: ?topic=objections&expert=Sarah&difficulty=advanced&sort=popular
```

#### Frontend Changes

**New Page**: `frontend/src/pages/MasterclassesPage.jsx`
```jsx
// Features:
// - Filter by expert, topic, difficulty
// - Sort by: newest, popular, rating
// - Featured/Trending section
// - Expert profiles section
// - Similar to Netflix-style browsing
```

**New Components**:
```
frontend/src/components/masterclasses/
├── MasterclassCard.jsx        # Video preview with expert info
├── ExpertProfile.jsx          # Expert bio + their classes
├── MasterclassPlayer.jsx      # Enhanced video player with expert info
└── MasterclassFilters.jsx     # Topic/expert/difficulty filters
```

### Content Tagging

**Tag existing modules appropriately**:
```python
# Example: Tag certain modules as "masterclass" quality

# Track 2, Module 3: "Discovery Framework" → Masterclass
{
    "content_type": "masterclass",
    "expert": {
        "name": "James Rodriguez",
        "title": "VP of Sales, Premier Resorts",
        "company": "Premier Resorts International"
    },
    "difficulty": "intermediate",
    "topics": ["discovery", "qualification", "needs_analysis"]
}

# Track 5, Module 1: "Objection Psychology" → Masterclass
{
    "content_type": "masterclass",
    "expert": {
        "name": "Dr. Sarah Mitchell",
        "title": "Sales Psychologist",
        "company": "VCSA"
    },
    "difficulty": "advanced",
    "topics": ["objections", "psychology", "reframing"]
}
```

---

## P2: Knowledge Hub Enhancements

### Overview
Expand the Resources section into a comprehensive, searchable knowledge base

### User Stories
- As a member, I want to search across all resources (PDFs, frameworks, scripts)
- As a member, I want to filter resources by type (framework vs script vs case study)
- As a member, I want to see related resources when viewing content

### Technical Implementation

#### Backend Changes

**Enhanced Resources Collection**:
```python
{
    "_id": ObjectId,
    "title": str,
    "description": str,
    "resource_type": str,           # "framework", "script", "case_study", "tool", "template"
    "category": str,                # "discovery", "closing", "objections", etc
    "content": str,                 # Text content OR
    "file_url": str,                # URL to PDF/downloadable
    "file_type": str,               # "pdf", "docx", "xlsx", etc
    "tags": [str],                  # ["b2b", "veteran", "high_ticket"]
    "related_content": [ObjectId],  # Links to modules/breakdowns
    "difficulty": str,              # "beginner", "intermediate", "advanced"
    "usage_count": int,             # Popularity tracking
    "created_by": ObjectId,         # User ID (admin)
    "created_at": datetime,
    "updated_at": datetime
}
```

**New API Routes**:
```python
# GET /api/resources - Enhanced search/filter
# Query params: ?type=framework&category=closing&search=script&sort=popular

# GET /api/resources/{id}/related - Get related resources
```

#### Frontend Changes

**Update**: `frontend/src/pages/ResourcesPage.jsx`
```jsx
// Add:
// - Search bar
// - Filter by type (framework, script, case study, tool, template)
// - Filter by category (discovery, closing, etc.)
// - Sort by: newest, popular, A-Z
// - Related resources sidebar
```

**New Components**:
```
frontend/src/components/resources/
├── ResourceSearchBar.jsx      # Search input with autocomplete
├── ResourceFilters.jsx        # Type, category, difficulty filters
├── ResourceCard.jsx           # Resource preview with download
└── RelatedResources.jsx       # "You might also like" section
```

### Sample Knowledge Hub Content

```python
[
    {
        "title": "Discovery Question Framework",
        "description": "Structured questions to uncover prospect needs and budget",
        "resource_type": "framework",
        "category": "discovery",
        "content": "1. What's your current vacation experience?\n2. What would make it perfect?\n3. What's your budget range?\n...",
        "tags": ["discovery", "qualification", "essential"],
        "difficulty": "beginner"
    },
    {
        "title": "Price Objection Script Bank",
        "description": "20+ proven responses to 'it's too expensive'",
        "resource_type": "script",
        "category": "objections",
        "file_url": "https://s3.vcsa.com/resources/price-objections.pdf",
        "file_type": "pdf",
        "tags": ["objections", "price", "closing"],
        "difficulty": "intermediate"
    },
    {
        "title": "Case Study: From $50k to $500k in 6 Months",
        "description": "How one rep applied VCSA training to 10x their sales",
        "resource_type": "case_study",
        "category": "performance",
        "tags": ["motivation", "case_study", "transformation"],
        "difficulty": "beginner"
    }
]
```

---

## Implementation Order

### Sprint 1 (Week 1-2): Coaching Sessions
1. Backend: Create `coaching_sessions` collection + API routes
2. Frontend: Build `CoachingPage` + core components
3. Add navigation menu item
4. Seed mock data
5. Test RSVP flow

### Sprint 2 (Week 3): Masterclasses Structure
1. Backend: Add masterclass metadata to content model
2. Backend: Create `/api/development/masterclasses` endpoint
3. Frontend: Build `MasterclassesPage` with filters
4. Tag 5-10 existing modules as "masterclass"
5. Test browsing + filtering

### Sprint 3 (Week 4): Knowledge Hub
1. Backend: Enhance resources collection structure
2. Backend: Add search/filter API
3. Frontend: Update `ResourcesPage` with search/filters
4. Seed sample resources
5. Test search + related content

---

## API Endpoint Summary

### New Endpoints

```
# Coaching Sessions
GET    /api/coaching/sessions
GET    /api/coaching/sessions/{id}
POST   /api/coaching/sessions (admin)
PUT    /api/coaching/sessions/{id} (admin)
POST   /api/coaching/sessions/{id}/rsvp
DELETE /api/coaching/sessions/{id}/rsvp

# Masterclasses
GET    /api/development/masterclasses
GET    /api/development/masterclasses/{id}

# Knowledge Hub
GET    /api/resources (enhanced)
GET    /api/resources/{id}/related
```

---

## Database Changes Summary

### New Collections
- `coaching_sessions`

### Modified Collections
- `content` (add masterclass metadata fields)
- `resources` (enhance structure)

---

## Frontend Files Summary

### New Pages
- `frontend/src/pages/CoachingPage.jsx`
- `frontend/src/pages/MasterclassesPage.jsx`

### New Components
```
frontend/src/components/coaching/
├── CoachingCard.jsx
├── SessionDetailModal.jsx
├── RecordingPlayer.jsx
└── CoachingFilter.jsx

frontend/src/components/masterclasses/
├── MasterclassCard.jsx
├── ExpertProfile.jsx
├── MasterclassPlayer.jsx
└── MasterclassFilters.jsx

frontend/src/components/resources/
├── ResourceSearchBar.jsx
├── ResourceFilters.jsx
├── ResourceCard.jsx
└── RelatedResources.jsx
```

---

## Testing Checklist

### Coaching Sessions
- [ ] User can view upcoming sessions
- [ ] User can RSVP to session
- [ ] User can cancel RSVP
- [ ] Admin can create session
- [ ] Admin can update session
- [ ] Calendar view displays correctly
- [ ] Reminders sent (if notification system exists)

### Masterclasses
- [ ] User can browse all masterclasses
- [ ] Filtering by expert works
- [ ] Filtering by topic works
- [ ] Filtering by difficulty works
- [ ] Sorting (newest, popular) works
- [ ] Expert profile displays correctly

### Knowledge Hub
- [ ] Search returns relevant results
- [ ] Filtering by type works
- [ ] Filtering by category works
- [ ] Related resources display
- [ ] Download links work
- [ ] PDFs display correctly

---

## Notes

### Phase 4 (Future - Not Current Scope)
These features are intentionally **excluded** from current version:
- AI Scripts generation
- AI Presentation refinement
- AI Objection response generator
- AI Sales Coach with voice feedback

These require AI/ML infrastructure and are planned for Phase 4.

### Content vs Features
**Content** (masterclass videos, expert interviews) is separate from **features** (platform functionality). This spec covers feature implementation. Content must be created/recorded separately.
