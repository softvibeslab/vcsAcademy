# Style Guidelines

Design patterns and best practices for VCSA UI/UX design.

## 📐 Layout Principles

### Design Philosophy

VCSA follows a **dark luxury** aesthetic inspired by premium brands:

- **Depth through Layering**: Multiple subtle layers create visual interest
- **Generous Spacing**: More whitespace than feels comfortable
- **Subtle Interactions**: Micro-animations on every interaction
- **Asymmetry**: Avoid centered, symmetrical layouts
- **Premium Materials**: Gold accents, glass effects, soft shadows

---

## 🎨 Color System

### Primary Colors

```css
/* Backgrounds */
--bg-primary: #020204;      /* Main background - almost black */
--bg-secondary: #0A0A0F;    /* Cards and sections */
--bg-tertiary: #111118;     /* Nested elements */

/* Text */
--text-primary: #F1F5F9;    /* Main text */
--text-secondary: #94A3B8;  /* Secondary text */
--text-muted: #64748B;      /* Muted/disabled */

/* Accents */
--gold: #D4AF37;            /* Primary accent - use sparingly */
--gold-hover: #B8962E;      /* Darker gold for hover */
--navy: #1E3A8A;            /* Secondary accent */
--emerald: #10B981;         /* Success/growth */
--amber: #F59E0B;           /* Warning/activity */
```

### Color Usage Rules

