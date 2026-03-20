# Progression System

Complete documentation of the VCSA 4-stage progression system and gamification mechanics.

## 🎯 Overview

The VCSA Progression System guides sales representatives from new hires to elite top producers through a structured 4-stage journey. Each stage has specific point requirements, timeframes, and learning objectives.

---

## 📊 The 4 Stages

### Stage 1: New Rep 🌱

**Objective**: Build sales foundation

**Requirements**:
- Points: 150
- Duration: 1-2 weeks
- Color: `#10B981` (Green)

**Key Learning Areas**:
- Pro Mindset fundamentals
- Discovery & Control basics
- Foundation sales skills

**Milestones**:
- Complete Pro Mindset track (6 modules)
- Complete Discovery & Control track (6 modules)
- Review 3 deal breakdowns
- Apply 2 quick wins

**Success Indicators**:
- Understands basic sales process
- Can conduct a proper discovery
- Knows foundational objections

---

### Stage 2: Developing Rep 📈

**Objective**: Execute with consistency

**Requirements**:
- Points: 300
- Duration: 2-4 weeks
- Color: `#3B82F6` (Blue)

**Key Learning Areas**:
- Value Architecture
- Decision Management
- Consistent execution

**Milestones**:
- Complete Value Architecture track (6 modules)
- Complete Decision Management track (6 modules)
- Review 5 deal breakdowns
- Apply 5 quick wins
- Maintain 7-day training streak

**Success Indicators**:
- Consistent tour execution
- Improved closing ratio
- Better objection handling

---

### Stage 3: Performing Rep ⚡

**Objective**: Close consistently

**Requirements**:
- Points: 500
- Duration: 4-8 weeks
- Color: `#F59E0B` (Amber)

**Key Learning Areas**:
- Objection Mastery
- Advanced closing techniques
- Post-sale integrity

**Milestones**:
- Complete Objection Mastery track (6 modules)
- Complete Post-Decision Integrity track (6 modules)
- Review 10 deal breakdowns
- Apply 10 quick wins
- Maintain 14-day training streak
- Achieve 80% readiness score

**Success Indicators**:
- Consistent closings
- Handles objections confidently
- Building referral pipeline

---

### Stage 4: Top Producer 👑

**Objective**: Elite performer status

**Requirements**:
- Points: 750
- Duration: 8-12 weeks
- Color: `#D4AF37` (Gold)

**Key Learning Areas**:
- Advanced strategy
- Leadership skills
- Industry expertise

**Milestones**:
- Complete all 36 modules
- Review all 15 deal breakdowns
- Apply all 20 quick wins
- Maintain 30-day training streak
- Achieve 95% readiness score
- Earn at least 8 badges

**Success Indicators**:
- Top 10% performer
- Mentor to new reps
- Industry leader

---

## 🏆 Badge System

### Completion Badges

| Badge ID | Name | Description | Icon | Requirement |
|----------|------|-------------|------|-------------|
| `first_module` | First Steps | Complete your first module | 🎯 | Complete 1 module |
| `stage_1_complete` | Foundation Builder | Complete Stage 1 | 🌱 | 150 points |
| `stage_2_complete` | Rising Star | Complete Stage 2 | 📈 | 300 points |
| `stage_3_complete` | Peak Performer | Complete Stage 3 | ⚡ | 500 points |
| `stage_4_complete` | Top Producer | Complete Stage 4 | 👑 | 750 points |

### Engagement Badges

| Badge ID | Name | Description | Icon | Requirement |
|----------|------|-------------|------|-------------|
| `streak_7` | Week Warrior | 7-day training streak | 🔥 | 7-day streak |
| `streak_14` | Two Week Titan | 14-day training streak | ⚡ | 14-day streak |
| `streak_30` | Monthly Master | 30-day training streak | 👑 | 30-day streak |
| `all_breakdowns` | Deal Analyst | Review all breakdowns | 📊 | 15 breakdowns |
| `all_quickwins` | Tactician | Apply all quick wins | 🎯 | 20 quick wins |

### Achievement Badges

| Badge ID | Name | Description | Icon | Requirement |
|----------|------|-------------|------|-------------|
| `readiness_100` | Ready for Anything | 100% readiness score | 💯 | Perfect readiness |
| `perfect_week` | Perfect Week | Complete all weekly assignments | ⭐ | All weekly tasks |

---

## 📈 Readiness Score Algorithm

The Readiness Score is a comprehensive metric (0-100) that measures a user's preparedness for sales activities.

### Formula

```
Readiness Score =
  (Video Completion % × 40%) +
  (Track Progress % × 30%) +
  (Quick Wins Applied % × 10%) +
  (Breakdowns Reviewed % × 10%) +
  (Training Streak Bonus × 10%)
```

### Components

#### 1. Video Completion (40%)
- Percentage of 36 modules completed
- Weight: Heaviest component (core learning)
- Calculation: `completed_modules / 36 × 100`

#### 2. Track Progress (30%)
- Average progress across all 6 tracks
- Weight: Second highest (consistent progress)
- Calculation: `sum(track_progress) / 6`

#### 3. Quick Wins Applied (10%)
- Percentage of 20 quick wins applied
- Weight: Tactical application
- Calculation: `applied_quickwins / 20 × 100`

#### 4. Breakdowns Reviewed (10%)
- Percentage of 15 breakdowns reviewed
- Weight: Learning from mistakes
- Calculation: `reviewed_breakdowns / 15 × 100`

