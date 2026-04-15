# 🔄 VCSA - Flujos de Usuario Detallados

**Fecha**: 15 de Abril, 2026
**Versión**: 1.0
**Estado**: Active Development

---

## 📋 TABLA DE CONTENIDOS

1. [Flujos Principales de Usuario](#flujos-principales-de-usuario)
2. [Flujos Secundarios](#flujos-secundarios)
3. [Flujos de Administración](#flujos-de-administración)
4. [Flujos de Error Handling](#flujos-de-error-handling)
5. [Matriz de Estados por Flow](#matriz-de-estados-por-flow)
6. [Prioridades de Implementación](#prioridades-de-implementación)

---

## 🎯 FLUJOS PRINCIPALES DE USUARIO

### 1️⃣ **FLUJO DE REGISTRO Y ONBOARDING**

#### **1.1 Registro de Nuevo Usuario**

```
┌─────────────────────────────────────────────────────────────┐
│                     LANDING PAGE                             │
│                    (vcsavibes.com)                          │
│  [Hero Section] → [CTA: "Start Your Journey"]              │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "Get Started"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    REGISTER PAGE                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Name: [_________________]                          │  │
│  │  Email: [_________________]                         │  │
│  │  Password: [_______________]                        │  │
│  │  Confirm: [_______________]                         │  │
│  │                                                      │  │
│  │  [ ] I agree to Terms & Conditions                  │  │
│  │                                                      │  │
│  │  [Create Account]                    [Sign in with │  │
│  │                                     Google]         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Submit Form
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    VALIDATION                                │
│  - Email format check                                        │
│  - Password strength (min 8 chars)                          │
│  - Email uniqueness check                                   │
└──────────┬────────────────────────┬──────────────────────────┘
           │ Valid                  │ Invalid
           ▼                        ▼
┌──────────────────────┐   ┌──────────────────────────────────┐
│  SUCCESS             │   │  ERROR                           │
│  - Account created   │   │  - Show inline errors            │
│  - Send welcome email│   │  - Highlight invalid fields      │
│  - Auto-login        │   └──────────────────────────────────┘
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                 EMAIL VERIFICATION (Optional)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Welcome to VCSA!                                    │  │
│  │  Please verify your email:                          │  │
│  │  [Verify Email Button]                              │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click verification
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               ONBOARDING WIZARD                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Step 1: Welcome                                      │  │
│  │  [Next: Tell us about yourself]                       │  │
│  │                                                       │  │
│  │  Step 2: Experience Level                             │  │
│  │  ○ New Rep (0-6 months)                              │  │
│  │  ○ Developing Rep (6-18 months)                      │  │
│  │  ○ Performing Rep (18+ months)                       │  │
│  │  [Next: Set your goals]                              │  │
│  │                                                       │  │
│  │  Step 3: Goals                                        │  │
│  │  ☑ Master objections                                 │  │
│  │  ☑ Close consistently                                │  │
│  │  ☑ Become Top Producer                               │  │
│  │  [Complete Setup]                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Complete
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  FIRST MODULE ASSIGNMENT                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎯 Your First Step                                   │  │
│  │                                                       │  │
│  │  Start with: "Introduction: The Pro Mindset"         │  │
│  │  Track: Pro Mindset → Module 1.1                     │  │
│  │                                                       │  │
│  │  [Start Module]              [Explore Other Content] │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🟡 70% Complete
**Components Needed**:
- [x] Landing page
- [x] Registration form
- [x] Email validation
- [ ] Email verification flow (partial)
- [ ] Onboarding wizard (needs polish)
- [ ] First module assignment UI

**Priority**: P0 - Critical for user acquisition
**Target Sprint**: Sprint 3

---

### 2️⃣ **FLUJO DE COMPRA DE MEMBRESÍA VIP**

```
┌─────────────────────────────────────────────────────────────┐
│                   MEMBERSHIP PAGE                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Choose Your Plan                                     │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │   FREE      │  │   VIP       │  │  ELITE      │ │  │
│  │  │   $0/mo     │  │   $49/mo    │  │   $99/mo    │ │  │
│  │  │             │  │             │  │             │ │  │
│  │  │ • Basic     │  │ • All       │  │ • VIP +     │ │  │
│  │  │   training  │  │   training  │  │   coaching  │ │  │
│  │  │ • Community │  │ • VIP       │  │ • Priority  │ │  │
│  │  │             │  │   content   │  │   support   │ │  │
│  │  │             │  │ • No ads    │  │ • Live      │ │  │
│  │  │             │  │             │  │   sessions  │ │  │
│  │  │ [Current]   │  │ [Upgrade]   │  │ [Upgrade]   │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "Upgrade VIP"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  CHECKOUT PREVIEW                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Order Summary                                        │  │
│  │  ─────────────────────────────────────────────────   │  │
│  │  VIP Membership                        $49.00        │  │
│  │  Billed monthly                                     │  │
│  │                                                       │  │
│  │  Payment Information                                 │  │
│  │  [Card Number] [Exp Date] [CVC]                     │  │
│  │                                                       │  │
│  │  💳 Secure payment via Stripe                        │  │
│  │                                                       │  │
│  │  [Subscribe Now]                     [Cancel]       │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Submit Payment
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   STRIPE CHECKOUT                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Stripe Secure Checkout Modal]                      │  │
│  │  - 3D Secure verification (if needed)                │  │
│  │  - Payment processing                                │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           │ Success               │ Failed
           ▼                       ▼
┌──────────────────────┐  ┌──────────────────────────────────┐
│  PAYMENT SUCCESS     │  │  PAYMENT FAILED                  │
│  - Webhook received  │  │  - Show error message            │
│  - Update account    │  │  - Retry option                  │
│  - Send confirmation │  │  - Support contact               │
│  - Grant VIP access  │  └──────────────────────────────────┘
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                WELCOME VIP EXPERIENCE                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎉 Welcome to VIP!                                   │  │
│  │                                                       │  │
│  │  You now have access to:                             │  │
│  │  ✅ All 6 training tracks (36 modules)               │  │
│  │  ✅ 15 deal breakdowns                               │  │
│  │  ✅ 20 quick wins                                    │  │
│  │  ✅ VIP-only masterclasses                           │  │
│  │  ✅ Ad-free experience                               │  │
│  │                                                       │  │
│  │  [Start Training]         [Explore VIP Features]    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🟡 75% Complete
**Components Needed**:
- [x] Membership page
- [x] Stripe checkout integration
- [ ] Webhook handling (needs testing)
- [ ] VIP confirmation experience
- [ ] Payment failure handling
- [ ] Subscription management UI

**Priority**: P0 - Critical for revenue
**Target Sprint**: Sprint 1

---

### 3️⃣ **FLUJO DE PROGRESO DE ENTRENAMIENTO**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER DASHBOARD                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Welcome back, [User Name]!                          │  │
│  │                                                       │  │
│  │  Your Progress: Stage 1 - New Rep                   │  │
│  │  ████████░░░░░░░░░░░ 45/150 points                   │  │
│  │                                                       │  │
│  │  🎯 Your Next Step:                                  │  │
│  │  Track: Pro Mindset → Module 1.2                     │  │
│  │  "The Performance Mindset"                           │  │
│  │  [Continue Learning]                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "Continue Learning"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   TRACK DETAIL PAGE                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Track 1: Pro Mindset                                │  │
│  │  Progress: ████████░░░░ 4/6 modules                  │  │
│  │                                                       │  │
│  │  Modules:                                            │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ 1.1 ✓ Introduction: The Pro Mindset         │   │  │
│  │  │ 1.2 [▶] The Performance Mindset ← CURRENT   │   │  │
│  │  │ 1.3 ○ Handling Rejection Like a Pro         │   │  │
│  │  │ 1.4 ○ Consistency Over Talent               │   │  │
│  │  │ 1.5 ○ Ownership Mentality                   │   │  │
│  │  │ 1.6 ○ The Energy Management System          │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click Module 1.2
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    MODULE VIEWER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ← Back to Track 1            Mark Complete → [✓]   │  │
│  │                                                       │  │
│  │  Module 1.2: The Performance Mindset                │  │
│  │  Duration: 8 min | Difficulty: Beginner             │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │                                              │   │  │
│  │  │        [VIDEO PLAYER]                       │   │  │
│  │  │        YouTube/Vimeo Embed                   │   │  │
│  │  │                                              │   │  │
│  │  │        [Play controls, progress bar]         │   │  │
│  │  │                                              │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  Description:                                        │  │
│  │  Learn how top performers think differently...      │  │
│  │                                                       │  │
│  │  🎯 KEY MOVE FROM THIS LESSON:                       │  │
│  │  "Adopt the 'Next Rep' mindset - every              │  │
│  │   interaction is a fresh start"                     │  │
│  │                                                       │  │
│  │  [Save for Later]    [Download Notes]    [Discuss]  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Video completes
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   COMPLETION FLOW                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✅ Module Completed!                                 │  │
│  │                                                       │  │
│  │  You earned 10 points                                │  │
│  │  Track Progress: ████████░░░░ 5/6                    │  │
│  │                                                       │  │
│  │  🏆 Achievement Unlocked:                            │  │
│  │  "First Steps" - Complete your first module         │  │
│  │                                                       │  │
│  │  Readiness Score Updated: 42% → 45%                 │  │
│  │                                                       │  │
│  │  [Next Module]    [Back to Dashboard]    [Discuss]  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKGROUND UPDATES                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • User progress saved to database                   │  │
│  │  • Points awarded (10 pts)                           │  │
│  │  • Readiness score recalculated                      │  │
│  │  • Badges checked and awarded                        │  │
│  │  • Training streak updated                           │  │
│  │  • Activity logged for analytics                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🟢 90% Complete
**Components Needed**:
- [x] Dashboard with progress
- [x] Track detail page
- [x] Module viewer
- [x] Video player integration
- [x] Completion tracking
- [x] Points & badges system
- [ ] Offline mode (future)
- [ ] Video download (future)

**Priority**: P0 - Core functionality
**Target Sprint**: Sprint 1 (polish only)

---

### 4️⃣ **FLUJO PRE-TOUR TACTICAL MODE**

```
┌─────────────────────────────────────────────────────────────┐
│                   QUICK WINS LIBRARY                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎯 Pre-Tour Tactical Mode                           │  │
│  │  Quick reference before your next tour              │  │
│  │                                                       │  │
│  │  Filter by Situation:                                │  │
│  │  [All] [Before Tour] [Closing] [Objections] [Stuck] │  │
│  │                                                       │  │
│  │  Quick Wins (20 total):                              │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ 1. How to Answer "We Need to Think About It" │  │  │
│  │  │    Tag: objections, closing_help             │  │  │
│  │  │    [Watch 3 min] [Apply Now]                 │  │  │
│  │  ├──────────────────────────────────────────────┤  │  │
│  │  │ 2. How to Create Urgency Without Pressure   │  │  │
│  │  │    Tag: before_tour, closing                │  │  │
│  │  │    [Watch 4 min] [Apply Now]                 │  │  │
│  │  ├──────────────────────────────────────────────┤  │  │
│  │  │ 3. How to Handle "That's Too Expensive"      │  │  │
│  │  │    Tag: objections, price                    │  │  │
│  │  │    [Watch 3 min] [Apply Now]                 │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click Quick Win #1
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    QUICK WIN VIEWER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ← Back to Quick Wins                                │  │
│  │                                                       │  │
│  │  How to Answer "We Need to Think About It"           │  │
│  │  Duration: 3 min | Tag: objections, closing_help    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │                                              │   │  │
│  │  │        [VIDEO PLAYER]                       │   │  │
│  │  │        Quick win video content               │   │  │
│  │  │                                              │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  🎯 THE TACTIC:                                      │  │
│  │  "The 'Think About It' objection usually means      │  │
│  │   they don't see enough value yet. Here's how      │  │
│  │   to handle it..."                                  │  │
│  │                                                       │  │
│  │  Example Dialogue:                                   │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ Rep: "I completely understand you want to   │   │  │
│  │  │      think about this. Let me ask - what    │   │  │
│  │  │      specific aspect would you like to      │   │  │
│  │  │      think about?"                          │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  [✓ Applied This Tactic]    [Save for Later]        │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "Applied This Tactic"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   TACTIC APPLIED FLOW                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✅ Tactic Applied!                                   │  │
│  │                                                       │  │
│  │  You earned 3 points                                 │  │
│  │  Quick Wins Applied: 12/20                           │  │
│  │                                                       │  │
│  │  💡 Training Tip:                                     │  │
│  │  "Come back and review this tactic after            │  │
│  │   your next 3 tours to reinforce the                │  │
│  │   technique"                                         │  │
│  │                                                       │  │
│  │  [See More Tactics]    [Back to Dashboard]          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKGROUND UPDATES                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Quick win marked as "applied"                    │  │
│  │  • Points awarded (3 pts)                            │  │
│  │  • Quick wins count updated                          │  │
│  │  • Readiness score updated                           │  │
│  │  • Activity logged with context                      │  │
│  │  • Training streak updated                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🟢 85% Complete
**Components Needed**:
- [x] Quick wins library page
- [x] Tag filtering system
- [x] Quick win viewer
- [x] Apply tactic tracking
- [ ] Improved filter UI
- [ ] Search functionality
- [ ] Related tactics suggestions

**Priority**: P1 - High value feature
**Target Sprint**: Sprint 2

---

### 5️⃣ **FLUJO DE DEAL BREAKDOWN REVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│                   DEAL BREAKDOWNS LIBRARY                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎯 Real Deal Breakdowns                             │  │
│  │  Learn from real sales scenarios                    │  │
│  │                                                       │  │
│  │  Breakdowns (15 total):                              │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ 1. Lost Control After Price Reveal            │  │  │
│  │  │    Status: Lost | Root cause identified       │  │  │
│  │  │    [Watch Breakdown]                          │  │  │
│  │  ├──────────────────────────────────────────────┤  │  │
│  │  │ 2. The Missing Spouse Objection               │  │  │
│  │  │    Status: Lost | Root cause identified       │  │  │
│  │  │    [Watch Breakdown]                          │  │  │
│  │  ├──────────────────────────────────────────────┤  │  │
│  │  │ 3. The "Think About It" Collapse              │  │  │
│  │  │    Status: Lost | Root cause identified       │  │  │
│  │  │    [Watch Breakdown]                          │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click Breakdown #1
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    DEAL BREAKDOWN VIEWER                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ← Back to Deal Breakdowns                            │  │
│  │                                                       │  │
│  │  Breakdown: Lost Control After Price Reveal          │  │
│  │  Status: LOST | Duration: 12 min                    │  │
│  │                                                       │  │
│  │  📊 THE SCENARIO:                                     │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ Customer Profile:                            │   │  │
│  │  │ - Age: 45, Married                           │   │  │
│  │  │ - Budget: $25K                               │   │  │
│  │  │ - Motivation: Family vacations               │   │  │
│  │  │                                               │   │  │
│  │  │ The Tour:                                    │   │  │
│  │  │ - Great rapport built                        │   │  │
│  │  │ - Strong value presentation                  │   │  │
│  │  │ - Price reveal at $28K                       │   │  │
│  │  │ - Customer objection: "That's too much"      │   │  │
│  │  │ - Rep lost control, couldn't recover         │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  🎯 KEY LEARNING POINTS:                             │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ 1. Price reveal timing issue                │   │  │
│  │  │ 2. No trial close before price              │   │  │
│  │  │ 3. Lost control after objection             │   │  │
│  │  │ 4. Didn't isolate the real objection        │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  💡 WHAT TO DO INSTEAD:                              │  │
│  │  [Detailed explanation with examples]                │  │
│  │                                                       │  │
│  │  [✓ Reviewed This Breakdown]    [Related Modules]   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "Reviewed This Breakdown"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BREAKDOWN REVIEW FLOW                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✅ Breakdown Reviewed!                               │  │
│  │                                                       │  │
│  │  You earned 5 points                                 │  │
│  │  Breakdowns Reviewed: 3/15                           │  │
│  │                                                       │  │
│  │  🎯 Recommended Next Step:                            │  │
│  │  "Module 3.5: Price Positioning"                     │  │
│  │  [Continue Learning]                                 │  │
│  │                                                       │  │
│  │  [See More Breakdowns]    [Back to Dashboard]       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🟢 90% Complete
**Components Needed**:
- [x] Deal breakdowns library
- [x] Detailed scenario view
- [x] Review tracking
- [x] Related content suggestions
- [ ] Video content for breakdowns
- [ ] Discussion forum for breakdowns

**Priority**: P0 - High value content
**Target Sprint**: Sprint 1

---

## 🔄 FLUJOS SECUNDARIOS

### 6️⃣ **FLUJO DE COMUNIDAD Y ENGAGEMENT**

```
┌─────────────────────────────────────────────────────────────┐
│                    COMMUNITY FEED                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  💬 Community                                        │  │
│  │  Connect with fellow sales professionals            │  │
│  │                                                       │  │
│  │  [+ New Post] [Trending] [Recent] [Following]       │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ @sales_pro • 2h ago                          │   │  │
│  │  │ Just closed my first deal using the         │   │  │
│  │  │ "Think About It" tactic! 🎉                 │   │  │
│  │  │                                             │   │  │
│  │  │ [💬 12 comments] [❤️ 45 likes] [🔗 Share]   │   │  │
│  │  ├─────────────────────────────────────────────┤   │  │
│  │  │ @top_producer • 5h ago                      │   │  │
│  │  │ Question: How do you handle the price       │   │  │
│  │  │ objection when they haven't seen the        │   │  │
│  │  │ full property yet?                          │   │  │
│  │  │                                             │   │  │
│  │  │ [💬 28 comments] [❤️ 67 likes] [🔗 Share]   │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "+ New Post"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    CREATE POST                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Create a Post                                        │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ What's on your mind?                         │   │  │
│  │  │                                             │   │  │
│  │  │ [Text area for post content]               │   │  │
│  │  │                                             │   │  │
│  │  │ [📷 Add Image] [🎥 Add Video] [📎 Attach]   │   │  │
│  │  │                                             │   │  │
│  │  │ Tags: [Add tags...]                         │   │  │
│  │  │                                             │   │  │
│  │  │ [Cancel]                    [Post]          │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "Post"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    POST CREATED                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✅ Post Published!                                   │  │
│  │                                                       │  │
│  │  Your post is now live in the community              │  │
│  │                                                       │  │
│  │  [View Post]    [Create Another]    [Back to Feed]  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🔴 40% Complete
**Components Needed**:
- [x] Basic community feed
- [ ] Post creation (partial)
- [ ] Comment system
- [ ] Like/share functionality
- [ ] User following
- [ ] Notifications
- [ ] Moderation tools

**Priority**: P1 - Community building
**Target Sprint**: Sprint 3

---

## 🔧 FLUJOS DE ADMINISTRACIÓN

### 7️⃣ **FLUJO DE ADMIN PANEL**

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎛️ Admin Panel                                       │  │
│  │                                                       │  │
│  │  Overview:                                            │  │
│  │  ┌───────────┬───────────┬───────────┬───────────┐ │  │
│  │  │ Total     │ Active    │ VIP       │ New This  │ │  │
│  │  │ Users     │ Users     │ Users     │ Week      │ │  │
│  │  │ 1,234     │ 856       │ 123       │ 45        │ │  │
│  │  └───────────┴───────────┴───────────┴───────────┘ │  │
│  │                                                       │  │
│  │  Quick Actions:                                      │  │
│  │  [Manage Users] [Content] [Analytics] [Settings]    │  │
│  │                                                       │  │
│  │  Recent Activity:                                    │  │
│  │  • 5 new user registrations                          │  │
│  │  • 12 modules completed                              │  │
│  │  • 3 VIP upgrades                                    │  │
│  │  • 2 reported posts (action needed)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Click "Manage Users"
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    USER MANAGEMENT                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User Management                                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ Search: [_____________] [Filter by Role▼]    │   │  │
│  │  │                                             │   │  │
│  │  │ User List (showing 1-10 of 1,234):          │   │  │
│  │  │ ┌─────────────────────────────────────────┐ │   │  │
│  │  │ │ john@email.com  │ VIP  │ Active │ [Edit]│ │   │  │
│  │  │ ├─────────────────────────────────────────┤ │   │  │
│  │  │ │ jane@email.com  │ Free │ Active │ [Edit]│ │   │  │
│  │  │ ├─────────────────────────────────────────┤ │   │  │
│  │  │ │ bob@email.com   │ VIP  │ Inactive│[Edit]│ │   │  │
│  │  │ └─────────────────────────────────────────┘ │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  [Export CSV]    [Bulk Actions]    [Add User]       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🟡 50% Complete
**Components Needed**:
- [x] Basic admin dashboard
- [ ] User management (partial)
- [ ] Content management
- [ ] Analytics dashboard
- [ ] Moderation tools
- [ ] System settings

**Priority**: P1 - Operations support
**Target Sprint**: Sprint 3

---

## ⚠️ FLUJOS DE ERROR HANDLING

### 8️⃣ **FLUJO DE ERROR HANDLING**

```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                           │
│                                                              │
│  Scenario 1: Network Error                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ⚠️ Connection Lost                                   │  │
│  │  We couldn't reach our servers. Please check        │  │
│  │  your internet connection.                           │  │
│  │                                                       │  │
│  │  [Retry]      [Refresh Page]    [Contact Support]   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Scenario 2: Authentication Error                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🔐 Session Expired                                   │  │
│  │  Your session has expired. Please log in again.     │  │
│  │                                                       │  │
│  │  [Log In Again]                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Scenario 3: Payment Error                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  💳 Payment Failed                                    │  │
│  │  We couldn't process your payment. Please try       │  │
│  │  a different payment method or contact support.      │  │
│  │                                                       │  │
│  │  Error Code: card_declined                            │  │
│  │                                                       │  │
│  │  [Try Again]    [Different Card]    [Contact Support]│  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Status Implementation**: 🟡 50% Complete
**Components Needed**:
- [x] Basic error messages
- [ ] Error recovery flows
- [ ] Support chat integration
- [ ] Detailed error logging

**Priority**: P1 - User experience
**Target Sprint**: Sprint 2

---

## 📊 MATRIZ DE ESTADOS POR FLOW

### Implementation Status Summary

| Flow | Status | Complete | Remaining | Priority | Sprint |
|------|--------|----------|-----------|----------|---------|
| **Registration & Onboarding** | 🟡 70% | 70% | 30% | P0 | S3 |
| **VIP Membership Purchase** | 🟡 75% | 75% | 25% | P0 | S1 |
| **Training Progress** | 🟢 90% | 90% | 10% | P0 | S1 |
| **Pre-Tour Tactical Mode** | 🟢 85% | 85% | 15% | P1 | S2 |
| **Deal Breakdown Review** | 🟢 90% | 90% | 10% | P0 | S1 |
| **Community Engagement** | 🔴 40% | 40% | 60% | P1 | S3 |
| **Admin Panel** | 🟡 50% | 50% | 50% | P1 | S3 |
| **Error Handling** | 🟡 50% | 50% | 50% | P1 | S2 |

### Critical Path Analysis

```
WEEK 1: VIP Purchase Flow + Training Progress Polish
WEEK 2: Error Handling + Pre-Tour Mode Improvements
WEEK 3: Community Flow + Onboarding Completion
WEEK 4: Admin Panel + Testing
```

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### Phase 1: Core User Flows (Sprint 1-2)
1. ✅ Training Progress Flow (polish)
2. ✅ Deal Breakdown Review Flow (polish)
3. 🔴 VIP Membership Purchase (complete webhooks)
4. 🔴 Error Handling (implement)
5. 🔴 Pre-Tour Tactical Mode (improve UI)

### Phase 2: Engagement Flows (Sprint 3-4)
1. 🔴 Community Flow (complete)
2. 🔴 Registration & Onboarding (polish)
3. 🔴 Admin Panel (complete)
4. 🔴 Event Registration Flow

### Phase 3: Advanced Flows (Sprint 5-8)
1. 🔴 Content Creation Flow
2. 🔴 Advanced Analytics
3. 🔴 Mobile Optimizations

---

## 📝 NOTAS DE IMPLEMENTACIÓN

### Technical Requirements

- **State Management**: Use React Context for user flows
- **Error Boundaries**: Implement for each major flow
- **Loading States**: Show skeletons during async operations
- **Progress Indicators**: Visual feedback for multi-step flows
- **Confirmation Dialogs**: For destructive actions

### UX Best Practices

- **Clear CTAs**: Every screen should have a clear next step
- **Progress Feedback**: Show completion percentage
- **Error Recovery**: Always provide a way forward
- **Consistent Navigation**: Back buttons on detail screens
- **Mobile First**: Design for smallest screen first

---

**Last Updated**: April 15, 2026
**Next Review**: Sprint 1 Planning
**Document Owner**: UX Designer + Product Owner

---

## 📚 RELATED FILES

- [PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md) - Overall production plan
- [TASK_TRACKING.md](./TASK_TRACKING.md) - Task tracking dashboard
- [PRD.md](./memory/PRD.md) - Product requirements
