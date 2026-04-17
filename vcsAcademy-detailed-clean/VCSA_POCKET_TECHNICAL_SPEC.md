# 📱 VCSA Pocket MVP - Especificación Técnica Detallada

**Complemento al Dashboard Estratégico**

---

## 🏗️ Arquitectura Técnica Pocket MVP

### Stack Tecnológico Definido

```
┌─────────────────────────────────────────────────────────────┐
│                  VCSA POCKET TECH STACK                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FRONTEND (React Native)                                     │
│  ├─ React Native 0.73+                                       │
│  ├─ TypeScript 5.0+                                          │
│  ├─ Redux Toolkit (state management)                         │
│  ├─ React Navigation 6.0+                                    │
│  ├─ Axios (API client)                                       │
│  ├─ Async Storage (local data)                               │
│  ├─ React Native Voice (input voz)                           │
│  ├─ Expo (build/deploy)                                      │
│  └─ Shadcn UI (componentes mobile)                           │
│                                                               │
│  BACKEND (Compartido VCSA Core)                              │
│  ├─ FastAPI (Python)                                         │
│  ├─ Motor (MongoDB async)                                    │
│  ├─ Ollama (AI inference)                                    │
│  ├─ Pydantic (validation)                                    │
│  └─ Redis (caching/sessions)                                 │
│                                                               │
│  AI & ML                                                      │
│  ├─ Ollama (llama3.1 model)                                  │
│  ├─ LangChain (prompt management)                            │
│  ├─ Vector DB (ChromaDB para context)                        │
│  └─ OpenAI API (fallback opcional)                           │
│                                                               │
│  INFRAESTRUCTURA                                             │
│  ├─ Docker (contenedores)                                    │
│  ├─ AWS/GCP (cloud hosting)                                  │
│  ├─ GitHub Actions (CI/CD)                                   │
│  ├─ Sentry (error tracking)                                  │
│  └─ Mixpanel (analytics)                                     │
│                                                               │
│  TESTING & QA                                                │
│  ├─ Jest (unit testing)                                      │
│  ├─ Detox (E2E testing)                                      │
│  ├─ Maestro (visual regression)                              │
│  └─ TestFlight (beta distribution iOS)                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Estructura del Proyecto

```
vcsa-pocket/
├── apps/
│   ├── mobile/                    # React Native App
│   │   ├── src/
│   │   │   ├── components/        # UI Components
│   │   │   │   ├── ai-coach/
│   │   │   │   ├── quick-wins/
│   │   │   │   ├── performance/
│   │   │   │   └── shared/
│   │   │   ├── screens/           # App Screens
│   │   │   │   ├── PreTourMode.tsx
│   │   │   │   ├── AICoachChat.tsx
│   │   │   │   ├── PostTourDebrief.tsx
│   │   │   │   ├── QuickWinsLibrary.tsx
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── services/          # Business Logic
│   │   │   │   ├── ai/
│   │   │   │   ├── performance/
│   │   │   │   ├── content/
│   │   │   │   └── sync/
│   │   │   ├── store/             # Redux Store
│   │   │   ├── utils/             # Helpers
│   │   │   └── types/             # TypeScript Types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── backend/                   # Shared Backend Extensions
│       ├── api/
│       │   ├── mobile/            # Mobile-specific endpoints
│       │   ├── ai/                # AI Coach endpoints
│       │   └── analytics/         # Performance endpoints
│       ├── services/
│       │   ├── ai_coach.py        # AI Coach Service
│       │   ├── performance.py     # Performance Tracking
│       │   └── content_sync.py    # Mobile Content Sync
│       └── requirements.txt
│
├── infrastructure/
│   ├── docker/                    # Docker configurations
│   ├── kubernetes/                # K8s configs (production)
│   └── terraform/                 # IaC for cloud resources
│
├── scripts/
│   ├── setup-dev.sh              # Development setup
│   ├── build.sh                  # Build scripts
│   └── deploy.sh                 # Deployment scripts
│
├── docs/
│   ├── API.md                    # API Documentation
│   ├── DEPLOYMENT.md             # Deployment Guide
│   └── TESTING.md                # Testing Guide
│
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
│
└── README.md
```

---

## 🔌 API Specification - Mobile Endpoints

### Authentication

```typescript
// POST /api/mobile/auth/login
interface MobileLoginRequest {
  email: string;
  password: string;
  device_info: {
    platform: 'ios' | 'android';
    device_id: string;
    push_token?: string;
  };
}