#### 5. Training Streak Bonus (10%)
- Bonus points for consistency
- Weight: Encourages daily engagement
- Calculation: `min(streak_days / 30, 1.0) × 100`

### Example Calculation

```
User Progress:
- Completed modules: 18/36 (50%)
- Average track progress: 45%
- Quick wins applied: 8/20 (40%)
- Breakdowns reviewed: 5/15 (33%)
- Training streak: 7 days

Readiness Score =
  (50 × 0.40) +  // Video completion
  (45 × 0.30) +  // Track progress
  (40 × 0.10) +  // Quick wins
  (33 × 0.10) +  // Breakdowns
  (23 × 0.10)    // Streak (7/30 = 23%)

= 20 + 13.5 + 4 + 3.3 + 2.3
= 43.1%
```

---

## 💰 Points System

### Earning Points

| Action | Points | Max Per Day | Notes |
|--------|--------|-------------|-------|
| Complete training module | 10 | Unlimited | Core content |
| Review deal breakdown | 5 | Unlimited | Learning scenarios |
| Apply quick win | 3 | 5 | Tactical application |
| Daily login | 1 | 1 | Consistency bonus |
| Perfect week bonus | 20 | 1 | Complete all assignments |

### Point Value by Stage

| Stage | Points Required | Modules | Breakdowns | Quick Wins | Total Available |
|-------|----------------|---------|------------|------------|-----------------|
| Stage 1 | 150 | 60 (12 modules) | 15 (3 breakdowns) | 6 (2 quick wins) | 81 |
| Stage 2 | 300 | 60 (12 modules) | 25 (5 breakdowns) | 15 (5 quick wins) | 100 |
| Stage 3 | 500 | 60 (12 modules) | 50 (10 breakdowns) | 30 (10 quick wins) | 140 |
| Stage 4 | 750 | 60 (12 modules) | 75 (15 breakdowns) | 60 (20 quick wins) | 195 |

---

## 🔥 Training Streak

### Mechanics

- **Definition**: Consecutive days of training activity
- **Window**: 24 hours from last activity
- **Reset**: Miss a day = streak resets to 0
- **Tracking**: Stored in `user_progress.training_streak`

### Activity That Counts

- Completing a module
- Reviewing a breakdown
- Applying a quick win
- Watching 80%+ of a video

### Streak Milestones

| Streak | Badge | Bonus |
|--------|-------|-------|
| 3 days | - | +5 points |
| 7 days | Week Warrior | +10 points |
| 14 days | Two Week Titan | +20 points |
| 30 days | Monthly Master | +50 points |

---

## 🎮 Gamification Features

### Progress Tracking

#### User Progress Document
```javascript
{
  user_id: ObjectId,
  current_stage: 1,           // 1-4
  readiness_score: 43,        // 0-100
  points: 160,
  training_streak: 7,

  // Content completion
  completed_modules: [ObjectId],
  completed_breakdowns: [ObjectId],
  applied_quickwins: [ObjectId],

  // Achievements
  badges_awarded: ["first_module", "streak_7"],

  // Stage progress
  stage_progress: {
    stage_1: { points_earned: 160, points_required: 150, complete: true },
    stage_2: { points_earned: 10, points_required: 300, complete: false }
  },

  // Track progress
  track_progress: [
    { track_id: 1, completed_modules: 2, total_modules: 6, progress: 33 }
  ],

  // Timestamps
  last_training_date: ISODate,
  created_at: ISODate
}
```

### Badge Award Logic

Badges are awarded automatically when criteria are met:

```python
def check_and_award_badges(user_id: str):
    """Check badge eligibility and award new badges"""

    # Get user progress
    progress = get_user_progress(user_id)

    # Check each badge criteria
    new_badges = []

    # First module
    if len(progress.completed_modules) >= 1:
        new_badges.append("first_module")

    # Stage completion
    if progress.stage_progress.stage_1.complete:
        new_badges.append("stage_1_complete")

    # Streak badges
    if progress.training_streak >= 7:
        new_badges.append("streak_7")

    # ... (check all badges)

    # Award new badges
    for badge_id in new_badges:
        if badge_id not in progress.badges_awarded:
            progress.badges_awarded.append(badge_id)
            send_badge_notification(user_id, badge_id)

    return new_badges
```

---

## 📊 Analytics & Reporting

### Progress Metrics

#### Individual Metrics
- Current stage
- Readiness score
- Points earned
- Training streak
- Badges awarded
- Completion percentage

#### Team Metrics (Future)
- Average stage progression
- Team readiness score
- Top performers
- Engagement rates
- Streak leaders

---

## 🎯 Stage Gate Assessment

Before advancing to the next stage, users must:

### Stage 1 → Stage 2
- Complete 150 points
- Complete Pro Mindset & Discovery tracks
- Minimum 40% readiness score
- Active 7-day streak

### Stage 2 → Stage 3
- Complete 300 points
- Complete Value & Decision tracks
- Minimum 60% readiness score
- Active 14-day streak

### Stage 3 → Stage 4
- Complete 500 points
- Complete all tracks
- Minimum 80% readiness score
- Active 30-day streak

---

## 📚 Related Documentation

- [Development System API](../api/Development.md)
- [Phase 1 Content](../api/Development.md#content)
- [Database Schema](Database.md#user-progress)
