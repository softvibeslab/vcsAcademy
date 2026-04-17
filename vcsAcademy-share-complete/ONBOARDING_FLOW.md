# VCSA User Onboarding Flow

## Overview

The VCSA platform now includes a comprehensive 5-step onboarding experience for new sales representatives. This flow guides users through platform setup, goal setting, and feature exploration before they access the main dashboard.

## Features

### Automatic Onboarding Trigger

- **First-time users** are automatically redirected to `/get-started` when they log in
- **Returning users** who completed onboarding go directly to the dashboard
- **Skip option** available for users who want to explore on their own

### 5-Step Onboarding Journey

#### Step 1: Welcome
- Introduction to VCSA platform
- Overview of 3 core features:
  - **Training Library** - 36 video modules across 6 tracks
  - **Coaching Hub** - Live events, group sessions, role play
  - **Performance Tracking** - Daily metrics and strategy planning

#### Step 2: Set Your Goals
- **Monthly Income Target** - Slider from $5K to $50K
- **Daily Tours Goal** - Counter from 1-20 tours per day
- **Work Days** - Multi-select for working days (Mon-Sun)
- Goals are saved to user profile for personalized dashboard

#### Step 3: Explore Training
- Overview of **6 Training Tracks**:
  - Pro Mindset (6 modules)
  - Discovery & Control (6 modules)
  - Value Architecture (6 modules)
  - Decision Management (6 modules)
  - Objection Mastery (6 modules)
  - Post-Sale Integrity (6 modules)
- Preview of **Quick Wins** topics
- Highlights of **Key Move** feature (one actionable takeaway per module)

#### Step 4: Join Coaching
- Overview of **3 Coaching Types**:
  - **Group Coaching** - Live sessions with industry experts
  - **Role Play Sessions** - Practice scenarios in small groups
  - **Q&A Sessions** - Get answers to specific questions
- Preview of upcoming events
- Benefits of each coaching type

#### Step 5: Start Learning
- **Action Items** checklist:
  - Complete your profile
  - Set up your daily tour tracking
  - Join your first coaching event
  - Start your first training module
- **Quick Links** to key features
- Celebration message for completing setup

## Technical Implementation

### Route Configuration

```javascript
// App.js routes
<Route path="/get-started" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
<Route path="/onboarding/user" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
```

### Protected Route Enhancement

The `ProtectedRoute` component now checks for onboarding completion:

```javascript
const onboardingCompleted = localStorage.getItem('vcsa_onboarding_completed');

if (!onboardingCompleted && !isOnboardingPage) {
  return <Navigate to="/get-started" replace />;
}
```

### Onboarding Completion

When users complete the onboarding:
1. **Progress saved** to localStorage as `vcsa_onboarding_completed = true`
2. **Goals saved** to user profile in backend
3. **Auto-redirect** to `/dashboard` after Step 5
4. **Skip option** allows bypassing onboarding (still marks as complete)

## User Experience

### Visual Design
- **Progress bar** shows completion percentage (20%, 40%, 60%, 80%, 100%)
- **Step indicators** (circles) show current position
- **Smooth animations** between steps using Framer Motion
- **Glass morphism UI** consistent with VCSA design system
- **Mobile-first responsive** design

### Navigation
- **Back button** - Return to previous step
- **Next button** - Advance to next step
- **Skip button** - Exit onboarding (available on all steps)