interface MobileLoginResponse {
  user: User;
  session_token: string;
  refresh_token: string;
  requires_onboarding: boolean;
}
```

### AI Coach Service

```typescript
// POST /api/mobile/ai/coach
interface AICoachRequest {
  input_type: 'text' | 'voice';
  content: string;  // Text or audio blob
  context: {
    client_type?: 'vip' | 'family' | 'investor';
    tour_number?: number;
    previous_objections?: string[];
    time_constraint?: number;  // seconds
  };
  preference?: {
    tone: 'motivational' | 'technical' | 'friendly';
    length: 'short' | 'medium' | 'detailed';
  };
}

interface AICoachResponse {
  interaction_id: string;
  responses: CoachingResponse[];
  key_move: string;
  confidence_score: number;
  estimated_impact: 'high' | 'medium' | 'low';
  suggested_next_steps: string[];
}

interface CoachingResponse {
  approach: 'emotional' | 'logical' | 'story-based';
  script: string;
  talking_points: string[];
  risk_factors: string[];
  expected_outcome: string;
}
```

### Quick Wins Service

```typescript
// GET /api/mobile/quick-wins
interface QuickWinsRequest {
  filters?: {
    category?: 'before_tour' | 'closing_help' | 'objections';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  };
  random?: boolean;
  limit?: number;
}

interface QuickWin {
  id: string;
  title: string;
  category: string;
  one_liner: string;
  action_steps: string[];
  timing: string;  // "30 sec before closing"
  video_url?: string;
  audio_url?: string;
  estimated_impact: number;  // 1-10
  favorite_count: number;
  is_favorite: boolean;
}
```

### Performance Tracking

```typescript
// POST /api/mobile/performance/tour
interface TourResult {
  tour_id: string;
  outcome: 'sale' | 'no_sale' | 'follow_up';
  duration_minutes: number;
  objections_handled: number;
  ai_coach_used: boolean;
  confidence_before: number;  // 1-10
  confidence_after: number;   // 1-10
  notes?: string;
  client_profile?: {
    type: string;
    budget: string;
    timeline: string;
  };
}

interface PerformanceUpdate {
  readiness_score: number;
  weekly_progress: WeeklyProgress;
  areas_of_improvement: string[];
  suggested_training: string[];
  streak_days: number;
}
```

### Offline Sync

```typescript
// GET /api/mobile/sync/content
interface SyncRequest {
  last_sync: string;
  device_content: string[];  // IDs of cached content
}

interface SyncResponse {
  new_content: ContentItem[];
  updated_content: ContentItem[];
  deleted_content: string[];
  server_time: string;
  next_sync: string;
}
```

---

## 🤖 AI Coach Implementation

### Prompt Engineering Templates

#### Template 1: Objection Handling

```python
OBJECTION_HANDLING_PROMPT = """
You are an expert vacation club sales coach with 20+ years of experience.
A prospect has raised the following objection: "{objection}"

CONTEXT:
- Client Type: {client_type}
- Tour Number: {tour_number}
- Previous Objections: {previous_objections}
- Time Available: {time_constraint} seconds

Generate 3 different approaches to handle this objection:

1. EMOTIONAL APPROACH: Focus on feelings, family, dreams
2. LOGICAL APPROACH: Focus on ROI, value, investment
3. STORY-BASED APPROACH: Use a relatable success story

For each approach, provide:
- Opening line (hook)
- 3 key talking points
- Risk factors to avoid
- Expected outcome
- Confidence score (0-1)

Also provide:
- ONE "Key Move" that applies to all approaches
- Estimated impact on closing probability
- Suggested follow-up if this doesn't work

Format your response as JSON.
"""

