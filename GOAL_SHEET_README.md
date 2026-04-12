# Goal Sheet - Vacation Club Sales Academy

## Overview

The **Goal Sheet** is a comprehensive performance tracking tool for Vacation Club Sales representatives. It provides real-time visibility into sales metrics, revenue targets, personal development goals, and achievements.

## Features

### 📊 Dashboard Overview
- **Quick Stats Cards**: Today's volume, tours, presentations, and weekly performance
- **Sales Streak Tracking**: Current streak vs. best streak
- **Leaderboard Position**: Real-time rank with weekly movement indicator
- **Period Selection**: Toggle between Daily, Weekly, Monthly, Quarterly, and Yearly views

### 🎯 Goal Categories

#### 1. Sales Goals
- **Volume Points (VP)**: Track production volume against targets
- **Tours**: Monitor tour count and conversion
- **Sales**: Track closed deals count
- **Closing Rate**: Percentage conversion from tours to sales

#### 2. Revenue Goals
- **Gross Revenue**: Total sales volume in USD
- **Commission**: Personal earnings from sales
- **Bonuses**: Performance-based bonuses
- **Average Deal Size**: Average revenue per closed sale

#### 3. Personal Development
- **Training Hours**: Time spent on professional development
- **Modules Completed**: Training modules finished
- **Coaching Calls**: Sessions with sales coaches
- **Readiness Score**: Overall preparedness score (0-100)

### 🏆 Achievements System

Unlockable achievements based on performance:

| Achievement | Icon | Description |
|-------------|------|-------------|
| Top 10% | Trophy | Top 10% performer for the period |
| Hot Streak | Flame | Multiple sales in consecutive days |
| Club Elite | Crown | Reach 100K+ monthly volume |
| Perfect Week | Star | 100% closing rate for a week |

### 📈 Milestones Tracking

Long-term goal tracking with:
- **Progress Visualization**: Visual progress bars
- **Deadline Tracking**: Days remaining until deadline
- **Daily Targets**: Calculated daily requirements to stay on track
- **Status Indicators**: On-track, ahead, or behind schedule

### ⚡ Quick Actions

Direct links to:
- Continue Training (Top Producer Path)
- Study Breakdowns (Deal scenarios)
- Quick Wins (Tactical knowledge)
- Community (Connect with reps)

### ➕ Create New Goals

Interactive goal creation with:
- **Category Selection**: Sales, Revenue, or Personal Development
- **Custom Targets**: Set your own goals
- **Deadline Management**: Add target dates
- **Progress Tracking**: Monitor current vs. target

## Design System

The Goal Sheet follows VCSA's dark luxury design system:

- **Colors**:
  - Background: `#020204`
  - Gold accent: `#D4AF37` (for CTAs, achievements)
  - Navy: `#1E3A8A`
  - Text: `#F8FAFC` (primary), `#94A3B8` (secondary)

- **Typography**:
  - Headings: Playfair Display
  - Body: DM Sans
  - Data/Numbers: JetBrains Mono

- **Components**:
  - Glass-morphism cards with subtle borders
  - Progress bars with color-coded status
  - Bento-grid layout for dashboard
  - Framer Motion animations

## User Journey

1. **Access**: Navigate to Goal Sheet from sidebar navigation
2. **View**: Overview of current performance across all metrics
3. **Track**: Monitor progress towards goals with visual indicators
4. **Create**: Add new custom goals as needed
5. **Achieve**: Unlock achievements by hitting targets
6. **Iterate**: Adjust goals based on performance

## Data Model

### Goal Object Structure

```javascript
{
  sales: {
    volume: { current: 84750, target: 150000, unit: 'VP' },
    tours: { current: 42, target: 60, unit: 'tours' },
    sales: { current: 12, target: 20, unit: 'sales' },
    closing_rate: { current: 28.5, target: 35, unit: '%' }
  },
  revenue: {
    gross: { current: 142800, target: 250000, unit: 'USD' },
    commission: { current: 21340, target: 37500, unit: 'USD' },
    bonuses: { current: 2800, target: 5000, unit: 'USD' },
    avg_deal: { current: 11900, target: 12500, unit: 'USD' }
  },
  personal: {
    training_hours: { current: 24, target: 40, unit: 'hrs' },
    modules_completed: { current: 18, target: 30, unit: 'modules' },
    coaching_calls: { current: 8, target: 12, unit: 'calls' },
    readiness_score: { current: 72, target: 85, unit: 'score' }
  }
}
```

### Achievement Structure

```javascript
{
  id: 1,
  title: 'Top 10%',
  icon: 'trophy',
  unlocked: true,
  description: 'Top 10% performer this month'
}
```

## API Integration

### Endpoints (To be implemented)

```python
# Get goal sheet data
GET /api/goalsheet?period=monthly

# Create new goal
POST /api/goalsheet/goals

# Update goal progress
PUT /api/goalsheet/goals/{goal_id}

# Get achievements
GET /api/goalsheet/achievements

# Unlock achievement
POST /api/goalsheet/achievements/{achievement_id}/unlock
```

## Future Enhancements

- [ ] Historical performance charts (line graphs)
- [ ] Peer comparison metrics
- [ ] Goal sharing with manager
- [ ] Mobile app integration
- [ ] Push notifications for achievements
- [ ] AI-powered goal recommendations
- [ ] Export to PDF/email reports
- [ ] Team goal tracking (for managers)

## Testing

```bash
# Navigate to Goal Sheet
cd frontend
yarn start

# Access at
http://localhost:3000/goalsheet
```

## File Structure

```
frontend/src/
├── pages/
│   └── GoalSheetPage.jsx       # Main Goal Sheet component
├── components/
│   ├── layout/
│   │   └── DashboardLayout.jsx  # Updated with Goal Sheet nav
│   └── ui/
│       ├── card.jsx             # Card components
│       ├── progress.jsx         # Progress bars
│       └── tabs.jsx             # Tab navigation
└── App.js                       # Updated with Goal Sheet route
```

## Key Metrics

### Progress Calculation
```
Progress % = (Current / Target) × 100
```

### Status Colors
- **≥ 100%**: Gold (#D4AF37) - Goal Achieved
- **≥ 75%**: Green - On Track
- **≥ 50%**: Yellow - Needs Attention
- **< 50%**: Red - Behind Schedule

### Daily Target Calculation
```
Daily Target = (Target - Current) / Days Remaining
```

## Contributing

When modifying the Goal Sheet:
1. Maintain the dark luxury aesthetic
2. Preserve the bento-grid layout
3. Ensure responsive design (mobile-first)
4. Test with mock data before API integration
5. Follow VCSA design guidelines in `design_guidelines.json`

## Support

For issues or questions about the Goal Sheet:
- Check the main README.md
- Review design_guidelines.json for design specs
- Consult CLAUDE.md for project conventions
