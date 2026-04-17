# 📱 STITCH DESIGN PROMPT - VCSA POCKET MOBILE APP

**Version**: 1.0
**Date**: 2026-04-05
**Purpose**: Complete design specification for VCSA Pocket mobile app UI/UX
**Target Tool**: Stitch (or Figma)

---

# VCSA POCKET - Mobile App Design System

## BRAND IDENTITY & DESIGN DIRECTION

**Product**: VCSA Pocket - Sales Operating System for Vacation Club Sales Professionals
**Target Audience**: Sales representatives (25-45 years old), active on sales floor
**Brand Personality**: Premium, motivational, performance-driven, professional

### CORE VISUAL IDENTITY
- **Primary Theme**: Dark Luxury Premium
- **Background**: Deep Black (#020204) with subtle navy gradients (#1E3A8A)
- **Accent Color**: Gold (#D4AF37) - use SPARINGLY for high-value actions only
- **Secondary Accent**: Navy Blue (#1E3A8A)
- **Text Colors**:
  - Primary: #F1F5F9 (off-white, never pure white)
  - Secondary: #94A3B8 (muted gray)
  - Gold accent: #D4AF37 (for CTAs, achievements)
- **Typography**:
  - Headings: DM Sans Bold (modern, professional)
  - Body: DM Sans Regular (readable, clean)
  - Numbers/Metrics: DM Sans Medium

### DESIGN PRINCIPLES
1. **Premium Depth**: Use layered cards with 1px borders (white/10 opacity)
2. **Strategic Gold**: Gold is premium - use ONLY for:
   - Primary CTAs
   - Achievement badges
   - Score milestones
   - Active states
3. **Breathing Space**: 2-3x more padding than typical apps
4. **Data Visualization**: Large, bold numbers with clear labels
5. **Action-Oriented**: Every screen should have clear next actions

---

## SCREEN 1: DASHBOARD (Home Screen)

### Purpose
Main hub showing readiness score, daily goals, and quick access to all features

### Layout Structure

**Header Section** (Top 15%)
```
┌─────────────────────────────────────┐
│ 👤 Avatar  "Good morning, Carlos"   │
│           🔥 15 day streak          │
└─────────────────────────────────────┘
```
- Left: User avatar (circle, 48px) + greeting "Good morning, {name}"
- Right: Streak badge (fire icon + number of days)

**Hero Section** (Middle 35%)
```
┌─────────────────────────────────────┐
│                                     │
│         ⭕  72                      │
│      Readiness Score                │
│      ↑ 5% this week                 │
│                                     │
└─────────────────────────────────────┘
```
- **Readiness Score Ring** (Large circular progress)
  - Center: Score (0-100) in large gold text
  - Ring color: Gradient from gold to navy
  - Below: "Readiness Score" label in secondary text
  - Bottom: Trend indicator (↑ 5% this week) in green

**Daily Goals Grid** (Middle 30%)
```
┌───────────┬───────────┬───────────┐
│ 🎯 Tours  │ 💰 Sales  │ 🤖 AI     │
│  ███████░ │  ░░░░░░░░ │  ░░░░░░░░ │
│  2/3      │  0/1      │  0/3      │
└───────────┴───────────┴───────────┘
```
- 3-column grid with goal cards:
  - Icon + Label + Progress bar
  - Cards:
    1. 🎯 Tours: 2/3 completed
    2. 💰 Sales: 0/1 achieved
    3. 🤖 AI Coach: 0/3 uses
- Each card: Dark background, 1px border, subtle glow on progress

**Quick Actions** (Bottom 20%)
```
┌─────────┬─────────┬─────────┐
│  ⚡     │  🤖     │  📚     │
│ PreTour │  AI     │ Quick   │
│         │ Coach   │ Wins    │
├─────────┼─────────┼─────────┤
│  💰     │  🎭     │  👤     │
│ Goal    │ Play    │ Profile │
│ Sheet   │ Role    │         │
└─────────┴─────────┴─────────┘
```
- 2x3 grid of icon buttons:
  1. Pre-Tour Mode (⚡)
  2. AI Coach (🤖)
  3. Quick Wins (📚)
  4. Goal Sheet (💰) - NEW
  5. Play Role (🎭) - NEW
  6. Profile (👤)
  - Settings moved to Profile screen

### Visual Style
- Background: Deep black with subtle navy gradient (bottom to top)
- Cards: #1E293B with #334155 borders (1px)
- Active elements: Gold glow effects
- Progress bars: Gradient from gold to transparent

---

## SCREEN 2: PRE-TOUR MODE (2-Minute Prep)

### Purpose
Quick preparation routine before sales presentations

### Layout Structure

**Header** (Top 10%)
```
┌─────────────────────────────────────┐
│  ✕                                 │
│  PRE-TOUR MODE                      │
│  2-minute preparation routine       │
└─────────────────────────────────────┘
```
- Large title: "PRE-TOUR MODE"
- Subtitle: "2-minute preparation routine"
- Close button (X) top right

**Countdown Timer** (Top 20%)
```
┌─────────────────────────────────────┐
│                                     │
│         ⭕  2:00                    │
│      [Begin Prep]                   │
│                                     │
└─────────────────────────────────────┘
```
- Large circular timer: 2:00
- Start button: "Begin Prep" (Gold background, black text)

**Prep Cards** (Stack, vertically scrollable) (Middle 60%)

**Card 1: Mindset Affirmation**
```
┌─────────────────────────────────────┐
│ Today's Mantra                      │
│ ─────────────────────────────────── │
│ "I am confident, prepared, and      │
│ ready to create value"              │
│                                     │
│ [Repeat 3x]                         │
└─────────────────────────────────────┘
```
- Title: "Today's Mantra"
- Content: "I am confident, prepared, and ready to create value"
- Action: "Repeat 3x" button

**Card 2: Quick Win of the Day**
```
┌─────────────────────────────────────┐
│ Apply This Tactic          MINDSET  │
│ ─────────────────────────────────── │
│ Breaking The Pact - Identifica y    │
│ rompe 3 patrones mentales           │
│ limitantes en tu primera venta       │
│                                     │
│ [View Full]                         │
└─────────────────────────────────────┘
```
- Title: "Apply This Tactic"
- Content: "Breaking The Pact - Identifica y rompe 3 patrones mentales limitantes"
- Category badge: "Mindset"
- Action: "View Full" button

**Card 3: Objection Prep**
```
┌─────────────────────────────────────┐
│ Anticipate Objections               │
│ ─────────────────────────────────── │
│ • "It's too expensive"              │
│ • "Need to talk to spouse"          │
│ • "Not interested right now"        │
│                                     │
│ [Review Responses]                  │
└─────────────────────────────────────┘
```
- Title: "Anticipate Objections"
- List: Top 3 common objections for today
- Action: "Review Responses" button

**Card 4: Goal Reminder**
```
┌─────────────────────────────────────┐
│ Today's Target                      │
│ ─────────────────────────────────── │
│ 1 sale, 3 tours, AI Coach ready     │
│                                     │
│ [I'm Ready]                         │
└─────────────────────────────────────┘
```
- Title: "Today's Target"
- Content: "1 sale, 3 tours, AI Coach ready"
- Action: "I'm Ready" button

**Footer** (Bottom 10%)
```
┌─────────────────────────────────────┐
│     [Start Tour]                    │
│  You've got this! 💪                │
└─────────────────────────────────────┘
```
- "Start Tour" button (Gold, full width)
- Subtext: "You've got this! 💪"

### Visual Style
- Cards slide up with staggered animation
- Active card highlighted with subtle gold border
- Timer pulses gently
- Dark, focused atmosphere (minimal distractions)

---

## SCREEN 3: AI COACH CHAT

### Purpose
Real-time AI coaching for objection handling and sales situations

### Layout Structure

**Header** (Top 10%)
```
┌─────────────────────────────────────┐
│ ←            AI Coach         [⚙️] │
│              ● Online               │
└─────────────────────────────────────┘
```
- Left: Back button
- Center: "AI Coach" + "Online" badge (green dot)
- Right: History button

**Chat Area** (Middle 70%, scrollable)

**Welcome State** (when empty):
```
┌─────────────────────────────────────┐
│                                     │
│              🧠                    │
│   How can I help you win today?     │
│                                     │
│ ┌──────────┬──────────┬──────────┐ │
│ │ Price is │ Need to  │ Not      │ │
│ │ too high │ spouse   │interest  │ │
│ └──────────┴──────────┴──────────┘ │
│                                     │
│ ┌──────────┬──────────┬──────────┐ │
│ │Already   │ [Custom  │          │ │
│ │have      │ input]   │          │ │
│ │membership│          │          │ │
│ └──────────┴──────────┴──────────┘ │
└─────────────────────────────────────┘
```
- Icon: Large AI brain icon (centered)
- Title: "How can I help you win today?"
- Suggestion pills (horizontal scroll):
  - "Price is too high"
  - "Need to talk to spouse"
  - "Not interested right now"
  - "Already have membership"
  - Custom input

**Chat Messages** (when active):
```
┌─────────────────────────────────────┐
│                    I understand... │
│  The client says                  │
│  it's too                       [🎙️]│
│  expensive                       [➤]│
│                                     │
│  [█████] Type a message...      [🎙️]│
└─────────────────────────────────────┘

User message (right aligned):
┌─────────────────────────────────────┐
│                        The client   │
│                      says it's too  │
│                    expensive        │
└─────────────────────────────────────┘

AI response (left aligned):
┌─────────────────────────────────────┐
│ I completely understand how         │
│ they feel. That's a common          │
│ concern we hear from new members.   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔑 Key Move: Empathize and      │ │
│ │ normalize the concern           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [View Logical] [View Story]        │
│ Confidence: 85% | Impact: High     │
└─────────────────────────────────────┘
```
- User messages: Right-aligned, gold background, black text
- AI responses: Left-aligned, dark gray background, white text
- Response structure:
  - Main response (emotional approach)
  - "View Logical Approach" button
  - "View Story Approach" button
  - Key Move callout box (gold border)
  - Confidence score indicator

**Input Area** (Bottom 20%)
```
┌─────────────────────────────────────┐
│ [Type your situation...        ] [🎙️]│
│                                   [➤]│
└─────────────────────────────────────┘
```
- Text input field: "Describe your situation..."
- Voice input button (microphone icon)
- Send button (appears when typing)

### Visual Style
- Clean, focused chat interface
- Subtle animations for new messages
- Voice button pulses when listening
- Gold accents for user messages
- Approach buttons expandable cards

---

## SCREEN 4: QUICK WINS LIBRARY

### Purpose
Searchable library of 50+ tactical sales techniques

### Layout Structure

**Header** (Top 15%)
```
┌─────────────────────────────────────┐
│ Quick Wins Library                  │
│ [🔍 Search tactics...]             │
├─────────────────────────────────────┤
│ [All] [Mindset] [Objections] [Close]│
└─────────────────────────────────────┘
```
- Search bar: "Search tactics..."
- Filter chips (horizontal scroll):
  - All
  - Mindset
  - Objections
  - Closing
  - Presentation
  - Storytelling

**Quick Wins Grid** (Middle 75%, scrollable)

**Card Design** (2-column grid):
```
┌─────────────────┬─────────────────┐
│ Mindset   ⭐     │ Objections ⭐   │
│ [♥]            │ [♥]             │
│ Breaking The    │ Price           │
│ Pact -          │ Objection       │
│ Rompe Patrones  │ Handling        │
│                 │                 │
│ ⭐⭐⭐⭐⭐      │ ⭐⭐⭐⭐       │
│ 2 min           │ 3 min           │
│ [Apply Now]     │ [Apply Now]     │
└─────────────────┴─────────────────┘
```
- Category badge (top left, colored)
- Favorite button (top right, heart icon)
- Title: Bold, 2 lines max
- Description: 2 lines, gray text
- Impact stars: ⭐⭐⭐⭐⭐ (1-5)
- Timing badge: "2 min read"
- "Apply Now" button (outline style)

**States**:
- Default view: All quick wins
- Search results: Highlighted search terms
- Favorites: Heart icon filled gold

**Floating Action Button** (Bottom right)
```
                                   ┌───┐
                                   │ + │
                                   └───┘
```
- "+" button to add custom quick win

### Visual Style
- Cards with subtle hover effects
- Category color coding:
  - Mindset: Purple (#A855F7)
  - Objections: Red (#EF4444)
  - Closing: Green (#22C55E)
  - Presentation: Blue (#3B82F6)
  - Storytelling: Orange (#F97316)
- Favorite icon: Gold when active, gray when inactive
- Clean, scannable grid layout

---

## SCREEN 5: POST-TOUR DEBRIEF

### Purpose
1-minute reflection after each sales presentation

### Layout Structure

**Header** (Top 10%)
```
┌─────────────────────────────────────┐
│  ✕                                 │
│  Post-Tour Debrief                  │
│  60-second reflection               │
└─────────────────────────────────────┘
```
- Title: "Post-Tour Debrief"
- Subtitle: "60-second reflection"
- Close button

**Outcome Selection** (Top 20%)
```
┌─────────────────────────────────────┐
│   Select the outcome:               │
│                                     │
│  ┌────────┬──────────┬──────────┐  │
│  │  🎉   │   🤝    │   📅    │  │
│  │ Sale  │ No Sale │Follow Up│  │
│  └────────┴──────────┴──────────┘  │
└─────────────────────────────────────┘
```
- Large segmented control:
  - 🎉 Sale (Gold background)
  - 🤝 No Sale (Gray background)
  - 📅 Follow Up (Navy background)

**Metrics Section** (Middle 40%)

**Slider 1: Objections Handled**
```
┌─────────────────────────────────────┐
│ Objections Handled                  │
│ ─────────────────────────────────── │
│ ◄────●────►                        │
│ 0    3    10                        │
└─────────────────────────────────────┘
```
- Range: 0-10
- Label: "How many objections did you handle?"
- Current value display

**Slider 2: Confidence Before**
```
┌─────────────────────────────────────┐
│ Confidence Before Tour              │
│ ─────────────────────────────────── │
│ ◄──────●─────────►                 │
│ 0     70        100                  │
│ 😟     😐        💪                 │
└─────────────────────────────────────┘
```
- Range: 0-100
- Label: "Confidence starting the tour"
- Emoji scale: 😟 → 😐 → 😊 → 💪

**Slider 3: Confidence After**
```
┌─────────────────────────────────────┐
│ Confidence After Tour               │
│ ─────────────────────────────────── │
│ ◄───────●───────►                 │
│ 0       85      100                 │
│ 😟      😐       💪                 │
└─────────────────────────────────────┘
```
- Range: 0-100
- Label: "Confidence ending the tour"
- Emoji scale: 😟 → 😐 → 😊 → 💪

**Toggle: AI Coach Used**
```
┌─────────────────────────────────────┐
│ Did you use AI Coach?               │
│                                     │
│  No  ◯────〇  Yes                   │
└─────────────────────────────────────┘
```
- Switch: Yes/No
- Label: "Did you use AI Coach during this tour?"

**Notes Section** (Bottom 20%)
```
┌─────────────────────────────────────┐
│ Reflections (optional)              │
│ ─────────────────────────────────── │
│ What did you learn? What will you  │
│ do differently?                    │
│ ╔═════════════════════════════════╗│
│ ║ Type your reflections here...   ║│
│ ║                                 ║│
│ ║                                 ║│
│ ╚═════════════════════════════════╝│
│ 0/280 characters                   │
└─────────────────────────────────────┘
```
- Textarea: "What did you learn? What will you do differently?"
- Placeholder: "Type your reflections here..."
- Character limit: 280

**Footer** (Bottom 10%)
```
┌─────────────────────────────────────┐
│      [Save Debrief]                 │
│        Skip for now                 │
└─────────────────────────────────────┘
```
- "Save Debrief" button (Gold, full width)
- Skip link: "Skip for now"

### Visual Style
- Clean, focused interface
- Sliders with smooth animations
- Confidence change shown as growth indicator
- Selected outcome highlights entire section in matching color

---

## SCREEN 6: GOAL SHEET (Financial Targets)

### Purpose
Set and track financial goals with clear visibility into earnings, commissions, and progress toward targets

### Layout Structure

**Header** (Top 12%)
```
┌─────────────────────────────────────┐
│ ←            GOAL SHEET             │
│         Track Your Success           │
└─────────────────────────────────────┘
```
- Left: Back button
- Center: "GOAL SHEET"
- Subtitle: "Track Your Success"

**Hero Card - Monthly Target** (Top 25%)
```
┌─────────────────────────────────────┐
│  💰 Monthly Income Goal             │
│  ═══════════════════════════════════│
│                                     │
│       $12,000                       │
│    of $15,000 target                │
│                                     │
│  ████████████░░ 80%                 │
│                                     │
│  ↑ $2,400 above last month          │
│  📅 18 days remaining               │
└─────────────────────────────────────┘
```
- Large circular progress or linear bar
- Current earnings in large gold text
- Target amount below
- Progress percentage
- Trend indicator vs last month
- Days remaining in month

**Stats Grid** (Middle 35%)
```
┌─────────────────┬─────────────────┐
│ 🎯 Sales        │ 💵 Commission   │
│                 │                 │
│      8         │     $4,800      │
│   target: 10   │  rate: 60%      │
│  ████████░░    │  ████████░░     │
└─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┐
│ 📊 Avg. Deal    │ 🔥 Streak       │
│                 │                 │
│    $1,500       │      12 days    │
│   this month    │   personal best │
│   ↑ $200        │   🏆 15 days    │
└─────────────────┴─────────────────┘
```
- 2x2 grid of stat cards:
  1. Sales count vs target
  2. Commission earned
  3. Average deal size
  4. Current streak
- Each card with icon, value, target/benchmark
- Mini progress bars
- Trend indicators

**Breakdown Section** (Middle 20%)
```
┌─────────────────────────────────────┐
│  📈 Income Breakdown               │
│  ──────────────────────────────────│
│                                     │
│  Sales Commissions     $4,800  80%  │
│  ████████████████████░░░░░░         │
│                                     │
│  Bonuses                $600  10%  │
│  ██████░░░░░░░░░░░░░░░░░░░░         │
│                                     │
│  Overrides              $0    0%   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░         │
│                                     │
│  TOTAL                 $5,400       │
└─────────────────────────────────────┘
```
- Breakdown of income sources
- Horizontal progress bars
- Percentages and amounts
- Color-coded by source type

**Action Buttons** (Bottom 8%)
```
┌─────────────────────────────────────┐
│  [Set New Goal]  [View History]     │
└─────────────────────────────────────┘
```
- "Set New Goal" button (Secondary)
- "View History" button (Outline)

### Visual Style
- Financial data presented cleanly
- Large, readable numbers
- Gold accents for money/earnings
- Green for positive trends
- Progress visualization prominent
- Dark background with navy accents

### Value Proposition
**"See your progress in real-time. Know exactly where you stand and what it takes to hit your numbers."**

---

## SCREEN 7: PLAY ROLE (Practice Scenarios)

### Purpose
Practice sales scenarios with AI feedback to improve objection handling and closing techniques

### Layout Structure

**Header** (Top 12%)
```
┌─────────────────────────────────────┐
│ ←            PLAY ROLE              │
│         Practice & Perfect          │
└─────────────────────────────────────┘
```
- Left: Back button
- Center: "PLAY ROLE"
- Subtitle: "Practice & Perfect"

**Scenario Selection** (Top 20%)
```
┌─────────────────────────────────────┐
│  Choose a Scenario                  │
│  ────────────────────────────────── │
│                                     │
│  [All] [Price] [Closing] [Spouse]  │
└─────────────────────────────────────┘
```
- Title: "Choose a Scenario"
- Filter chips (horizontal scroll):
  - All Scenarios
  - Price Objections
  - Closing
  - Spouse Talks
  - Competition
  - Timing

**Featured Scenario** (Top 25%)
```
┌─────────────────────────────────────┐
│  ⭐ Featured Scenario               │
│  ────────────────────────────────── │
│                                     │
│  💰 The Price Objection             │
│  Practice: "It's too expensive"    │
│                                     │
│  Difficulty: ●●●○○ (Medium)        │
│  Avg. Score: 7.2/10                 │
│  Your Best: 8.5/10 🏆              │
│                                     │
│  [Start Practice]                   │
└─────────────────────────────────────┘
```
- Card highlighted with gold border
- Scenario title and description
- Difficulty indicator (dots)
- Average score vs personal best
- Primary CTA button

**Scenario List** (Middle 40%)
```
┌─────────────────────────────────────┐
│  📅 Spouse Needs Approval           │
│  "I need to talk to my spouse"     │
│  ●●○○○  Easy  |  Score: 9.0/10     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ⏰ Not the Right Time              │
│  "We're not looking right now"     │
│  ●●●○○  Medium |  Score: 7.5/10   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🏆 Already a Member                │
│  "We already have a membership"     │
│  ●●●●○  Hard |  Score: 6.0/10     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🔄 Competitor Comparison            │
│  "X Brand offers more for less"     │
│  ●●●●●  Expert |  Score: 8.0/10   │
└─────────────────────────────────────┘
```
- Scrollable list of scenarios
- Each card shows:
  - Icon representing scenario type
  - Title
  - Objection statement
  - Difficulty (dots)
  - Category label
  - Your best score
- Tap to start practice

**Practice Stats** (Bottom 8%)
```
┌─────────────────────────────────────┐
│  This Week: 12 practices | +3 vs   │
│  last week                          │
└─────────────────────────────────────┘
```
- Weekly practice count
- Comparison to previous week
- Motivational message

### Practice Mode (When Scenario Selected)

**Role Play Interface**
```
┌─────────────────────────────────────┐
│  ✕  The Price Objection   [⏸️][💬]│
│  ──────────────────────────────────│
│                                     │
│  🙋 Client: "It's too expensive"    │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 💡 AI Coach Tip:                ││
│  │ Acknowledge first, then pivot   ││
│  └─────────────────────────────────┘│
│                                     │
│  🎤 Your Response:                  │
│  ╔═════════════════════════════════╗│
│  ║ [Record your response...]      ║│
│  ║                                 ║│
│  ╚═════════════════════════════════╝│
│                                     │
│  [🎙️ Record]  [⌨️ Type]  [✓ Submit]│
└─────────────────────────────────────┘
```

**Feedback Screen (After Submission)**
```
┌─────────────────────────────────────┐
│  ✓ Response Complete                │
│  ──────────────────────────────────│
│                                     │
│       Your Score: 8.5/10            │
│      ⭐⭐⭐⭐☆                   │
│                                     │
│  ✅ Strengths:                      │
│  • Good acknowledgment              │
│  • Confident delivery               │
│                                     │
│  💡 Improvements:                   │
│  • Add specific benefit mention     │
│  • Include social proof             │
│                                     │
│  🎯 Suggested Response:              │
│  "I understand budget is important. │
│  Most members find the value..."    │
│                                     │
│  [Try Again]  [Next Scenario]       │
└─────────────────────────────────────┘
```

### Visual Style
- Game-like interface with scoring
- Encouraging, not intimidating
- Clear feedback (strengths + improvements)
- Progress tracking visible
- Motivational messaging

### Gamification Elements
- **Difficulty Levels**: Easy, Medium, Hard, Expert
- **Scoring System**: 1-10 with breakdown
- **Personal Bests**: Track and celebrate
- **Streaks**: Consecutive practice days
- **Achievements**: Badges for milestones
- **Leaderboard**: (Optional) Team ranking

### Value Proposition
**"Practice in a safe space. Build confidence. Close more deals. Perfect your pitch before you ever step in front of a real client."**

### Interaction Flow
1. **Select** scenario from list
2. **Read/Listen** to objection
3. **Respond** via voice or text
4. **Get feedback** from AI Coach
5. **Review** suggested response
6. **Try again** or move to next scenario

---

## USER FLOW & VALUE JOURNEY

### Core Daily Workflow (Enhanced)

```
┌─────────────┐
│  DASHBOARD  │  ← Start here every morning
│  - Check    │     - See readiness score
│  Readiness  │     - Review daily goals
│  - View     │     - Check progress toward financial targets
│  Goals      │     - Decide which feature to use
└──────┬──────┘
       │
       ├─── → [PRE-TOUR MODE] ← Before each sales presentation
       │      - 2-minute prep routine
       │      - Get focused mindset
       │      - Review key tactics
       │
       ├─── → [AI COACH] ← During objection or challenge
       │      - Real-time guidance
       │      - Practice responses
       │      - Learn new approaches
       │
       ├─── → [QUICK WINS] ← Between tours or during downtime
       │      - Learn new tactics
       │      - Browse by category
       │      - Save favorites
       │
       ├─── → [GOAL SHEET] ← Track financial progress
       │      - See earnings in real-time
       │      - Monitor progress toward targets
       │      - Adjust goals as needed
       │      - Stay motivated with visible progress
       │
       ├─── → [PLAY ROLE] ← Practice scenarios
       │      - Hone objection handling
       │      - Build confidence
       │      - Get AI feedback
       │      - Track improvement over time
       │
       └─── → [POST-TOUR DEBRIEF] ← After each presentation
              - Reflect on performance
              - Track outcomes
              - Note learnings
              - Build improvement data
```

### How Each Module Drives Value

**DASHBOARD** → *Awareness & Motivation*
- Know where you stand at all times
- See progress toward goals
- Get motivated to take action

**PRE-TOUR MODE** → *Preparation & Focus*
- Enter each tour prepared
- Quick tactical reminders
- Right mindset for success

**AI COACH** → *In-the-Moment Support*
- Handle objections effectively
- Learn multiple approaches
- Build confidence through practice

**QUICK WINS** → *Continuous Learning*
- Apply new tactics immediately
- Expand toolkit daily
- Reference during sales situations

**GOAL SHEET** → *Accountability & Clarity*
- Clear financial targets
- Real-time earnings tracking
- Know exactly what it takes
- Stay motivated with visible progress

**PLAY ROLE** → *Skill Development*
- Practice without risk
- Get instant feedback
- Build muscle memory
- Track improvement over time

**POST-TOUR DEBRIEF** → *Continuous Improvement*
- Learn from every interaction
- Identify patterns
- Track what works
- Build data-driven insights

### Typical User Day (With Goal Sheet & Play Role)

**Morning (5 minutes)**
1. Open Dashboard → Check readiness score (72)
2. Review Goal Sheet → See earnings at $4,800 (80% of monthly target)
3. Check motivation → "Only $2,400 more to hit goal!"

**Before First Tour (2 minutes)**
1. Open Pre-Tour Mode → Quick mindset reset
2. Review daily goal → "Need 3 sales today"

**During Downtime Between Tours**
1. Quick Wins → Learn one new tactic
2. OR Play Role → Practice 1 scenario (get 8.5/10 score)

**During Challenging Tour**
1. AI Coach → "Client says price is too high"
2. Get 3 approaches → Use emotional approach
3. Save the deal! 💰

**After Each Tour (1 minute)**
1. Post-Tour Debrief → Log outcome
2. Check Goal Sheet → See earnings update to $5,400
3. Get motivation → "On track for $15,000 month!"

**Evening (5 minutes)**
1. Dashboard → Review day's performance
2. Goal Sheet → Celebrate hitting 36% of monthly goal
3. Play Role → Practice one more scenario (end day strong)

### Value Metrics

**Before Goal Sheet & Play Role:**
- 😐 "I think I'm doing OK this month"
- 😕 "I hope I hit my numbers"
- 😰 "I'm not sure how to handle that objection"

**After Goal Sheet & Play Role:**
- 💪 "I'm at $5,400 and need 6 more sales to hit $15k"
- 🎯 "I'm 3 days ahead of last month's pace"
- 🏆 "I improved my price objection score from 7.2 to 8.5"
- 🚀 "I'm getting better every single day"

---

## COMPONENT LIBRARY

### Buttons

**Primary (Gold)**
```
┌─────────────────────────────────────┐
│          Start Tour                 │
└─────────────────────────────────────┘
```
- Background: #D4AF37
- Text: Black (#020204)
- Use: Main CTAs only
- Border-radius: 12px
- Padding: 16px 24px
- Hover: 10% lighter
- Active: 10% darker

**Secondary (Navy)**
```
┌─────────────────────────────────────┐
│         View Details                │
└─────────────────────────────────────┘
```
- Background: #1E3A8A
- Text: White
- Use: Secondary actions
- Border-radius: 12px
- Padding: 16px 24px
- Hover: 10% lighter

**Outline**
```
┌─────────────────────────────────────┐
│    ━━━━━━━ Apply Now ━━━━━━━       │
└─────────────────────────────────────┘
```
- Background: Transparent
- Border: 1px solid #D4AF37
- Text: Gold
- Use: Tertiary actions
- Border-radius: 12px
- Padding: 16px 24px

**Icon Only**
```
   ┌───┐
   │ ⚡ │
   └───┘
```
- Circular, 48px
- Background: #1E293B
- Icon: White, 24px
- Hover: Subtle glow
- Border-radius: 50%

### Cards

**Default Card**
```
┌─────────────────────────────────────┐
│ ╔═════════════════════════════════╗ │
│ ║  Card Title                      ║ │
│ ║  Card content goes here...       ║ │
│ ╚═════════════════════════════════╝ │
└─────────────────────────────────────┘
```
- Background: #1E293B
- Border: 1px solid #334155
- Border-radius: 16px
- Padding: 16px
- Shadow: Subtle, dark (0px 4px 6px rgba(0,0,0,0.3))

**Active Card**
```
┌─────────────────────────────────────┐
│ ╔═════════════════════════════════╗ │
│ ║ 🌟 Selected Card                 ║ │
│ ║  Card content...                 ║ │
│ ╚═════════════════════════════════╝ │
└─────────────────────────────────────┘
```
- Background: #1E293B
- Border: 1px solid #D4AF37 (gold)
- Subtle gold glow (box-shadow: 0 0 12px rgba(212, 175, 55, 0.3))

**Success Card**
```
┌─────────────────────────────────────┐
│ ╔═════════════════════════════════╗ │
│ ║ ✅ Achievement Unlocked!         ║ │
│ ╚═════════════════════════════════╝ │
└─────────────────────────────────────┘
```
- Border: 1px solid #22C55E (green)
- Green glow (box-shadow: 0 0 12px rgba(34, 197, 94, 0.3))

### Progress Indicators

**Circular Progress**
```
      ⭕  72
```
- Gradient: Gold (#D4AF37) to Navy (#1E3A8A)
- Track: Dark gray (#334155)
- Thickness: 8px
- Size: 120px (large), 64px (medium), 48px (small)

**Linear Progress**
```
████████░░░░░░░░░░░
```
- Background: Dark gray (#334155)
- Fill: Gold gradient (#D4AF37 → #1E3A8A)
- Height: 8px
- Border-radius: 4px
- Animation: Smooth fill on load

### Typography Scale

**H1 - 32px Bold**
```
Readiness Score
```
- Use: Main headings
- Color: #F1F5F9
- Line-height: 1.2

**H2 - 24px Bold**
```
Daily Goals
```
- Use: Section titles
- Color: #F1F5F9
- Line-height: 1.3

**H3 - 20px Medium**
```
Breaking The Pact
```
- Use: Card titles
- Color: #F1F5F9
- Line-height: 1.4

**Body - 16px Regular**
```
This is the main body text for descriptions
and content throughout the app.
```
- Use: Body text, descriptions
- Color: #94A3B8
- Line-height: 1.5

**Caption - 14px Regular**
```
Secondary information
```
- Use: Secondary text, labels
- Color: #64748B
- Line-height: 1.4

**Small - 12px Medium**
```
MINDSET • 2 MIN
```
- Use: Labels, badges, timestamps
- Color: #64748B
- Line-height: 1.3

### Icons

**Style**: Linear icons (Lucide or Feather Icons)

**Sizes**:
- Small: 16px
- Default: 24px
- Large: 32px
- XLarge: 48px

**Colors**:
- Default: White (#F1F5F9)
- Accent: Gold (#D4AF37)
- Muted: #64748B
- Success: #22C55E
- Error: #EF4444

**Key Icons**:
- ⚡ Lightning (Pre-Tour)
- 🤖 Robot (AI Coach)
- 📚 Book (Quick Wins)
- 📝 Document (Post-Tour)
- 💰 Money Bag (Goal Sheet)
- 🎭 Theater Masks (Play Role)
- 👤 Person (Profile)
- ⚙️ Settings
- 🔥 Fire (Streak)
- 🎯 Target (Goals)
- 📊 Chart (Progress)
- ⭐ Star (Favorites)
- ✓ Check (Success)
- ✕ Close
- → Arrow (Back/Next)
- 🎙️ Microphone (Voice Input)
- 🧠 Brain (AI Learning)

---

## COLOR PALETTE

### Primary Colors
```
Black:         #020204  ████
Dark Navy:     #1E3A8A  ████
Card BG:       #1E293B  ████
Border:        #334155  ████
```

### Accent Colors
```
Gold Primary:  #D4AF37  ████
Gold Light:    #F5D77A  ████
Gold Dark:     #B8941F  ████
```

### Status Colors
```
Success:       #22C55E  ████
Warning:       #F59E0B  ████
Error:         #EF4444  ████
Info:          #3B82F6  ████
```

### Text Colors
```
Primary:       #F1F5F9  ████████████
Secondary:     #94A3B8  ████████
Muted:         #64748B  ██████
Gold Accent:   #D4AF37  ████
```

### Category Colors
```
Mindset:       #A855F7  ████
Objections:    #EF4444  ████
Closing:       #22C55E  ████
Presentation:  #3B82F6  ████
Storytelling:  #F97316  ████
```

---

## SPACING SYSTEM

### Scale
```
XS:  4px   (0.25rem)
S:   8px   (0.5rem)
M:   16px  (1rem)
L:   24px  (1.5rem)
XL:  32px  (2rem)
XXL: 48px  (3rem)
```

### Usage
- Card padding: M (16px)
- Section spacing: XL (32px)
- Element spacing: M (16px)
- Button padding: M horizontally, L vertically
- Grid gap: M (16px)

---

## ANIMATION & MICRO-INTERACTIONS

### Page Transitions
```css
/* Forward navigation */
transform: translateX(100%) → translateX(0)
duration: 300ms
easing: ease-in-out

/* Back navigation */
transform: translateX(0) → translateX(-100%)
duration: 300ms
easing: ease-in-out
```

### Card Interactions
```css
/* Hover state */
transform: scale(1.02)
duration: 150ms
easing: ease-out

/* Press state */
transform: scale(0.98)
duration: 100ms
easing: ease-in
```

### Loading States

**Skeleton Screen**
```css
background: linear-gradient(
  90deg,
  #1E293B 0%,
  #334155 50%,
  #1E293B 100%
)
animation: shimmer 1.5s infinite
```

**Spinner**
```
Rotating gold ring
Size: 32px
Duration: 1s
Infinite loop
```

**Pulse**
```css
opacity: 1 → 0.5 → 1
duration: 2s
infinite loop
```

### Success Feedback

**Checkmark Animation**
```css
1. Scale in (0 → 1)
2. Rotate 45°
3. Draw checkmark
duration: 400ms
```

**Confetti**
```
Trigger: On achievements
Duration: 2s
Count: 50 particles
Colors: Gold, Navy, White
```

**Haptic Feedback**
```
Light: 15ms - On tap
Medium: 25ms - On card expand
Heavy: 50ms - On achievement
```

---

## DELIVERABLES

### Required Outputs

**1. Design System File**
- All components with variants
- Color palette
- Typography scale
- Spacing system
- Icon set
- Token specifications

**2. High-Fidelity Screens**
- Screen 1: Dashboard (with all states)
- Screen 2: Pre-Tour Mode (with animations)
- Screen 3: AI Coach Chat (with empty and populated states)
- Screen 4: Quick Wins Library (with filters applied)
- Screen 5: Post-Tour Debrief (with all outcomes)
- Screen 6: Goal Sheet (with income breakdown)
- Screen 7: Play Role (with practice mode)

**3. Component Library**
- All reusable components
- Interactive states (hover, active, disabled)
- Loading states
- Error states

**4. Icon Set**
- All icons in 3 sizes (16px, 24px, 48px)
- In gold and white variants
- SVG format

**5. Interactive Prototype**
- Basic navigation flow
- Key interactions
- Transitions between screens

### File Format
- **Primary**: Figma (.fig)
- **Export**: SVG (icons), PNG (images @2x, @3x)

### Code Export
If possible, include:
- CSS/React Native style specifications
- Color variables
- Spacing tokens
- Component props documentation

---

## DESIGN REFERENCES

### Similar Apps for Inspiration

**Duolingo**
- Gamification elements (streaks, daily goals)
- Achievements and badges
- Progress visualization
- Motivational messaging

**Headspace**
- Calm, focused interface
- Dark theme with accent colors
- Minimal distractions
- breathing/pulsing animations

**Notion**
- Clean, card-based layouts
- Typography hierarchy
- Subtle borders and depth
- Professional aesthetic

**Strava**
- Performance tracking
- Data visualization
- Activity feeds
- Goal progress

### Design Inspiration
- **Dark Mode UI**: Twitter Dark, Discord, Spotify
- **Premium Feel**: American Express, Blackberry
- **Data Viz**: Apple Health, Google Fit

### Avoid
- ❌ Pure white backgrounds
- ❌ Generic blue primary colors
- ❌ Cluttered interfaces
- ❌ Small touch targets (< 44px)
- ❌ Generic chat interfaces
- ❌ Overuse of gradients
- ❌ Cartoonish illustrations

---

## ACCESSIBILITY GUIDELINES

### Color Contrast
- All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Gold on black: 8.5:1 ✅
- White on navy: 7.8:1 ✅
- Gray on dark: 4.7:1 ✅

### Touch Targets
- Minimum size: 44x44px
- Recommended: 48x48px
- Spacing: At least 8px between targets

### Typography
- Minimum body text: 16px
- Line height: 1.5 for body text
- Paragraph spacing: 16px minimum

### Screen Reader Support
- All icons have labels
- Images have alt text
- Interactive elements announce state
- Semantic HTML structure

---

## DESIGN GOALS & PRINCIPLES

### Primary Objectives

**1. Immediate Confidence**
- User should feel capable and motivated
- Positive reinforcement throughout
- Clear progress indicators
- Celebrate small wins

**2. Quick Actions**
- Complete key tasks in < 60 seconds
- Minimize steps to value
- Smart defaults
- Predictable navigation

**3. Performance Focus**
- Data visible but not overwhelming
- Key metrics front and center
- Historical context available
- Actionable insights

**4. Premium Feel**
- Every detail intentional
- Smooth animations
- Consistent spacing
- Quality polish

**5. Sales Floor Ready**
- Designed for use during work
- Offline-first approach
- Quick load times
- Battery efficient

### Success Metrics
- **Engagement**: 5+ opens per day
- **Session Duration**: 2-3 minutes average
- **Task Completion**: >80% completion rate
- **User Satisfaction**: 4.5+ star rating

---

## TECHNICAL SPECIFICATIONS

### Platform
- **OS**: iOS 14+, Android 10+
- **Screen Sizes**: 
  - iPhone: 375x812 (base), 390x844, 428x926
  - Android: 360x640 (base), 360x780, 411x823

### Performance Targets
- **App Launch**: < 2 seconds
- **Screen Load**: < 500ms
- **Animation**: 60fps
- **API Response**: < 1 second local, < 3s remote

### File Size Limits
- **App Bundle**: < 50MB
- **Images**: WebP format, compressed
- **Icons**: SVG (scale as needed)

---

## TESTING CHECKLIST

### Design Validation
- [ ] All 5 screens designed
- [ ] Component library complete
- [ ] Color palette defined
- [ ] Typography scale set
- [ ] Icon set exported
- [ ] Prototype functional
- [ ] Transitions animated
- [ ] Loading states defined
- [ ] Error states designed
- [ ] Empty states included

### User Testing
- [ ] Navigation flow tested
- [ ] Touch targets validated
- [ ] Text readability confirmed
- [ ] Color contrast verified
- [ ] Performance acceptable
- [ ] Feedback clear

### Stakeholder Review
- [ ] Product team approval
- [ ] Sales team feedback
- [ ] Technical feasibility confirmed
- [ ] Brand alignment verified

---

## NEXT STEPS AFTER DESIGN

### Phase 1: Asset Preparation
1. Export all icons (SVG, PNG @2x, @3x)
2. Export images (WebP format)
3. Create design tokens JSON
4. Document component specs

### Phase 2: Component Library
1. Set up React Native project structure
2. Create base components (Button, Card, Input)
3. Implement design tokens
4. Create component stories

### Phase 3: Screen Implementation
1. Login screen (start here)
2. Dashboard
3. Pre-Tour Mode
4. AI Coach Chat
5. Quick Wins Library
6. Post-Tour Debrief
7. Goal Sheet
8. Play Role

### Phase 4: Integration
1. Connect to backend API
2. Implement state management
3. Add navigation
4. Test user flows

### Phase 5: Polish
1. Animations and transitions
2. Error handling
3. Loading states
4. Performance optimization
5. User testing

---

## DESIGN HANDOFF CHECKLIST

### For Designers
- [ ] All screens exported
- [ ] Components documented
- [ ] Tokens specified
- [ ] Interactions defined
- [ ] Assets organized
- [ ] Style guide created

### For Developers
- [ ] Design system imported
- [ ] Components implemented
- [ ] Tokens configured
- [ ] Navigation built
- [ ] API integrated
- [ ] Tested on devices

---

## CONTACT & COLLABORATION

### Design Review Process
1. Initial draft review
2. Feedback iteration
3. Stakeholder approval
4. Final polish
5. Developer handoff

### Feedback Channels
- Design reviews: Weekly
- Async feedback: Figma comments
- Urgent issues: Slack DM
- Questions: Design team huddle

---

## APPENDIX

### Color Mapping (React Native)
```javascript
export const colors = {
  primary: {
    black: '#020204',
    navy: '#1E3A8A',
    card: '#1E293B',
    border: '#334155',
  },
  accent: {
    gold: '#D4AF37',
    goldLight: '#F5D77A',
    goldDark: '#B8941F',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    muted: '#64748B',
  },
};
```

### Typography Mapping (React Native)
```javascript
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
};
```

### Spacing Mapping (React Native)
```javascript
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};
```

---

**Document Version**: 1.0
**Last Updated**: 2026-04-05
**Design Tool**: Stitch (or Figma)
**Status**: Ready for Design Phase

---

## 🎯 DESIGN OBJECTIVE

Create a mobile app that sales representatives will open **5+ times per day** because it helps them close more deals.

**Every design decision should answer: "Does this help them sell more?"**

---

**End of Design Specification**