# Response format
{
  "emotional": {
    "opening": "...",
    "talking_points": ["...", "...", "..."],
    "risk_factors": ["...", "..."],
    "expected_outcome": "...",
    "confidence": 0.85
  },
  "logical": { ... },
  "story_based": { ... },
  "key_move": "Focus on the emotional value of family memories vs the cost",
  "estimated_impact": "high",
  "follow_up": "If they still object, pivot to payment options"
}
```

#### Template 2: Pre-Tour Preparation

```python
PRE_TOUR_PREP_PROMPT = """
You are a motivational sales coach preparing a rep for a vacation club tour.

REP PROFILE:
- Experience: {experience_level}
- Recent Performance: {recent_performance}
- Strengths: {strengths}
- Areas for Improvement: {areas_to_improve}

Generate a 2-minute motivational prep that includes:

1. MINDSET AFFIRMATION (30 seconds):
   - Positive reinforcement
   - Confidence builder
   - Focus on strengths

2. TACTICAL TIP (30 seconds):
   - One specific technique to focus on today
   - How to apply it
   - Expected impact

3. OBJECTION PREP (30 seconds):
   - Most likely objection for this client type
   - Quick win response
   - Practice trigger word

4. CLOSING REMINDER (30 seconds):
   - Goal for today
   - One thing to remember
   - Motivational closer

Keep it energetic, specific, and actionable. Format as spoken word.
"""
```

### Context Management System

```python
class AIContextManager:
    """Manages conversation context and learning"""

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.conversation_history = []
        self.user_profile = self._load_user_profile()
        self.performance_data = self._load_performance_data()

    def _load_user_profile(self) -> dict:
        """Load user's sales profile and preferences"""
        # From MongoDB user collection
        return {
            'experience_level': 'intermediate',
            'strengths': ['storytelling', 'relationship_building'],
            'weaknesses': ['closing', 'price_objections'],
            'preferred_tone': 'motivational',
            'communication_style': 'friendly'
        }

    def _load_performance_data(self) -> dict:
        """Load recent performance metrics"""
        # From MongoDB user_performance collection
        return {
            'recent_sales': 3,
            'conversion_rate': 0.25,
            'avg_tour_duration': 45,
            'common_objections': ['price', 'need_to_think']
        }

    def get_context_for_coaching(self, current_input: str) -> dict:
        """Build context dict for AI prompt"""
        return {
            'user_profile': self.user_profile,
            'performance_data': self.performance_data,
            'conversation_history': self.conversation_history[-5:],
            'current_input': current_input,
            'time_of_day': datetime.now().hour,
            'day_of_week': datetime.now().weekday()
        }

    def update_from_feedback(self, interaction_id: str, result: str):
        """Learn from sales outcomes"""
        # Store feedback for model improvement
        feedback = {
            'interaction_id': interaction_id,
            'result': result,  # 'success' | 'failure' | 'partial'
            'timestamp': datetime.now()
        }
        # Save to MongoDB for analytics
        self._store_feedback(feedback)
```

### Voice Input Processing

```typescript
// Voice Input Service
class VoiceInputService {
  private recognition: any;

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      // React Native Voice implementation
      Voice.onSpeechResults = (e: any) => {
        const transcript = e.value[0];
        resolve(transcript);
      };

      Voice.start('en-US');
    });
  }

  async stopListening(): Promise<void> {
    await Voice.stop();
    await Voice.destroy();
  }

  getConfidence(): number {
    // Return confidence score of speech recognition
    return 0.95; // Placeholder
  }
}

// Usage in AI Coach Screen
const handleVoiceInput = async () => {
  try {
    setIsListening(true);
    const transcript = await voiceService.startListening();

    // Send to AI Coach
    const response = await aiCoachService.generateResponse({
      input_type: 'voice',
      content: transcript,
      context: salesContext
    });

    setAIResponse(response);
  } catch (error) {
    console.error('Voice input error:', error);
  } finally {
    setIsListening(false);
  }
};
```

---

## 📊 Performance Tracking System

### Readiness Score Algorithm

```python
def calculate_readiness_score(user_id: str) -> dict:
    """
    Calculate daily readiness score based on multiple factors

    Readiness Score = (
        Training_Completion × 30% +
        Recent_Performance × 25% +
        Activity_Streak × 15% +
        AI_Coach_Usage × 10% +
        Quick_Wins_Applied × 10% +
        Mental_Game × 10%
    )
    """

    # Gather data
    user = await db.users.find_one({"user_id": user_id})
    progress = await db.user_progress.find({"user_id": user_id}).to_list(100)
    activity = await db.user_activity.find({"user_id": user_id}).to_list(50)

    # Calculate components
    training_score = calculate_training_completion(progress)
    performance_score = calculate_recent_performance(user_id)
    streak_score = calculate_activity_streak(activity)
    ai_usage_score = calculate_ai_coach_usage(activity)
    quick_wins_score = calculate_quick_wins_applied(progress)
    mental_game_score = calculate_mental_game_indicators(user)

    # Weighted score
    readiness_score = (
        training_score * 0.30 +
        performance_score * 0.25 +
        streak_score * 0.15 +
        ai_usage_score * 0.10 +
        quick_wins_score * 0.10 +
        mental_game_score * 0.10
    )

    return {
        "readiness_score": round(readiness_score, 1),
        "components": {
            "training": round(training_score, 1),
            "performance": round(performance_score, 1),
            "streak": round(streak_score, 1),
            "ai_usage": round(ai_usage_score, 1),
            "quick_wins": round(quick_wins_score, 1),
            "mental_game": round(mental_game_score, 1)
        },
        "trend": calculate_trend(user_id),  # 'improving' | 'stable' | 'declining'
        "recommended_actions": get_recommendations(readiness_score)
    }

