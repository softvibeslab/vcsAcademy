#!/usr/bin/env python3
"""
Seed script for Knowledge Hub resources
Run with: python backend/seed_knowledge_hub.py
"""

import sys
import os
from pathlib import Path
from datetime import datetime, timezone

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

# Load env variables
from dotenv import load_dotenv
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')

from pymongo import MongoClient

def seed_knowledge_hub():
    """Seed resources collection with sample knowledge hub content"""

    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]

    # Clear existing resources
    db.resources.delete_many({})
    print("✓ Cleared existing resources")

    # Sample resources
    now = datetime.now(timezone.utc)
    resources = [
        {
            "resource_id": "res_001",
            "title": "Discovery Question Framework",
            "description": "A comprehensive framework of discovery questions organized by category. Build rapport, uncover needs, identify budget, and reveal motivation with these proven questions.",
            "resource_type": "framework",
            "category": "discovery",
            "content": """# Discovery Question Framework

## Building Rapport
1. What's your current vacation experience like?
2. If you could vacation anywhere, where would you go?
3. What does your perfect vacation day look like?

## Uncovering Needs
4. What's most important to you in a vacation experience?
5. Tell me about your favorite family vacation memory.
6. What would make your vacations more enjoyable?

## Budget Discovery
7. What's your typical vacation budget?
8. How do you usually plan for vacation expenses?
9. Are you looking to optimize your vacation investment?

## Motivation Triggers
10. If time and money weren't factors, describe your dream vacation.
11. What does owning a vacation home mean to you?
12. How would this change your family's quality of life?

## Decision Makers
13. Who else will be involved in this decision?
14. How do you typically make family decisions like this?
15. What's your timeline for making a decision?

**Remember**: Listen more than you talk. Each answer opens doors to deeper understanding.""",
            "file_url": None,
            "file_type": None,
            "tags": ["discovery", "questions", "essential", "before_tour"],
            "related_content": ["mod_2_3"],
            "difficulty": "beginner",
            "usage_count": 342,
            "created_by": "admin",
            "created_at": now.isoformat()
        },
        {
            "resource_id": "res_002",
            "title": "Price Objection Script Bank",
            "description": "20+ proven responses to 'it's too expensive' organized by scenario. Includes scripts for budget concerns, value positioning, and payment reframing.",
            "resource_type": "script",
            "category": "objections",
            "content": """# Price Objection Script Bank

## The "Too Expensive" Response Framework

### 1. The Comparison Frame
"Too expensive compared to what? Are we looking at monthly budget or total investment? Because when you break it down to a daily cost, it's less than a cup of coffee."

### 2. The Value Stack
"Let me show you what you're getting. You're not just buying vacations - you're getting guaranteed availability, resort credits, bonus weeks, and the ability to pass this to your children. What's that worth to you?"

### 3. The Cost of Inaction
"What's the cost of NOT doing this? Five years from now, inflation will have made vacations 30% more expensive, and you'll have spent $50,000 on mediocre experiences. How does that feel?"

### 4. The Payment Pivot
"I hear you on price. Let's talk about payments - what works better for your budget, a lower monthly payment or a shorter term?"

### 5. The ROI Reframe
"If this investment saves you $3,000 per year on vacation costs, when does it pay for itself? (pause) Two years. After that, it's pure savings."

### 6. The Comparison to Alternatives
"What do you spend on vacations now? Let's calculate. (calculate their spend) So you're already spending the money - you're just getting less for it."

### 7. The Lifetime Value
"Over 20 years, your family will create 80+ memories. What's the value of those memories? What's the cost of missing them?"

### 8. The Budget Exploration
"Help me understand - is it that you can't afford it, or you haven't allocated for it yet? Because if you can afford $500/month, we can make this work."

### 9. The Alternative Cost
"What's the alternative? A timeshare that depreciates? Booking hotels last minute at premium prices? Not taking vacations at all? Which costs more?"

### 10. The Investment Language
"Can we shift the language? This isn't an expense - it's an investment in your family's happiness. Investments pay dividends. This one pays in memories."

## Practice Tips:
- Use the pause after each question
- Match their energy level
- Always pivot to value, never defend price
- Get agreement before moving forward""",
            "file_url": None,
            "file_type": None,
            "tags": ["objections", "price", "closing", "essential"],
            "related_content": ["mod_5_2"],
            "difficulty": "intermediate",
            "usage_count": 891,
            "created_by": "admin",
            "created_at": now.isoformat()
        },
        {
            "resource_id": "res_003",
            "title": "Case Study: From $50k to $500k in 6 Months",
            "description": "How Sarah Miller transformed from struggling rep to top producer by implementing VCSA's Discovery Framework. Detailed breakdown of her daily routine, presentation changes, and objection handling.",
            "resource_type": "case_study",
            "category": "performance",
            "content": """# Case Study: Sarah Miller
## From $50k to $500k in 6 Months

### Background
- **Before**: $50k annual sales, struggling with objections, inconsistent performance
- **After**: $500k annual run rate, 68% closing rate, top 5% performer
- **Timeframe**: 6 months

### The Transformation

#### Month 1-2: Foundation Building
**Changes Made:**
- Implemented pre-tour ritual (3 deep breaths, reviewed discovery questions)
- Stopped presenting before understanding needs
- Added "why vacation?" question to every tour

**Results:**
- Tours: 60 → 55 (more selective)
- Closing rate: 18% → 24%
- Monthly sales: $4,200 → $6,800

#### Month 3-4: Discovery Mastery
**Changes Made:**
- Mastered the Discovery Question Framework
- Added lifestyle visualization to presentation
- Started presenting price as investment, not expense

**Results:**
- Closing rate: 24% → 42%
- Average deal size: $1,800 → $2,400
- Monthly sales: $6,800 → $14,200

#### Month 5-6: Objection Mastery
**Changes Made:**
- Internalized Price Objection Script Bank
- Started using emotion-first, logic-second framework
- Added confirmation moments throughout presentation

**Results:**
- Closing rate: 42% → 68%
- Referrals: 0 → 8/month
- Monthly sales: $14,200 → $41,600

### Key Takeaways

1. **Never present without discovery**
   - Sarah's rule: 10 minutes minimum discovery
   - Result: Better presentations, higher close rates

2. **Price is a mindset issue**
   - Changed language from "cost" to "investment"
   - Result: 60% fewer price objections

3. **Objections are buying signals**
   - Started welcoming objections instead of fearing them
   - Result: More confident, more closes

4. **Systems beat motivation**
   - Created daily checklist: pre-tour ritual, 3 discovery questions, lifestyle visualization
   - Result: Consistent performance regardless of mood

### Sarah's Daily Routine

**Before Every Tour:**
1. 3 deep breaths
2. Review discovery questions
3. Set intention: "I will help this family create memories"

**During Every Tour:**
1. 10+ minutes in discovery
2. Ask "What does your perfect vacation look like?"
3. Paint the lifestyle picture
4. Present as investment, not expense
5. Use confirmation moments

**After Every Tour:**
1. Debrief: What worked? What didn't?
2. Log learning points
3. Adjust approach for next time

### Her Advice to New Reps
> "Stop trying to sell. Start trying to understand. When you truly understand what they want, the sale happens naturally. The Discovery Framework changed everything for me."

### Numbers Don't Lie
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Annual Sales | $50k | $500k | +900% |
| Closing Rate | 18% | 68% | +278% |
| Average Deal | $800 | $2,400 | +200% |
| Referrals/Month | 0 | 8 | ∞ |
| Happy Customers | 12 | 156 | +1200% |

---

**Implementation Timeline:** 6 months
**Daily Practice Required:** 30 minutes
**Difficulty:** Moderate
**ROI:** 10x improvement in income""",
            "file_url": None,
            "file_type": None,
            "tags": ["motivation", "case_study", "transformation", "performance"],
            "related_content": ["mod_2_3", "mod_5_2"],
            "difficulty": "beginner",
            "usage_count": 1567,
            "created_by": "admin",
            "created_at": now.isoformat()
        },
        {
            "resource_id": "res_004",
            "title": "Pre-Tour Mental Preparation Checklist",
            "description": "A quick 5-minute pre-tour ritual to get into the right mindset. Includes breathing exercises, affirmation, and focus questions to ensure peak performance.",
            "resource_type": "tool",
            "category": "mindset",
            "content": """# Pre-Tour Mental Preparation Checklist
*Complete this 5 minutes before every tour*

## Step 1: Center Yourself (1 minute)
- [ ] Take 3 deep breaths
- [ ] Shake out tension in shoulders and hands
- [ ] Stand tall, shoulders back

## Step 2: Set Your Intention (1 minute)
*Say this to yourself:*
> "I am a professional. I help families create memories. Today I will perform at my best."

## Step 3: Review Your Framework (1 minute)
- [ ] Discovery questions ready
- [ ] Know your key talking points
- [ ] Prepare for common objections

## Step 4: Get Curious (1 minute)
*Ask yourself:*
- What makes this family unique?
- What are they really looking for?
- How can I serve them best?

## Step 5: Visualize Success (1 minute)
*See the outcome:*
- Warm rapport built
- Needs uncovered
- Perfect solution presented
- Happy family saying yes

## Quick Focus Questions (if stuck):
1. What's the one thing this family needs to hear?
2. What's my goal for this tour?
3. What would make this tour a win regardless of outcome?

**Remember:** Your energy sets the tone. Be present, be curious, be helpful. The sale happens when you serve well.""",
            "file_url": None,
            "file_type": None,
            "tags": ["mindset", "preparation", "before_tour", "essential"],
            "related_content": ["mod_1_2"],
            "difficulty": "beginner",
            "usage_count": 523,
            "created_by": "admin",
            "created_at": now.isoformat()
        },
        {
            "resource_id": "res_005",
            "title": "The 'Need to Think About It' Response Playbook",
            "description": "5 proven frameworks for handling the most common stall. Includes scripts for creating urgency, uncovering real objections, and advancing the sale.",
            "resource_type": "script",
            "category": "closing",
            "content": """# The 'Need to Think About It' Response Playbook

## Understanding the Stall
"Need to think about it" usually means:
1. You haven't built enough value yet
2. There's an unspoken objection
3. They're not the sole decision maker
4. They need more information
5. They're buying time to shop around

## Response Frameworks

### Framework 1: The Curiosity Pivot
*"Of course you want to think about it - this is an important decision. Help me understand: what specifically would you like to think through? Is it the investment, the timing, or something else I haven't addressed?"*

**Why it works:** Uncovers the real objection while validating their need to think.

### Framework 2: The Isolation Technique
*"I understand. What would have to be different for you to say yes today instead of thinking about it?"*

**Why it works:** Isolates the barrier and makes it addressable.

### Framework 3: The Permission to Pass
*"I want to make something clear - I'm not here to pressure you. If this isn't right for your family, I'd rather you tell me now. But if it IS right and you're just being cautious, let's talk about that. What's your gut telling you?"*

**Why it works:** Removes pressure while prompting honest conversation.

### Framework 4: The Think-Through Framework
*"Absolutely. Let's think through this together right now. What are the top 3 things you want to consider? (list them) OK, let's address each one..."*

**Why it works:** Controls the thinking process instead of leaving them alone.

### Framework 5: The Alternative Scenario
*"I hear you. Let me ask you this: if you walk away and think about it, what changes? The price is the same. The inventory is the same. The only difference is you might lose this specific unit/orientation. Is that a risk you're willing to take?"*

**Why it works:** Creates cost to inaction.

## Advanced Tactics

### The "What If" Scenario
*"What if you say yes and it's the best decision you've ever made? What does your family's vacation life look like 5 years from now?"*

### The Timeline Question
*"How long do you typically need to think about decisions of this size? A day? A week? Because I want to set appropriate expectations."*

### The Check-In Move
*"Can I check in with you tomorrow to answer any questions that come up? I'd rather you have accurate information than guess."*

## Red Flags That Mean "No"
- They won't commit to a follow-up time
- They become vague about what they need to think about
- They start packing up mentally
- They refuse to identify what's missing

## Green Flags That Mean "Maybe"
- They ask for materials to review
- They want to discuss with a specific person
- They identify a specific concern
- They want to check availability

## Your Response Based on Flags:

**Red Flag:** *"I appreciate your honesty. Let's part as friends - if you ever decide to move forward, you know where to find me."* (Preserve dignity, remove pressure)

**Green Flag:** *"Great! Let's set up a time to reconnect. What works better - tomorrow morning or afternoon? And what specific questions do you anticipate having?"* (Maintain momentum, set follow-up)

## Key Principles:
1. Never let them leave without knowing the REAL objection
2. Always validate - never defend
3. Create urgency through scarcity, not pressure
4. Set specific follow-up if they need time
5. Know when to walk away gracefully""",
            "file_url": None,
            "file_type": None,
            "tags": ["closing", "objections", "stalls", "essential"],
            "related_content": ["mod_4_1", "mod_5_1"],
            "difficulty": "advanced",
            "usage_count": 1203,
            "created_by": "admin",
            "created_at": now.isoformat()
        },
        {
            "resource_id": "res_006",
            "title": "Tour Flow Template: 90-Minute Perfect Presentation",
            "description": "A minute-by-minute breakdown of the perfect vacation club tour. Includes timing, transitions, key talking points, and natural close setup.",
            "resource_type": "template",
            "category": "presentation",
            "content": """# Tour Flow Template: 90-Minute Perfect Presentation

## Phase 1: Welcome & Discovery (Minutes 1-15)

### Minutes 1-3: Warm Welcome
- Greet with energy and smile
- Introduce yourself briefly
- "Ready to see something amazing?"
- Set expectations: "About 90 minutes, no pressure, just show you the options"

### Minutes 4-10: Discovery Questions
**Must Ask:**
1. What's your current vacation experience?
2. What does your perfect vacation look like?
3. How do you typically plan vacations?
4. What's most important in your vacation experience?

**Listen for:** Budget signals, motivation triggers, decision makers, timeline

### Minutes 11-15: Bridge to Tour
"Based on what you've told me, I think you're going to love what I'm about to show you. Let's go see the property."

## Phase 2: Property Tour (Minutes 16-45)

### Minutes 16-25: Grounds & Amenities
**Key Points:**
- Highlight lifestyle benefits
- "Imagine your kids here..."
- Connect back to discovery answers
- Create emotional anchors

**Transitions:** "This is great, but wait until you see the suites..."

### Minutes 26-35: Unit Tour
**Key Points:**
- Focus on their specific interests
- "Remember you mentioned X? This is perfect for that..."
- Create ownership language: "Your kitchen," "Your balcony"
- Paint lifestyle pictures

**Transitions:** "Now let me show you where this investment really pays off..."

### Minutes 36-45: Clubhouse & Benefits
**Key Points:**
- Exclusive access
- Priority booking
- Resort credits
- Flexibility

**Transitions:** "You've seen what you get. Let's talk about how this works."

## Phase 3: Value Presentation (Minutes 46-70)

### Minutes 46-55: How It Works
- Points system explanation
- Booking process
- Usage flexibility
- "No blackout dates" emphasis

### Minutes 56-65: The Lifestyle Paint
Connect back to discovery:
"Remember you wanted to spend more time with your family? This guarantees that every year."

### Minutes 66-70: Investment Preview (No Numbers Yet)
"Before we get to numbers, let me ask - based on everything you've seen, does this fit what you're looking for?"

**If yes:** "Great, let me show you the investment."
**If no:** Discover what's missing and address it.

## Phase 4: The Close (Minutes 71-90)

### Minutes 71-75: Price Presentation
- Present as investment, not expense
- Break down to daily/monthly cost
- Show ROI comparison

### Minutes 76-82: Objection Handling
- Welcome objections
- Use confirmation moments
- Always pivot to value

### Minutes 83-88: The Decision Moment
"You've seen everything. You understand the value. Based on what's best for your family - what are you thinking?"

### Minutes 89-90: Close or Next Steps
**If close:** "Congratulations! Let's get started."
**If think:** Set specific follow-up
**If no:** Graceful exit

## Critical Success Factors:

1. **Always connect back to discovery answers**
   - "You mentioned X, so Y is perfect..."

2. **Use confirmation moments throughout**
   - "Does this make sense?"
   - "Can you see your family here?"

3. **Paint the lifestyle, not just the features**
   - "Imagine your kids waking up to this view..."

4. **Never present price until they've said they want it**
   - Price always comes AFTER value

5. **Maintain energy from start to finish**
   - Your energy is contagious

## Common Mistakes to Avoid:

❌ Rushing through discovery
❌ Presenting price too early
❌ Not listening to their responses
❌ Skipping confirmation moments
❌ Letting them control the flow
❌ Failing to ask for the decision

## Your Pre-Tour Checklist:
- [ ] Energy high, smiling
- [ ] Discovery questions memorized
- [ ] Know their motivation
- [ ] Plan key talking points
- [ ] Set intention to serve, not sell

**Remember:** The tour isn't about you - it's about them and their family's future vacation memories.""",
            "file_url": None,
            "file_type": None,
            "tags": ["presentation", "flow", "essential", "structure"],
            "related_content": ["mod_2_6", "mod_3_1"],
            "difficulty": "intermediate",
            "usage_count": 789,
            "created_by": "admin",
            "created_at": now.isoformat()
        },
        {
            "resource_id": "res_007",
            "title": "VCSA Closing Script: From Presentation to Contract",
            "description": "A complete closing script with word-for-word language. Includes the setup, the ask, handling stalls, and getting to paperwork. The last 10 minutes of your tour, scripted.",
            "resource_type": "script",
            "category": "closing",
            "content": """# VCSA Closing Script: From Presentation to Contract

## The Setup (10 minutes before close)

### You: "We're coming up on the close of our time together. Before we get to the numbers, let me ask you - based on everything you've seen today, does this fit what you're looking for in a vacation experience?"

### If they say YES:
**Great!** Move to price presentation.

### If they say NO or MAYBE:
**You:** "That's honest feedback. Help me understand - what's missing? What would make this a perfect fit for your family?"
*Listen and address. Reconfirm when resolved.*

## The Price Presentation

### You: "OK, so here's how this works. There are a few different ways to structure this depending on how you like to travel. Let me show you the options..."

**Present 2-3 options:**
1. **Entry-level:** "X points per year, perfect for 1-2 vacations. Investment is $Y/month."
2. **Most popular:** "X points per year, 3-4 vacations plus bonus weeks. Investment is $Y/month."
3. **Premium:** "X points per year, unlimited flexibility plus VIP perks. Investment is $Y/month."

### You: "Most families in your situation choose the middle option - it gives them the flexibility they want without paying for points they won't use. What are your thoughts on these options?"

## The Decision Ask

### You: "I don't want to pressure you - this is a big decision. But I also don't want you to miss out on something perfect for your family. Based on everything we've discussed, which option feels right to you?"

**Wait for their answer.** This is the decision moment.

## The Confirmation

### If they pick an option:
**You:** "Great choice! Let me just confirm - you're getting X points per year, which means you can take Y vacations plus bonus weeks. The investment is $Z/month. Does that all sound right?"

*Get confirmation.*

### You: "Excellent. Now I have to ask - what could stop you from moving forward today?"

*This surfaces any final objections.*

## The "Think About It" Response

### If they say they need to think:
**You:** "Of course you want to think about it - this is important. Help me understand: what specifically would you like to think through? The investment? The timing? Or something else I haven't addressed?"

*Listen to their response.*

### If it's the investment:
**You:** "I hear you on price. Let me ask - what were you expecting? Or what would make this a no-brainer for you?"

### If it's timing:
**You:** "I understand. When do you think you'll be ready to make a decision? Because I want to set proper expectations."

### If they're vague:
**You:** "I appreciate you wanting to think about it. But let me be direct - is this a 'no' and you're being polite, or are you seriously interested and just need time? Because I'd rather know where we stand."

## The Close

### When they're ready:
**You:** "Excellent! I'm excited for your family. Let's get the paperwork started and lock this in."

*Transition to paperwork immediately.*

**You:** "While we're doing the paperwork, let me also give you access to our member portal so you can start exploring availability..."

### The Confirmation Statement:
**You:** "Congratulations! You've made a great decision for your family. Your first vacation is going to be amazing."

## If They Say No

### Graceful exit:
**You:** "I appreciate your honesty. This isn't for everyone, and I'd rather you tell me now than waste your time. If you change your mind, you know where to find me. Can I ask - what was the main reason you decided to pass?"

*Listen for feedback, use it to improve.*

## Critical Success Factors:

1. **Always set up the close**
   - "Does this fit what you're looking for?" must get a YES before presenting numbers

2. **Present options, not ultimatums**
   - Give them choices: "Most people choose X, but Y might work better..."

3. **Ask for the decision directly**
   - Don't assume, don't hint. Ask: "Which option feels right?"

4. **Surface objections before they leave**
   - "What could stop you from moving forward today?"

5. **Transition to paperwork immediately**
   - No celebrating, no pausing. "Let's get the paperwork started."

## Words That Kill Sales:
❌ "So what do you think?" (too open-ended)
❌ "Do you want to buy it?" (too direct)
❌ "Is the price OK?" (plants doubt)
❌ "Take your time deciding" (creates delay)

## Words That Make Sales:
✅ "Which option feels right?"
✅ "What would make this a no-brainer?"
✅ "Based on everything we've discussed..."
✅ "Let's get the paperwork started."

## Your Closing Checklist:
- [ ] Confirmed they want what you're offering
- [ ] Presented 2-3 options
- [ ] Asked for decision directly
- [ ] Surfaced and handled objections
- [ ] Got clear YES or set specific follow-up
- [ ] If YES → Started paperwork immediately
- [ ] If NO → Exited gracefully and asked for feedback

**Remember:** The close should feel natural, not forced. If you've done your job in discovery and presentation, the close is just the next step.""",
            "file_url": None,
            "file_type": None,
            "tags": ["closing", "script", "essential", "word-for-word"],
            "related_content": ["mod_4_6"],
            "difficulty": "intermediate",
            "usage_count": 1456,
            "created_by": "admin",
            "created_at": now.isoformat()
        }
    ]

    # Insert resources
    result = db.resources.insert_many(resources)
    print(f"✓ Inserted {len(result.inserted_ids)} resources")

    # Create indexes
    db.resources.create_index([("resource_type", 1)])
    db.resources.create_index([("category", 1)])
    db.resources.create_index([("tags", 1)])
    db.resources.create_index([("usage_count", -1)])
    db.resources.create_index([("title", "text"), ("description", "text")])
    print("✓ Created indexes")

    print("\n🎉 Knowledge Hub resources seeded successfully!")
    print(f"   - {len(resources)} resources created")
    print(f"   - {sum(1 for r in resources if r['resource_type'] == 'framework')} frameworks")
    print(f"   - {sum(1 for r in resources if r['resource_type'] == 'script')} scripts")
    print(f"   - {sum(1 for r in resources if r['resource_type'] == 'case_study')} case studies")
    print(f"   - {sum(1 for r in resources if r['resource_type'] == 'tool')} tools")
    print(f"   - {sum(1 for r in resources if r['resource_type'] == 'template')} templates")

    client.close()

if __name__ == "__main__":
    seed_knowledge_hub()
