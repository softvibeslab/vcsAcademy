# VCSA Resort Style Guide
## Tropical Luxury Resort Aesthetic - Inspired by Hyatt Zilara/Vivid Riviera Maya

---

## 🎨 COLOR PALETTE

### Primary Colors
```css
--primary-turquoise: #0077BE      /* Vibrant Caribbean ocean blue */
--primary-light: #40C4FF           /* Light turquoise for accents */
--primary-dark: #005f9e            /* Deep ocean for hover states */
```

### Accent Colors
```css
--accent-green: #2E7D32           /* Palm tree green */
--accent-green-light: #4CAF50      /* Light tropical green */
--gold-subtle: #D4AF37            /* Subtle luxury gold */
--gold-light: #C9A96E             /* Light gold highlights */
```

### Neutral/Background Colors
```css
--sand-light: #FDFBF7              /* Off-white primary background */
--sand-beige: #F5F0E1             /* Warm beige */
--sand-medium: #EDE4D9            /* Medium sand */
--sand-dark: #D4C9B0              /* Dark sand */
--overlay-dark: rgba(0,0,0,0.45)   /* Dark overlay for readability */
--overlay-medium: rgba(0,0,0,0.35) /* Medium overlay */
```

### Text Colors
```css
--text-primary: #FFFFFF            /* White text on dark backgrounds */
--text-secondary: #E0E0E0         /* Light gray for secondary text */
--text-muted: #AAAAAA             /* Muted text */
--text-dark: #333333              /* Dark text on light backgrounds */
```

### Gradients
```css
--gradient-hero: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,119,190,0.45))
--gradient-ocean: linear-gradient(135deg, #0077BE 0%, #00A5D9 100%)
--gradient-palm: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)
```

---

## 🔤 TYPOGRAPHY

### Font Families
```css
/* Headings (H1-H6) */
font-family: 'Montserrat', sans-serif;
font-weight: 700-800;
letter-spacing: 0.02em;

/* Hero/H1 */
font-size: clamp(2.5rem, 5vw, 4.5rem);
font-weight: 800;
text-transform: uppercase;
letter-spacing: 0.1em;

/* H2 Subheadings */
font-size: clamp(2rem, 4vw, 3rem);
font-weight: 700;

/* H3 Subheadings */
font-size: clamp(1.5rem, 3vw, 2rem);
font-weight: 600;

/* Body Text */
font-family: 'Open Sans', sans-serif;
font-size: 1rem;
line-height: 1.8;
color: var(--text-dark);

/* Small Text (footers, disclaimers) */
font-size: 0.9rem;
color: var(--text-muted);
```

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600&family=Roboto+Slab:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 📐 LAYOUT & SPACING

### Section Spacing
```css
/* Mobile */
section {
  padding: 60px 0;
}

/* Desktop */
@media (min-width: 1024px) {
  section {
    padding: 100px 0;
  }
}

/* Hero Section */
min-height: 100vh;
padding: 80px 0;
```

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}
```

---

## 🎯 COMPONENT STYLES

### Buttons

#### Primary CTA Button
```css
.cta-button {
  background: var(--primary-turquoise);
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 1.1rem 2.8rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  box-shadow: 0 6px 20px rgba(0, 119, 190, 0.25);
}

.cta-button:hover {
  background: var(--primary-light);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 119, 190, 0.35);
}
```

#### Secondary Button
```css
.cta-button-secondary {
  background: transparent;
  color: var(--primary-turquoise);
  border: 2px solid var(--primary-turquoise);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cta-button-secondary:hover {
  background: var(--primary-turquoise);
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 119, 190, 0.3);
}
```

### Cards

#### Resort Card
```css
.resort-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.resort-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.18);
}
```

#### Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 119, 190, 0.15);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 2rem;
}

.glass-card:hover {
  border-color: rgba(0, 119, 190, 0.3);
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}
```