def calculate_recent_performance(user_id: str) -> float:
    """Calculate performance score from last 30 days"""
    sales = await db.tour_results.find({
        "user_id": user_id,
        "date": {"$gte": datetime.now() - timedelta(days=30)}
    }).to_list(100)

    if not sales:
        return 0.5  # Base score for new users

    total_tours = len(sales)
    closed_deals = sum(1 for s in sales if s['outcome'] == 'sale')

    conversion_rate = closed_deals / total_tours

    # Score based on conversion rate
    if conversion_rate >= 0.30:
        return 1.0
    elif conversion_rate >= 0.25:
        return 0.85
    elif conversion_rate >= 0.20:
        return 0.70
    elif conversion_rate >= 0.15:
        return 0.55
    else:
        return 0.40
```

### Daily Goals System

```typescript
interface DailyGoal {
  goal_id: string;
  user_id: string;
  date: string;
  goals: {
    tours: number;
    sales: number;
    ai_coach_sessions: number;
    quick_wins_applied: number;
  };
  progress: {
    tours_completed: number;
    sales_closed: number;
    ai_sessions_used: number;
    quick_wins_used: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
}

class DailyGoalService {
  async generateDailyGoals(user_id: string): Promise<DailyGoal> {
    const user = await this.getUserProfile(user_id);
    const historical = await this.getHistoricalPerformance(user_id);

    // Smart goal setting based on past performance
    const avgTours = historical.avg_daily_tours || 3;
    const avgSales = historical.avg_daily_sales || 0.5;

    return {
      goal_id: generateId(),
      user_id: user_id,
      date: new Date().toISOString().split('T')[0],
      goals: {
        tours: Math.ceil(avgTours * 1.1),  // 10% stretch
        sales: Math.ceil(avgSales * 1.2),   // 20% stretch
        ai_coach_sessions: 3,
        quick_wins_applied: 2
      },
      progress: {
        tours_completed: 0,
        sales_closed: 0,
        ai_sessions_used: 0,
        quick_wins_used: 0
      },
      status: 'pending'
    };
  }

  async updateProgress(user_id: string, activity: Activity): Promise<void> {
    const goal = await this.getTodayGoal(user_id);

    // Update based on activity type
    switch (activity.type) {
      case 'tour_completed':
        goal.progress.tours_completed++;
        break;
      case 'sale_closed':
        goal.progress.sales_closed++;
        break;
      case 'ai_coach_used':
        goal.progress.ai_sessions_used++;
        break;
      case 'quick_win_applied':
        goal.progress.quick_wins_used++;
        break;
    }

    // Check if all goals met
    if (this.isComplete(goal)) {
      goal.status = 'completed';
      await this.celebrateAchievement(user_id);
    }

    await this.saveGoal(goal);
  }
}
```

---

## 🔄 Offline Mode Implementation

### Content Caching Strategy

```typescript
class OfflineContentManager {
  private CACHE_SIZE = 50;  // Number of items to cache
  private CACHE_DURATION = 24 * 60 * 60 * 1000;  // 24 hours

  async syncContent(): Promise<void> {
    // Determine what to cache
    const userPreferences = await this.getUserPreferences();
    const frequentlyUsed = await this.getFrequentlyUsedContent();

    // Fetch from API
    const content = await api.mobile.sync.content({
      last_sync: await this.getLastSyncTimestamp(),
      device_content: await this.getCachedContentIds()
    });

    // Cache new content
    await this.cacheContent(content.new_content);

    // Update existing content
    await this.updateCachedContent(content.updated_content);

    // Remove deleted content
    await this.removeCachedContent(content.deleted_content);

    // Update last sync timestamp
    await this.updateLastSyncTimestamp(content.server_time);
  }

  async cacheContent(items: ContentItem[]): Promise<void> {
    for (const item of items) {
      // Download media files
      if (item.video_url) {
        const videoPath = await this.downloadMedia(item.video_url);
        item.local_video_path = videoPath;
      }

      if (item.audio_url) {
        const audioPath = await this.downloadMedia(item.audio_url);
        item.local_audio_path = audioPath;
      }

      // Store in local database
      await AsyncStorage.setItem(
        `content_${item.id}`,
        JSON.stringify(item)
      );
    }
  }