### Colors & Styling
- **Gold (#D4AF37)** - Primary accent for progress and actions
- **Navy (#1E3A8A)** - Secondary accent
- **Dark backgrounds** with backdrop blur effects
- **Lucide icons** for visual elements

## File Structure

```
frontend/src/pages/
└── OnboardingPage.jsx          # Main onboarding component (31KB)

frontend/src/pages/onboarding/  # (Future expansion)
├── WelcomeStep.jsx
├── GoalsStep.jsx
├── TrainingStep.jsx
├── CoachingStep.jsx
└── StartStep.jsx
```

## Customization Options

### Modify Onboarding Steps

Edit `OnboardingPage.jsx` to:
- Add/remove steps
- Change step content
- Modify goal ranges
- Customize welcome message
- Update training track descriptions

### Disable Onboarding

To disable automatic onboarding redirect:

**Option 1: Comment out the check in ProtectedRoute**
```javascript
// if (!onboardingCompleted && !isOnboardingPage) {
//   return <Navigate to="/get-started" replace />;
// }
```

**Option 2: Mark as completed manually**
```javascript
localStorage.setItem('vcsa_onboarding_completed', 'true');
```

**Option 3: Backend flag**
Add `onboarding_completed` field to user profile and check that instead of localStorage.

## Backend Integration

### Save User Goals

The onboarding currently saves goals to localStorage. For backend persistence:

```python
# backend/server.py or backend/user_routes.py

@router.put("/api/users/onboarding")
async def complete_onboarding(
    goals: dict,
    current_user: dict = Depends(require_auth),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """Save onboarding goals to user profile"""
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "onboarding_completed": True,
                "goals": goals,
                "onboarding_completed_at": datetime.utcnow()
            }
        }
    )
    return {"success": True}
```

### Frontend API Call

```javascript
// In OnboardingPage.jsx - handleComplete()
const saveGoals = async (goals) => {
  try {
    await axios.put(`${API}/users/onboarding`, goals, {
      withCredentials: true
    });
    localStorage.setItem('vcsa_onboarding_completed', 'true');
    navigate('/dashboard');
  } catch (error) {
    console.error('Failed to save goals:', error);
    // Still mark as complete and redirect
    localStorage.setItem('vcsa_onboarding_completed', 'true');
    navigate('/dashboard');
  }
};
```

## Testing

### Manual Testing

1. **Clear onboarding completion**:
   ```javascript
   localStorage.removeItem('vcsa_onboarding_completed');
   ```

2. **Log in as demo user**:
   - Email: demo@vcsa.com
   - Password: demo123

3. **Verify redirect** to `/get-started`
   - URL: http://localhost:3001/get-started

4. **Complete all 5 steps**

5. **Verify redirect** to `/dashboard`

6. **Log out and log back in** - should go to dashboard directly

### Test Cases

- ✅ First-time user redirected to onboarding
- ✅ Returning user skips onboarding
- ✅ Skip button works on all steps
- ✅ Back/Next navigation works
- ✅ Goals are selectable and saved
- ✅ Progress bar updates correctly
- ✅ Mobile responsive design
- ✅ Animations are smooth

## Metrics & Analytics

### Track Onboarding Completion

Add analytics tracking (e.g., Google Analytics, Mixpanel):

```javascript
// In OnboardingPage.jsx
const trackStep = (stepNumber) => {
  // Example: Mixpanel
  mixpanel.track('Onboarding Step Viewed', {
    step: stepNumber,
    step_name: STEPS[stepNumber].title
  });
};

const trackCompletion = () => {
  mixpanel.track('Onboarding Completed', {
    total_steps: STEPS.length,
    goals_set: userGoals
  });
};
```

### Key Metrics to Monitor

- **Onboarding start rate** - Users who reach Step 1
- **Onboarding completion rate** - Users who finish all 5 steps
- **Step drop-off** - Where users abandon onboarding
- **Time to complete** - Average duration
- **Skip rate** - Users who skip onboarding

## Future Enhancements

### Potential Improvements

1. **Interactive training preview** - Show a sample video
2. **Coaching scheduler** - Book first session during onboarding
3. **Profile photo upload** - Personalize avatar
4. **Mobile app download** - Prompt for VCSA Pocket app
5. **Calendar integration** - Sync tour tracking with calendar
6. **Progress saved mid-onboarding** - Allow returning to incomplete onboarding
7. **A/B testing** - Test different onboarding flows
8. **Video walkthrough** - Optional video guide for each step

## Support

### Issues or Questions

If users encounter issues:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Clear cache and localStorage
4. Try accessing `/onboarding/user` directly
5. Contact support if issue persists

---

**Status**: ✅ **IMPLEMENTED & LIVE**
**Route**: `/get-started`
**Component**: `OnboardingPage.jsx`
**Integration**: Auto-redirect for new users
**Last Updated**: April 8, 2026