### Feature Icons
```css
.feature-icon {
  width: 56px;
  height: 56px;
  background: var(--gradient-ocean);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 119, 190, 0.25);
}

.feature-icon svg {
  color: white;
  width: 28px;
  height: 28px;
}
```

---

## 🖼️ BACKGROUND IMAGES

### Recommended Image Sources (Unsplash/Pexels)

#### Hero/Full-Width Sections
```
- Caribbean ocean aerial view
- Infinity pool merging with sea
- White sand beach with palms
- Luxury resort architecture
- Keywords: "Hyatt Zilara Riviera Maya", "Caribbean resort pool aerial", "luxury resort infinity pool"
```

#### URLs to Use
```css
/* Hero Background */
background: url('https://images.unsplash.com/photo-1570213489059-0aac6626fade?auto=format&fit=crop&w=2000&q=80')

/* Alternative Resort Images */
- Pool: https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=80
- Beach: https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2000&q=80
- Resort: https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80
```

### Image Overlay Rules
```css
/* Always ensure text readability with overlays */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,119,190,0.45));
}

/* Minimum contrast ratio: 4.5:1 */
```

---

## ✨ ANIMATIONS

### Fade In On Scroll
```css
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Delays */
.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
.delay-4 { transition-delay: 0.4s; }
```

### Pulse Glow
```css
@keyframes pulseTurquoise {
  0%, 100% {
    box-shadow: 0 6px 20px rgba(0, 119, 190, 0.3);
  }
  50% {
    box-shadow: 0 8px 30px rgba(0, 119, 190, 0.5);
  }
}

.pulse-glow {
  animation: pulseTurquoise 2s infinite;
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  h1 { font-size: 2.5rem; letter-spacing: 0.05em; }
  .cta-button { padding: 1rem 2rem; font-size: 0.85rem; }
  section { padding: 60px 0; }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  h1 { font-size: 3.5rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  section { padding: 100px 0; }
}
```

---

## 🎭 UTILITY CLASSES

### Text Colors
```css
.turquoise-text { color: var(--primary-turquoise); }
.gold-text { color: var(--gold-subtle); }
.gradient-text {
  background: var(--gradient-ocean);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Backgrounds
```css
.bg-sand-light { background: var(--sand-light); }
.bg-sand-beige { background: var(--sand-beige); }
.bg-overlay-dark { background: var(--overlay-dark); }
```

---

## 🏝️ MOOD REFERENCES

When designing, imagine these visuals:
- ✨ Turquoise infinity pools merging with Caribbean sea
- 🌴 White/beige modern resort buildings with palm trees
- 🏖️ Aerial views of curved pools, thatched palapas, white sand beaches
- 🛏️ Interior suites with neutral tones + pops of teal, gold, wood
- ☀️ High sun, blue skies, crystal-clear turquoise water

---

## 📋 CHECKLIST

### Before Publishing
- [ ] All hero images have proper overlays for text readability
- [ ] Contrast ratio is at least 4.5:1 for all text
- [ ] Buttons have proper hover/active states
- [ ] Forms have proper validation styling
- [ ] Mobile responsiveness tested
- [ ] All animations are smooth (60fps)
- [ ] Images are optimized (WebP format, proper sizing)
- [ ] Font weights are properly set for all headings
- [ ] Spacing is generous (whitespace = luxury)

---

## 🚀 IMPLEMENTATION PRIORITY

1. **Phase 1: Core Styles** ✅
   - CSS Variables
   - Typography
   - Color Palette
   - Basic Components (buttons, cards)

2. **Phase 2: Layout** ✅
   - Hero Sections
   - Content Sections
   - Spacing & Padding
   - Responsive Grid

3. **Phase 3: Polish**
   - Animations
   - Hover Effects
   - Image Optimization
   - Final QA

---

*Last Updated: March 2026*
*Inspired by: Hyatt Zilara Cancún, Hyatt Vivid Riviera Maya, Unlimited Vacation Club*