  async getCachedContent(contentId: string): Promise<ContentItem | null> {
    const cached = await AsyncStorage.getItem(`content_${contentId}`);

    if (!cached) {
      return null;
    }

    const item = JSON.parse(cached);

    // Check if expired
    const age = Date.now() - item.cached_at;
    if (age > this.CACHE_DURATION) {
      await this.removeCachedContent(contentId);
      return null;
    }

    return item;
  }

  isOffline(): boolean {
    return !navigator.onLine;
  }
}

// Usage in AI Coach Screen
const AICoachScreen: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleAICoachRequest = async (input: string) => {
    if (isOffline) {
      // Use cached responses or fallback
      const cachedResponse = await getCachedResponse(input);
      if (cachedResponse) {
        setResponse(cachedResponse);
        return;
      }

      // Show offline message
      showOfflineToast();
      return;
    }

    // Online mode - call API
    const response = await api.mobile.ai.coach({ input });
    setResponse(response);

    // Cache for offline use
    await cacheResponse(input, response);
  };

  return (
    <View>
      {isOffline && <OfflineBanner />}

      <AIChatInterface
        onRequest={handleAICoachRequest}
        response={response}
      />
    </View>
  );
};
```

---

## 🎨 UI/UX Design Specifications

### Design System - Mobile

```typescript
// design-system.ts
export const Colors = {
  primary: '#D4AF37',      // Gold
  primaryDark: '#B4942D',
  secondary: '#1E3A8A',    // Navy
  background: '#020204',   // Dark background
  surface: '#1E293B',      // Card background
  text: '#F1F5F9',         // Primary text
  textSecondary: '#94A3B8', // Secondary text
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444'
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Playfair Display'
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Playfair Display'
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'DM Sans'
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'DM Sans'
  }
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999
};
```

### Component Specifications

```typescript
// AI Coach Chat Component
interface AICoachChatProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  messages: ChatMessage[];
  suggestions?: string[];
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  onSend,
  isLoading,
  messages,
  suggestions
}) => {
  return (
    <View style={styles.container}>
      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <ChatMessage
            message={item}
            isUser={item.role === 'user'}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Quick Suggestions */}
      {suggestions && (
        <QuickSuggestions
          suggestions={suggestions}
          onSelect={onSend}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView behavior="padding">
        <ChatInput
          onSend={onSend}
          disabled={isLoading}
          placeholder="Ask AI Coach..."
        />
        <VoiceInputButton
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

// Quick Wins Card Component
interface QuickWinCardProps {
  quickWin: QuickWin;
  onApply: () => void;
  onFavorite: () => void;
}

export const QuickWinCard: React.FC<QuickWinCardProps> = ({
  quickWin,
  onApply,
  onFavorite
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => {}}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.category}>{quickWin.category}</Text>
        <TouchableOpacity onPress={onFavorite}>
          <Icon
            name={quickWin.is_favorite ? 'heart' : 'heart-outline'}
            color={quickWin.is_favorite ? Colors.primary : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.title}>{quickWin.title}</Text>
      <Text style={styles.oneLiner}>{quickWin.one_liner}</Text>

      {/* Impact Indicator */}
      <View style={styles.impactBar}>
        <Text style={styles.impactLabel}>Impact:</Text>
        <View style={styles.impactStars}>
          {[...Array(10)].map((_, i) => (
            <Icon
              key={i}
              name="star"
              size={12}
              color={i < quickWin.estimated_impact ? Colors.primary : Colors.surface}
            />
          ))}
        </View>
      </View>

      {/* Apply Button */}
      <Button
        title="Apply Now"
        onPress={onApply}
        style={styles.applyButton}
      />
    </TouchableOpacity>
  );
};
```

---

## 📱 App Store Optimization

### App Store Listing

```
APP NAME: VCSA Pocket - AI Sales Coach

SUBTITLE: Your Personal Sales Coach

DESCRIPTION (170 characters):
Close more deals with AI-powered coaching. Get real-time objection handling, quick wins, and performance tracking - all in your pocket.

FULL DESCRIPTION:
VCSA Pocket is your personal AI sales coach designed specifically for vacation club sales professionals. Get instant guidance when you need it most - right on the sales floor.

KEY FEATURES:
• AI Coach: Real-time objection handling in 3 seconds
• Quick Wins: 50+ battle-tested tactics at your fingertips
• Pre-Tour Prep: 2-minute mindset and tactical preparation
• Performance Tracking: Know your readiness score every day
• Offline Mode: Access critical content without internet
• Voice Input: Hands-free coaching when you need it

PERFECT FOR:
• New reps learning the sales process
• Veterans looking to stay sharp
• Managers tracking team performance
• Anyone who wants to sell more confidently

AI-POWERED COACHING:
Ask any objection and get 3 different approaches:
1. Emotional: Connect with feelings and dreams
2. Logical: Focus on ROI and value
3. Story-Based: Use relatable success stories

QUICK WINS LIBRARY:
Access 50+ proven tactics organized by:
• Before tour preparation
• Closing techniques
• Objection handling
• Relationship building
• And more!

DAILY PERFORMANCE:
• Track your readiness score
• Set and achieve daily goals
• Monitor your improvement trends
• Compete with your team

Download VCSA Pocket and start closing more deals today!

KEYWORDS: Sales, Training, Coaching, AI, Vacation Club, Timeshare, Performance, objection handling, sales tips

SCREENSHOTS:
1. AI Coach Chat Interface
2. Quick Wins Library
3. Performance Dashboard
4. Pre-Tour Mode
5. Voice Input Demo
6. Analytics View
```

---

## 🚀 Deployment Pipeline

### CI/CD Configuration

```yaml
# .github/workflows/mobile-ci.yml
name: Mobile CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd apps/mobile
          npm install

      - name: Run tests
        run: |
          cd apps/mobile
          npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd apps/mobile
          npm install

      - name: Build iOS
        run: |
          cd apps/mobile
          npx expo prebuild --platform ios
          xcodebuild -workspace ios/vcsapocket.xcworkspace \
                     -scheme vcsapocket \
                     -configuration Release \
                     -archivePath build/vcsapocket.xcarchive

      - name: Upload to TestFlight
        uses: apple/upload-testflight@v1
        with:
          app-path: build/vcsapocket.ipa
          api-key: ${{ Secrets.APPLE_API_KEY }}
          api-key-issuer: ${{ Secrets.APPLE_API_ISSUER }}

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd apps/mobile
          npm install

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Build Android
        run: |
          cd apps/mobile
          npx expo prebuild --platform android
          cd android
          ./gradlew assembleRelease

      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ Secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
          packageName: com.vcsa.pocket
          releaseFiles: apps/mobile/android/app/build/outputs/apk/release/app-release.apk
          track: internal
```

---

## 📞 Continuación del Proyecto

### PRÓXIMOS PASOS INMEDIATOS

1. **APROBACIÓN Y KICKOFF** (Semana 0)
   - [ ] Stakeholder approval de plan técnico
   - [ ] Budget final confirmation
   - [ ] Equipo assignment completo
   - [ ] Sprint 1 planning meeting

2. **SPRINT 1 START** (Semana 1)
   - [ ] Repository setup (React Native)
   - [ ] Development environment team-wide
   - [ ] Design system finalización
   - [ ] API specification lock
   - [ ] CI/CD pipeline setup

3. **MVP DEVELOPMENT** (Semanas 2-11)
   - [ ] Follow Kanban plan detallado
   - [ ] Weekly sprint reviews
   - [ ] Continuous testing integration
   - [ ] Beta user recruitment

### DECISIONES PENDIENTES

1. **TECHNICAL**
   - [ ] Confirmar React Native vs Flutter
   - [ ] Elegir cloud provider (AWS vs GCP vs Azure)
   - [ ] Definir AI model strategy (Ollama only vs hybrid)

2. **BUSINESS**
   - [ ] Finalizar pricing strategy
   - [ ] Definir cliente piloto
   - [ ] Confirmar timeline de 12 semanas
   - [ ] Approve budget de $144,600 USD

3. **TEAM**
   - [ ] Assign Mobile Dev Lead
   - [ ] Assign AI Engineer
   - [ ] Assign UI/UX Designer
   - [ ] Assign QA Engineer

### MILESTONES DE DECISIÓN

- **Semana 2**: Core architecture lock
- **Semana 4**: Alpha release decision
- **Semana 8**: Beta program launch decision
- **Semana 11**: Production launch decision

---

**¿LISTOS PARA COMENZAR EL DESARROLLO?**

El plan técnico está completo. La arquitectura está definida. Los stacks están seleccionados. Los APIs están especificados.

**SIGUIENTE ACCIÓN**: Reunión de kickoff con equipo técnico completo para Sprint 1.