1. **Gold (#D4AF37)** - Use ONLY for:
   - Primary call-to-action buttons
   - Important achievements/badges
   - Stage 4 (Top Producer) indicators
   - VIP membership badges

2. **Navy (#1E3A8A)** - Use for:
   - Secondary buttons
   - Stage 2 indicators
   - Links
   - Information highlights

3. **Emerald (#10B981)** - Use for:
   - Success messages
   - Stage 1 (New Rep) indicators
   - Positive progress
   - Completion status

4. **Amber (#F59E0B)** - Use for:
   - Warning messages
   - Stage 3 indicators
   - High-value alerts
   - Pending states

---

## ✏️ Typography

### Font Families

```css
/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* Heading font - elegant, premium */
--font-heading: 'Playfair Display', serif;

/* Body font - modern, readable */
--font-body: 'DM Sans', sans-serif;

/* Mono font - data, code */
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale

```css
/* Headings - Playfair Display */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }  /* Page titles */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* Section titles */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* Card titles */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }   /* Subtitles */

/* Body - DM Sans */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* Body text */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }  /* Secondary text */
.text-xs { font-size: 0.75rem; line-height: 1rem; }      /* Labels */

/* Mono - JetBrains Mono */
.font-mono { font-family: 'JetBrains Mono', monospace; }  /* Data/stats */
```

### Typography Rules

1. **Never use pure white** (#FFFFFF) on dark backgrounds
   - Use `#F1F5F9` for primary text
   - Use `#94A3B8` for secondary text

2. **Font Weight Hierarchy**:
   - Headings: 600-700 (semi-bold to bold)
   - Body: 400-500 (normal to medium)
   - Buttons: 600-700 (semi-bold to bold)

3. **Line Height**:
   - Body text: 1.5-1.75 (readable)
   - Headings: 1.1-1.3 (tighter)
   - Buttons: 1 (compact)

---

## 📏 Spacing System

### Spacing Scale

```css
/* Tailwind-based spacing */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-24: 6rem;     /* 96px */
```

### Spacing Guidelines

1. **Use 2-3x more spacing than feels comfortable**
   ```jsx
   {/* Good - generous spacing */}
   <div className="space-y-12">
     {/* Content */}
   </div>

   {/* Bad - too tight */}
   <div className="space-y-4">
     {/* Content */}
   </div>
   ```

2. **Consistent padding for cards**:
   ```css
   .card {
     padding: 1.5rem; /* 24px - consistent */
   }

   .card-compact {
     padding: 1rem; /* 16px - tight variant */
   }
   ```

3. **Section spacing**:
   ```css
   /* Between major sections */
   .section-spacing {
     padding: 6rem 0; /* 96px */
   }

   /* Between related elements */
   .element-spacing {
     margin-bottom: 2rem; /* 32px */
   }
   ```

---

## 🎭 Component Patterns

### Cards

All cards should have:
- Subtle border (white/10 or white/5)
- Layered depth (slight elevation)
- Consistent padding (1.5rem)
- Hover effect (border brightens)

```jsx
// Standard card
<Card className="border-white/10 bg-[#020204] hover:border-white/20 transition-all duration-300">
  <CardHeader>
    <CardTitle className="font-['Playfair_Display'] text-2xl">
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-[#94A3B8]">Card content goes here</p>
  </CardContent>
</Card>

// Elevated card (important)
<Card className="border-white/10 bg-[#020204] shadow-lg shadow-[#D4AF37]/10">
  {/* Content */}
</Card>

// Glass card (overlay)
<Card className="border-white/10 bg-[#020204]/80 backdrop-blur-sm">
  {/* Content */}
</Card>
```

### Buttons

```jsx
// Primary action (gold - use sparingly)
<Button className="bg-[#D4AF37] hover:bg-[#B8962E] text-black font-semibold">
  Get Started
</Button>

// Secondary action (navy)
<Button variant="secondary" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80">
  Learn More
</Button>

// Outline action
<Button variant="outline" className="border-white/10 hover:bg-white/5">
  Cancel
</Button>

// Ghost action (subtle)
<Button variant="ghost" className="hover:bg-white/5">
  Skip
</Button>

// Destructive action
<Button variant="destructive" className="bg-red-600 hover:bg-red-700">
  Delete
</Button>
```

### Badges

```jsx
// Stage badges (with correct colors)
<Badge className="bg-[#10B981]">Stage 1: New Rep</Badge>
<Badge className="bg-[#3B82F6]">Stage 2: Developing Rep</Badge>
<Badge className="bg-[#F59E0B]">Stage 3: Performing Rep</Badge>
<Badge className="bg-[#D4AF37] text-black">Stage 4: Top Producer</Badge>

// Status badges
<Badge variant="default">In Progress</Badge>
<Badge variant="secondary">Completed</Badge>
<Badge variant="outline">Locked</Badge>

// VIP badge (gold - use sparingly)
<Badge className="bg-[#D4AF37] text-black font-semibold">
  VIP Member
</Badge>
```

### Progress Indicators

```jsx
// Readiness score ring
<div className="relative w-32 h-32">
  <svg className="transform -rotate-90">
    <circle
      cx="64"
      cy="64"
      r="56"
      stroke="currentColor"
      strokeWidth="8"
      fill="none"
      className="text-[#0A0A0F]"
    />
    <circle
      cx="64"
      cy="64"
      r="56"
      stroke="currentColor"
      strokeWidth="8"
      fill="none"
      strokeDasharray={`${(score / 100) * 352} 352`}
      className="text-[#D4AF37]"
    />
  </svg>
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-3xl font-bold font-['Playfair_Display']">{score}%</span>
  </div>
</div>

// Linear progress bar
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-[#94A3B8]">Track Progress</span>
    <span className="text-[#F1F5F9]">{progress}%</span>
  </div>
  <Progress value={progress} className="h-2" />
</div>
```

---

## 🎭 Animation Principles

### Micro-Interactions

Every interaction should have feedback:

```jsx
// Hover effect
<div className="group transition-all duration-300 hover:scale-105 hover:shadow-lg">
  {/* Content */}
</div>

// Fade in
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>

// Stagger children
<motion.div
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Animation Timing

```css
/* Fast transitions - immediate feedback */
.transition-fast { transition-duration: 150ms; }

/* Normal transitions - standard */
.transition-normal { transition-duration: 300ms; }

/* Slow transitions - emphasis */
.transition-slow { transition-duration: 500ms; }
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind breakpoints */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Responsive Patterns

```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Responsive spacing
<div className="px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
  {/* Content */}
</div>

// Hide/show based on breakpoint
<div className="hidden md:block">
  {/* Desktop only */}
</div>

<div className="block md:hidden">
  {/* Mobile only */}
</div>
```

---

## 🎯 Layout Patterns

### Bento Grid (Asymmetric)

```jsx
<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
  {/* Large featured item */}
  <div className="md:col-span-2 lg:col-span-3">
    <Card>
      {/* Featured content */}
    </Card>
  </div>

  {/* Medium item */}
  <div className="md:col-span-2">
    <Card>
      {/* Secondary content */}
    </Card>
  </div>

  {/* Small items */}
  <div className="col-span-1">
    <Card>
      {/* Tertiary content */}
    </Card>
  </div>
</div>
```

### Dashboard Layout

```jsx
<div className="min-h-screen bg-[#020204]">
  {/* Header */}
  <header className="border-b border-white/10 px-6 py-4">
    {/* Logo, navigation, user menu */}
  </header>

  {/* Main content */}
  <main className="container mx-auto px-6 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        {/* Navigation */}
      </aside>

      {/* Content */}
      <div className="lg:col-span-3">
        {/* Main content */}
      </div>
    </div>
  </main>
</div>
```

---

## 🚫 Anti-Patterns (What to Avoid)

1. **Pure White Text**
   ```jsx
   // ❌ Bad - too harsh
   <p className="text-white">This text is too white</p>

   // ✅ Good - softer
   <p className="text-[#F1F5F9]">This text is readable</p>
   ```

2. **Centered Layouts**
   ```jsx
   // ❌ Bad - boring, symmetrical
   <div className="flex justify-center items-center">
     <div className="w-full max-w-md">
       {/* Content */}
     </div>
   </div>

   // ✅ Good - asymmetric, interesting
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     <div className="md:col-span-1">
       {/* Sidebar */}
     </div>
     <div className="md:col-span-2">
       {/* Main content */}
     </div>
   </div>
   ```

3. **Flat Colors**
   ```jsx
   // ❌ Bad - no depth
   <div className="bg-[#020204] border border-white">
     {/* Content */}
   </div>

   // ✅ Good - layered depth
   <div className="bg-[#020204] border border-white/10 hover:border-white/20 transition-all">
     {/* Content */}
   </div>
   ```

4. **Overusing Gold**
   ```jsx
   // ❌ Bad - gold everywhere
   <Button className="bg-[#D4AF37]">Cancel</Button>
   <Button className="bg-[#D4AF37]">Delete</Button>
   <Button className="bg-[#D4AF37]">Back</Button>

   // ✅ Good - gold for primary only
   <Button className="bg-[#D4AF37]">Get Started</Button>
   <Button variant="outline">Cancel</Button>
   <Button variant="ghost">Back</Button>
   ```

---

## 📐 Design Checklist

Before marking a design as complete, verify:

- [ ] No pure white (#FFFFFF) text on dark backgrounds
- [ ] Gold accent used sparingly (primary CTAs only)
- [ ] Generous spacing (2-3x more than feels comfortable)
- [ ] Subtle borders on all cards (white/10 or white/5)
- [ ] Hover effects on all interactive elements
- [ ] Consistent padding within components
- [ ] Asymmetric layouts (avoid centered, symmetrical)
- [ ] Proper font hierarchy (Playfair for headings, DM Sans for body)
- [ ] Mobile responsive (test at 375px width)
- [ ] Proper color contrast ratios (WCAG AA compliant)

---

## 📚 Related Documentation

- [Design System](DesignSystem.md)
- [Components](Components.md)
- [Typography](#typography)
- [Color System](#color-system)
