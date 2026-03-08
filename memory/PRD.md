# VCSA - Vacation Club Sales Academy PRD

## Project Overview
Premium online education and community platform for vacation club/timeshare sales professionals. Designed to help sales reps, managers, and industry leaders become consistent top producers through structured sales training, community interaction, and live industry events.

## Target Audience
- **Sales Representatives**: Vacation club/timeshare sales professionals looking to improve performance
- **Sales Managers**: Leaders responsible for training and managing sales teams
- **Industry Leaders**: Experienced professionals sharing knowledge and participating in masterclasses

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

## Core Features Implemented ✅

### 1. User Authentication
- [x] Email/password registration and login
- [x] Google OAuth integration
- [x] Session management with secure cookies
- [x] Protected routes

### 2. User Dashboard
- [x] Welcome header with user name
- [x] Current level and points display
- [x] Progress snapshot (completed lessons)
- [x] Recently added courses
- [x] Upcoming events
- [x] Community highlights

### 3. Training Library
- [x] Course listing with categories (course, masterclass, workshop, interview)
- [x] Search and filter functionality
- [x] Course cards with thumbnails and metadata
- [x] Level-gated content
- [x] VIP-only content badges
- [x] Course detail page with lessons
- [x] Video player (YouTube/Vimeo embed support)
- [x] Mark lessons as complete
- [x] Progress tracking

### 4. Community Feed
- [x] Create posts
- [x] View post feed
- [x] Like posts
- [x] Pinned posts
- [x] Comments on posts
- [x] User avatars and timestamps

### 5. Events System
- [x] Upcoming events display
- [x] Past events/recordings section
- [x] Event details (title, speaker, date/time, description)
- [x] Join links for live events
- [x] VIP-only events

### 6. Resource Library
- [x] Downloadable resources
- [x] Categories (scripts, frameworks, guides, AI prompts, templates)
- [x] Level-gated resources
- [x] VIP-only resources
- [x] Download tracking

### 7. Gamification System
- [x] Points awarded for activities (lessons, posts, comments)
- [x] Level progression (1-5)
- [x] Level-based content unlocking
- [x] Progress bars and level roadmap

### 8. Membership/Payments
- [x] Free tier
- [x] VIP Monthly ($97/month)
- [x] VIP Annual ($970/year)
- [x] Stripe checkout integration
- [x] Payment success handling
- [x] Membership status display

### 9. User Profile
- [x] Profile overview
- [x] Level and points display
- [x] Level benefits breakdown
- [x] Points earning guide

### 10. Admin Panel
- [x] Platform statistics overview
- [x] User management (view, update roles/membership)
- [x] Course creation
- [x] Lesson creation
- [x] Event creation
- [x] Resource creation

## Database Schema

### Collections
- `users` - User accounts with level, points, membership
- `user_sessions` - Auth sessions
- `courses` - Training courses/content
- `lessons` - Individual lessons within courses
- `events` - Live events and masterclasses
- `posts` - Community posts
- `comments` - Post comments
- `resources` - Downloadable resources
- `user_progress` - Lesson completion tracking
- `payment_transactions` - Stripe payment records

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/session (Google OAuth)
- GET /api/auth/me
- POST /api/auth/logout

### Content
- GET /api/courses
- GET /api/courses/:id
- POST /api/courses (admin)
- POST /api/lessons (admin)
- POST /api/lessons/:id/complete
- GET /api/events
- GET /api/resources
- POST /api/resources/:id/download

### Community
- GET /api/posts
- POST /api/posts
- POST /api/posts/:id/like
- GET /api/posts/:id/comments
- POST /api/comments

### Payments
- POST /api/payments/checkout
- GET /api/payments/status/:session_id
- POST /api/webhook/stripe

### Admin
- GET /api/admin/stats
- GET /api/admin/users
- PUT /api/admin/users/:id/role
- PUT /api/admin/users/:id/membership

## Test Credentials
- **Admin**: admin@vcsa.com / admin123
- **Demo User**: demo@vcsa.com / demo123

## Seed Data Included
- 2 users (admin, demo)
- 4 courses with lessons
- 2 upcoming events
- 2 community posts
- 4 downloadable resources

---

## P0 - Critical (Remaining)
- None - MVP Complete

## P1 - High Priority (Backlog)
- [ ] Course/lesson editing in admin
- [ ] Event registration tracking
- [ ] User activity logging
- [ ] Email notifications (SendGrid)
- [ ] Video upload/hosting integration

## P2 - Medium Priority (Backlog)
- [ ] Mobile app (React Native)
- [ ] Sales performance tracking
- [ ] Leaderboards
- [ ] Badges/achievements
- [ ] Deal simulation training
- [ ] AI sales assistant integration
- [ ] Direct messaging between users

## Last Updated
- **Date**: March 8, 2026
- **Status**: MVP Complete
- **Version**: 1.0.0
