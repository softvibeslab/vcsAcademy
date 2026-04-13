# 🎨 GOAL SHEET & PLAY ROLE - Guía Detallada para Stitch

**Fecha**: 2026-04-05
**Propósito**: Guía visual completa para diseñar estas 2 screens en Stitch/Figma

---

# SCREEN 6: GOAL SHEET - Guía de Diseño Detallada

## 🎯 Propósito & Objetivos

### ¿Qué es?
Una **dashboard financiero personal** que muestra al sales rep:
- Cuánto dinero ha ganado este mes
- Cuánto le falta para alcanzar su meta
- Desglose de fuentes de ingreso
- Progreso en tiempo real

### ¿Por qué existe?
- **Claridad**: "Sé exactamente dónde estoy"
- **Motivación**: "Veo mi progreso visible"
- **Accountability**: "Sé qué necesito hacer"
- **Celebración**: "Reconozco mis logros"

### Emoción que debe generar
**💪 Empoderamiento + 🎯 Enfoque + 🏆 Motivación**

---

## 📐 Layout Completo con Dimensiones

### Estructura General
```
┌─────────────────────────────────────┐
│ ← BACK        GOAL SHEET            │  ← Header (12% altura)
│         Track Your Success           │
├─────────────────────────────────────┤
│                                     │
│         [HERO CARD]                 │  ← Hero Section (25%)
│      Monthly Income Goal            │
│                                     │
├─────────────────────────────────────┤
│         [STATS GRID]                │  ← Stats Grid (35%)
│    2x2 grid con métricas           │
│                                     │
├─────────────────────────────────────┤
│      [INCOME BREAKDOWN]             │  ← Breakdown (20%)
│    Desglose de ingresos            │
│                                     │
├─────────────────────────────────────┤
│        [ACTION BUTTONS]             │  ← Actions (8%)
│   Set New Goal  |  View History    │
└─────────────────────────────────────┘
```

---

### 1. HEADER SECTION (12% altura = ~96px)

```
╔═════════════════════════════════════╗
║ ←     GOAL SHEET                    ║  44px - Título
║      Track Your Success              ║  32px - Subtítulo
╚═════════════════════════════════════╝
```

**Especificaciones**:
- **Fondo**: Gradiente navy sutil (de #020204 a #1E3A8A)
- **Back Button**: 
  - Icono: ← (flecha izquierda)
  - Color: #F1F5F9
  - Size: 24px
  - Padding left: 16px
- **Título "GOAL SHEET"**:
  - Font: DM Sans Bold
  - Size: 28px
  - Color: #F1F5F9
  - Center
- **Subtítulo "Track Your Success"**:
  - Font: DM Sans Regular
  - Size: 14px
  - Color: #94A3B8
  - Center
  - Letter spacing: 0.5px

---

### 2. HERO CARD - MONTHLY TARGET (25% altura = ~200px)

```
╔════════════════════════════════════════════════╗
║                                                ║
║            💰 MONTHLY INCOME GOAL              ║
║            ════════════════════════              ║
║                                                ║
║                  $12,000                       ║
║            of $15,000 target                   ║
║                                                ║
║         ╔═══════════════════════════╗          ║
║         ║████████████████░░░░░░░░░░░║          ║
║         ║         80%                  ║          ║
║         ╚═══════════════════════════╝          ║
║                                                ║
║    ↑ $2,400 above last month  📅 18 days      ║
║            remaining                          ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**Dimensiones del Card**:
- **Width**: 100% - 32px (16px padding cada lado)
- **Height**: 200px
- **Border-radius**: 20px
- **Padding**: 24px
- **Margin**: 16px horizontal

**Elementos del Hero Card**:

**A. Icono y Título**
- Icono 💰: 32px, color #D4AF37 (gold)
- Título: "MONTHLY INCOME GOAL"
  - Font: DM Sans Medium
  - Size: 16px
  - Color: #94A3B8
  - Letter spacing: 1px
  - Text transform: uppercase

**B. Monto Actual**
- "$12,000" - Número grande
  - Font: DM Sans Bold
  - Size: 48px
  - Color: #D4AF37 (gold)
  - Center
- "of $15,000 target" - Texto secundario
  - Font: DM Sans Regular
  - Size: 16px
  - Color: #94A3B8
  - Center
  - Justo debajo del número

**C. Progress Bar**
- **Tipo**: Barra lineal (no circular aquí)
- **Width**: 80% del card
- **Height**: 12px
- **Border-radius**: 6px
- **Background**: #334155
- **Fill**: Gradiente de #D4AF37 a #1E3A8A
- **Porcentaje**: "80%" encima de la barra
  - Font: DM Sans Bold
  - Size: 18px
  - Color: #F1F5F9
  - Position: Absolute, right align

**D. Stats Secundarios**
- "↑ $2,400 above last month"
  - Font: DM Sans Medium
  - Size: 14px
  - Color: #22C55E (green)
  - Icono: ↑ en mismo color
- "📅 18 days remaining"
  - Font: DM Sans Regular
  - Size: 14px
  - Color: #94A3B8
  - Icono: 📅 en mismo color

**Efectos Visuales**:
- **Sombra suave**: `box-shadow: 0 8px 24px rgba(0,0,0,0.4)`
- **Border**: 1px solid #334155
- **Glow sutil**: `box-shadow: 0 0 20px rgba(212, 175, 55, 0.1)`
- **Background**: Gradiente radial de #1E293B a #0F172A

---

### 3. STATS GRID (35% altura = ~280px)

```
╔════════════════════════════════════════════════╗
║                                                ║
║  ┌─────────────────────┬─────────────────────┐ ║
║  │  🎯 SALES           │  💵 COMMISSION      │ ║
║  │                     │                     │ ║
║  │       8            │      $4,800         │ ║
║  │   target: 10       │    rate: 60%        │ ║
║  │  ████████░░        │   ████████░░        │ ║
║  │                     │                     │ ║
║  └─────────────────────┴─────────────────────┘ ║
║                                                ║
║  ┌─────────────────────┬─────────────────────┐ ║
║  │  📊 AVG. DEAL       │  🔥 STREAK          │ ║
║  │                     │                     │ ║
║  │    $1,500           │      12 days        │ ║
║  │   this month        │   personal best     │ ║
║  │   ↑ $200            │   🏆 15 days        │ ║
║  │                     │                     │ ║
║  └─────────────────────┴─────────────────────┘ ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**Grid Specifications**:
- **Layout**: 2 columns x 2 rows
- **Gap**: 16px entre cards
- **Padding**: 16px horizontal
- **Card Size**: Cada card es ~170px ancho x ~120px alto

**Individual Card Design**:

**Card 1: SALES**
```
╔═══════════════════════╗
║  🎯 SALES             ║
║                     ║
║       8             ║  ← Número grande
║   target: 10        ║  ← Subtítulo
║  ████████░░         ║  ← Progress bar
║                     ║
╚═══════════════════════╝
```
- **Background**: #1E293B
- **Border**: 1px solid #334155
- **Border-radius**: 12px
- **Padding**: 16px
- **Icono 🎯**: 24px, color #D4AF37, top left
- **Título "SALES"**: 
  - Font: DM Sans Medium
  - Size: 12px
  - Color: #94A3B8
  - Uppercase
- **Número "8"**:
  - Font: DM Sans Bold
  - Size: 36px
  - Color: #F1F5F9
  - Center
- **"target: 10"**:
  - Font: DM Sans Regular
  - Size: 12px
  - Color: #64748B
  - Center
- **Progress bar**:
  - Width: 100%
  - Height: 6px
  - Fill: #22C55E (green)
  - Background: #334155

**Card 2: COMMISSION**
```
╔═══════════════════════╗
║  💵 COMMISSION        ║
║                     ║
║     $4,800           ║
║    rate: 60%         ║
║   ████████░░         ║
║                     ║
╚═══════════════════════╝
```
- **Icono 💵**: 24px, color #22C55E
- **Número "$4,800"**: 32px, color #22C55E (green)
- **"rate: 60%"**: Same style que "target: 10"

**Card 3: AVG. DEAL**
```
╔═══════════════════════╗
║  📊 AVG. DEAL         ║
║                     ║
║    $1,500            ║
║   this month         ║
║   ↑ $200             ║
║                     ║
╚═══════════════════════╝
```
- **Icono 📊**: 24px, color #3B82F6
- **Número "$1,500"**: 32px, color #3B82F6 (blue)
- **"this month"**: 12px, color #64748B
- **"↑ $200"**: 14px, color #22C55E, con icono

**Card 4: STREAK**
```
╔═══════════════════════╗
║  🔥 STREAK            ║
║                     ║
║      12 days         ║
║   personal best      ║
║   🏆 15 days         ║
║                     ║
╚═══════════════════════╝
```
- **Icono 🔥**: 24px, color #F59E0B (orange), animation pulse
- **Número "12 days"**: 32px, color #F59E0B
- **"personal best"**: 12px, color #64748B
- **"🏆 15 days"**: 14px, con trofeo, color #D4AF37

---

### 4. INCOME BREAKDOWN SECTION (20% altura = ~160px)

```
╔════════════════════════════════════════════════╗
║  📈 INCOME BREAKDOWN                           ║
║  ─────────────────────────────────────────────  ║
║                                                  ║
║  Sales Commissions     $4,800               80%  ║
║  ████████████████████░░░░░░░░░░░░░░░░░░░░░░  ║
║                                                  ║
║  Bonuses                $600               10%  ║
║  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║                                                  ║
║  Overrides              $0                 0%   ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║                                                  ║
║  ═════════════════════════════════════════════   ║
║  TOTAL                 $5,400                   ║
╚════════════════════════════════════════════════╝
```

**Dimensions**:
- **Width**: 100% - 32px padding
- **Padding**: 20px (top), 16px (bottom), 16px (sides)
- **Background**: #1E293B
- **Border-radius**: 16px
- **Border**: 1px solid #334155

**Elementos**:

**A. Header**
- Icono 📈: 20px, color #94A3B8
- Título "INCOME BREAKDOWN":
  - Font: DM Sans Medium
  - Size: 14px
  - Color: #94A3B8
  - Uppercase
  - Letter spacing: 1px
- Línea separadora: 1px solid #334155, width 100%

**B. Income Rows** (3 filas)

**Row 1: Sales Commissions**
- **Label**: "Sales Commissions"
  - Font: DM Sans Regular
  - Size: 14px
  - Color: #F1F5F9
- **Amount**: "$4,800"
  - Font: DM Sans Bold
  - Size: 16px
  - Color: #22C55E
  - Align: right
- **Percentage**: "80%"
  - Font: DM Sans Medium
  - Size: 14px
  - Color: #94A3B8
  - Align: right
- **Progress Bar**:
  - Width: 100%
  - Height: 8px
  - Border-radius: 4px
  - Background: #334155
  - Fill: Gradiente #22C55E → #16A34A
  - Animation: Smooth fill from 0 to 80%

**Row 2: Bonuses**
- Same layout, different colors:
  - Amount: "$600" en #3B82F6
  - Progress fill: #3B82F6
  - Percentage: "10%"

**Row 3: Overrides**
- Same layout, different colors:
  - Amount: "$0" en #64748B
  - Progress fill: transparent
  - Percentage: "0%"

**C. Total Row**
- Línea separadora: 1px solid #D4AF37
- **Label**: "TOTAL"
  - Font: DM Sans Bold
  - Size: 14px
  - Color: #94A3B8
- **Amount**: "$5,400"
  - Font: DM Sans Bold
  - Size: 24px
  - Color: #D4AF37

---

### 5. ACTION BUTTONS (8% altura = ~64px)

```
╔════════════════════════════════════════════════╗
║                                                ║
║   [┌─────────────────┐]  [┌─────────────────┐] ║
║   [│  Set New Goal   │]  [│  View History   │] ║
║   [└─────────────────┘]  [└─────────────────┘] ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**Button Specifications**:

**Button 1: Set New Goal**
- **Width**: 48% - 8px gap
- **Height**: 48px
- **Background**: #1E3A8A (navy)
- **Border-radius**: 12px
- **Border**: 1px solid #1E40AF
- **Text**: "Set New Goal"
  - Font: DM Sans Medium
  - Size: 14px
  - Color: #F1F5F9
  - Center
- **Hover**: Background #1E40AF
- **Active**: Scale 0.98

**Button 2: View History**
- **Width**: 48%
- **Height**: 48px
- **Background**: Transparent
- **Border-radius**: 12px
- **Border**: 1px solid #D4AF37
- **Text**: "View History"
  - Font: DM Sans Medium
  - Size: 14px
  - Color: #D4AF37
  - Center
- **Hover**: Background rgba(212, 175, 55, 0.1)
- **Active**: Scale 0.98

---

## 🎨 Color Palette - GOAL SHEET

``💰 Gold Primary:     #D4AF37  ████
💰 Gold Light:       #F5D77A  ████
💚 Green (Success):   #22C55E  ████
💙 Blue (Info):       #3B82F6  ████
🟠 Orange (Streak):   #F59E0B  ████
🟦 Navy:             #1E3A8A  ████
⬛ Card BG:          #1E293B  ████
🖤 Border:           #334155  ████
```

---

## 📱 Responsive Behavior

### iPhone SE (375x667)
- Stats grid: 2x2 (igual)
- Font sizes: -2px
- Spacing: -4px

### iPhone 14 Pro Max (430x932)
- Stats grid: 2x2 (igual)
- Font sizes: +2px
- Spacing: +4px

### iPad (768x1024)
- Stats grid: mantener 2x2 (no 4x1)
- Card width: max 240px
- Center content horizontal

---

## ✨ Micro-Interactions

### On Load
1. Hero card fades in (300ms)
2. Progress bars fill from 0 to value (800ms, ease-out)
3. Numbers count up (500ms)
4. Stats cards cascade in (100ms delay between each)

### On Tap
- **Hero card**: Expands to show monthly comparison
- **Stats cards**: Expand to show breakdown
- **Set New Goal**: Opens modal with goal form
- **View History**: Navigates to history screen

### Progress Bars
- Animate from 0 to current %
- Duration: 800ms
- Easing: ease-out
- Shimmer effect on fill

---

## 📊 States & Variations

### Empty State (First Month)
```
╔════════════════════════════════════════════════╗
║            💰 MONTHLY INCOME GOAL              ║
║                                                ║
║                  $0                           ║
║            of $15,000 target                   ║
║                                                ║
║         ╔═══════════════════════════╗          ║
║         ║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║          ║
║         ║         0%                   ║          ║
║         ╚═══════════════════════════╝          ║
║                                                ║
║      💡 Set your first monthly goal!          ║
║           [Set Goal Now]                       ║
║                                                ║
╚════════════════════════════════════════════════╝
```

### Goal Achieved State
```
╔════════════════════════════════════════════════╗
║            🎉 GOAL ACHIEVED!                   ║
║            ═══════════════════                  ║
║                                                ║
║                $15,000                        ║
║            ✓ Target Reached!                  ║
║                                                ║
║         ╔═══════════════════════════╗          ║
║         ║█████████████████████████████║          ║
║         ║        100%                   ║          ║
║         ╚═══════════════════════════╝          ║
║                                                ║
║    🏆 Excellent! You beat your goal by 5%      ║
║         [Set New Goal]                        ║
║                                                ║
╚════════════════════════════════════════════════╝
```

- Confetti animation 🎊
- Gold glow pulsing
- Trophy icon bounces
- Sound effect (success chime)

---

## 🔔 Notifications / Motivational Messages

### Progress Milestones (Trigger cuando pasa thresholds)
- **25%**: "Good start! Keep pushing 🌱"
- **50%**: "Halfway there! 💪"
- **75%**: "Almost there! 🎯"
- **90%**: "Just $1,500 more! You've got this! 🔥"
- **100%**: "🎉 GOAL ACHIEVED! You're amazing!"

### Streak Milestones
- **3 days**: "🔥 3-day streak! Building momentum!"
- **7 days**: "🏆 Week streak! Legendary!"
- **15 days**: "👑 Personal best! Unstoppable!"

---

## 📦 Assets Needed

### Icons
- 💰 Money Bag (32px, 24px)
- 🎯 Target (24px)
- 💵 Dollar Bill (24px)
- 📊 Chart (24px)
- 🔥 Fire (24px) - animated
- 🏆 Trophy (20px)
- 📈 Trend Up (20px)
- 📅 Calendar (16px)

### Images
- Celebration illustration (para goal achieved)
- Confetti particles (PNG con transparencia)

---

## 🎯 Success Criteria

El diseño exitoso de GOAL SHEET debe:

1. ✅ **Claridad Instantánea**: Usuario entiende su situación en < 3 segundos
2. ✅ **Motivación Visual**: Progreso visible genera deseo de continuar
3. ✅ **Información Jerarquizada**: Lo más importante (earnings) es lo más grande
4. ✅ **Accesibilidad**: Contrast ratios WCAG AA compliant
5. ✅ **Performance**: Animaciones 60fps fluidas
6. ✅ **Emoción Positiva**: Colores y diseño generan optimismo

---

# SCREEN 7: PLAY ROLE - Guía de Diseño Detallada

## 🎭 Propósito & Objetivos

### ¿Qué es?
Un **simulador de práctica** donde el sales rep puede:
- Practicar objection handling sin riesgo
- Recibir feedback instantáneo del AI Coach
- Medir su progreso y mejora over time
- Construir confidence muscle memory

### ¿Por qué existe?
- **Safe Practice**: "Equivocarse sin perder una venta real"
- **Confidence**: "Construir memoria muscular"
- **Improvement**: "Ver progreso cuantificado"
- **Preparation**: "Estar listo para cualquier objeción"

### Emoción que debe generar
**🎮 Game-like Fun + 📈 Progress + 🏆 Achievement + 💪 Confidence**

---

## 📐 Layout Completo con Dimensiones

### Vista Principal: Scenario Selection

```
┌─────────────────────────────────────┐
│ ← BACK        PLAY ROLE             │  ← Header (12%)
│         Practice & Perfect           │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Choose a Scenario            │ │  ← Filter Section (8%)
│  │  [All][Price][Closing][Spouse]│ │
│  └───────────────────────────────┘ │
├─────────────────────────────────────┤
│                                     │
│         [FEATURED SCENARIO]         │  ← Featured (25%)
│                                     │
├─────────────────────────────────────┤
│                                     │
│         [SCENARIO LIST]             │  ← List (45%)
│      (scrollable, 6+ items)         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       [WEEKLY PRACTICE STATS]       │  ← Stats (10%)
│     12 practices this week          │
└─────────────────────────────────────┘
```

---

### 1. HEADER SECTION (12% altura = ~96px)

**Igual que Goal Sheet**, pero:
- **Título**: "PLAY ROLE"
- **Subtítulo**: "Practice & Perfect"

---

### 2. FILTER SECTION (8% altura = ~64px)

```
╔════════════════════════════════════════════════╗
║  Choose a Scenario                            ║
║  ─────────────────────────────────────────────  ║
║                                                 ║
║  [┌────┐][┌──────┐][┌───────┐][┌───────┐]    ║
║  [│All │][│Price │][│Closing│][│Spouse │]    ║
║  [└────┘][┌──────┐][┌───────┐][┌───────┐]    ║
║         [│Other │][│Timing │][│Compet │]    ║
║         [└──────┘][└───────┘][└───────┘]    ║
║                                                 ║
╚════════════════════════════════════════════════╝
```

**Specifications**:

**Title Row**:
- **"Choose a Scenario"**:
  - Font: DM Sans Medium
  - Size: 16px
  - Color: #F1F5F9
  - Padding: 16px horizontal
  - Margin-bottom: 8px

**Filter Chips** (horizontal scroll):
- **Chip Dimensions**:
  - Height: 36px
  - Padding: 0 16px
  - Border-radius: 18px (pill)
  - Gap: 8px

**Chip States**:

**Inactive Chip**:
```
┌────────────┐
│  Price     │
└────────────┘
```
- Background: transparent
- Border: 1px solid #334155
- Text: #94A3B8
  - Font: DM Sans Medium
  - Size: 13px

**Active Chip**:
```
┌────────────────┐
│  All          │
└────────────────┘
```
- Background: #D4AF37 (gold)
- Border: 1px solid #D4AF37
- Text: #020204 (black)
  - Font: DM Sans Bold
  - Size: 13px
- Glow: `box-shadow: 0 0 12px rgba(212, 175, 55, 0.4)`

**Scroll Behavior**:
- Horizontal snap
- Show first chip fully
- Indicate more content with fade on right

---

### 3. FEATURED SCENARIO CARD (25% altura = ~200px)

```
╔════════════════════════════════════════════════╗
║  ⭐ FEATURED SCENARIO                          ║
║  ─────────────────────────────────────────────  ║
║                                                 ║
║  💰 THE PRICE OBJECTION                        ║
║  Practice: "It's too expensive for us"        ║
║                                                 ║
║  ●●●○○  Medium Difficulty                      ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  Avg. Score: 7.2/10   Your Best: 8.5/10  │ ║
║  │  [─────────────────][─────────────────]   │ ║
║  │         72%               85%              │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │      [▶ START PRACTICE]                   │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
╚════════════════════════════════════════════════╝
```

**Card Specifications**:
- **Width**: 100% - 32px
- **Height**: 200px
- **Background**: Gradiente radial #1E3A8A → #0F172A
- **Border**: 2px solid #D4AF37 (gold glow)
- **Border-radius**: 20px
- **Padding**: 20px
- **Box-shadow**: `0 8px 32px rgba(212, 175, 55, 0.2)`

**Elements**:

**A. Header Row**
- Icono ⭐: 20px, color #D4AF37, top left
- Text "FEATURED SCENARIO":
  - Font: DM Sans Bold
  - Size: 12px
  - Color: #D4AF37
  - Uppercase
  - Letter spacing: 1px

**B. Scenario Title**
- Icono 💰: 28px, color #F59E0B
- Título "THE PRICE OBJECTION":
  - Font: DM Sans Bold
  - Size: 20px
  - Color: #F1F5F9
  - Line-height: 1.3

**C. Description**
- "Practice: 'It's too expensive for us'"
  - Font: DM Sans Regular
  - Size: 14px
  - Color: #94A3B8
  - Italic para el quote

**D. Difficulty Indicator**
```
●●●○○  Medium Difficulty
```
- **Dots**: 5 circles
  - Filled: 10px diameter, #F59E0B
  - Empty: 10px diameter, #334155
  - Spacing: 4px
- **Text**: "Medium Difficulty"
  - Font: DM Sans Medium
  - Size: 12px
  - Color: #94A3B8

**E. Score Comparison**
```
┌───────────────────────────────────────────┐
│  Avg. Score: 7.2/10   Your Best: 8.5/10  │
│  [─────────────────][─────────────────]   │
│         72%               85%              │
└───────────────────────────────────────────┘
```
- **Container**: Background #0F172A, border-radius 8px, padding 12px
- **Label Row**:
  - "Avg. Score: 7.2/10":
    - Font: DM Sans Regular
    - Size: 11px
    - Color: #94A3B8
  - "Your Best: 8.5/10":
    - Font: DM Sans Bold
    - Size: 11px
    - Color: #D4AF37
- **Progress Bars**:
  - Avg: 72% fill, #64748B
  - Best: 85% fill, #D4AF37
  - Height: 4px

**F. CTA Button**
- **"START PRACTICE"**:
  - Width: 100%
  - Height: 48px
  - Background: #D4AF37
  - Border-radius: 12px
  - Font: DM Sans Bold
  - Size: 16px
  - Color: #020204
  - Icon ▶: 16px, left of text
  - Hover: Scale 1.02
  - Active: Scale 0.98

---

### 4. SCENARIO LIST (45% altura = ~360px, scrollable)

```
╔════════════════════════════════════════════════╗
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  📅 Spouse Needs Approval    ●●○○○ Easy  │ ║
║  │  "I need to talk to my spouse"           │ ║
║  │  Score: 9.0/10   🏆 Personal Best         │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  ⏰ Not the Right Time          ●●●○○ Med │ ║
║  │  "We're not looking right now"           │ ║
║  │  Score: 7.5/10                            │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  🏆 Already a Member            ●●○○○ Easy│ ║
║  │  "We already have a membership"           │ ║
║  │  Score: 6.0/10                            │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  🔄 Competitor Comparison        ●●●●○ Hard│║
║  │  "X Brand offers more for less"           │ ║
║  │  Score: 8.0/10                            │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  [Scroll para más escenarios...]               ║
║                                                 ║
╚════════════════════════════════════════════════╝
```

**List Item Card** (cada scenario):

**Dimensions**:
- Width: 100% - 32px
- Height: 88px
- Background: #1E293B
- Border: 1px solid #334155
- Border-radius: 12px
- Padding: 16px
- Margin-bottom: 12px

**Elements**:

**A. Icon** (left, top)
- **Size**: 32px
- **Icons por categoría**:
  - 📅 Spouse talks - #3B82F6
  - ⏰ Timing - #F59E0B
  - 🏆 Existing member - #22C55E
  - 🔄 Competitor - #EF4444
  - 💰 Price - #A855F7
  - 🚫 Not interested - #64748B

**B. Title**
- Font: DM Sans Bold
- Size: 16px
- Color: #F1F5F9
- Line-height: 1.3
- Max lines: 1

**C. Description**
- "I need to talk to my spouse" (in italic)
- Font: DM Sans Regular italic
- Size: 13px
- Color: #94A3B8
- Line-height: 1.4
- Max lines: 1

**D. Difficulty Dots** (top right)
- Pattern: ●●○○○ (2 filled, 3 empty)
- Size: 8px diameter
- Filled: #F59E0B
- Empty: #334155
- Spacing: 2px
- Label: "Easy" / "Medium" / "Hard" / "Expert"
  - Font: DM Sans Medium
  - Size: 10px
  - Color: #94A3B8
  - Next to dots

**E. Score Badge** (bottom)
```
Score: 9.0/10   🏆 Personal Best
```
- **"Score: 9.0/10"**:
  - Font: DM Sans Bold
  - Size: 13px
  - Color: #22C55E (if >8.0), #F59E0B (if 6-8), #EF4444 (if <6)
- **"🏆 Personal Best"**:
  - Only shown if es el mejor score del usuario
  - Font: DM Sans Medium
  - Size: 11px
  - Color: #D4AF37

**Interaction States**:

**Default**:
- Background: #1E293B
- Border: 1px solid #334155

**Pressed**:
- Background: #334155
- Scale: 0.98
- Duration: 100ms

**Hover** (if applicable):
- Background: #1E3A8A
- Border: 1px solid #D4AF37
- Scale: 1.01
- Duration: 150ms

---

### 5. WEEKLY STATS (10% altura = ~80px)

```
╔════════════════════════════════════════════════╗
║                                                 ║
║    This Week: 12 practices | +3 vs last week   ║
║                                                 ║
║    🔥 You're on fire! Keep it up!             ║
║                                                 ║
╚════════════════════════════════════════════════╝
```

**Specifications**:
- **Background**: Gradiente #1E3A8A → #0F172A
- **Border-radius**: 16px
- **Padding**: 16px
- **Border**: 1px solid #334155

**Elements**:
- **Icono 🔥**: 20px, animated pulse
- **"This Week: 12 practices"**:
  - Font: DM Sans Bold
  - Size: 16px
  - Color: #F1F5F9
- **"| +3 vs last week"**:
  - Font: DM Sans Regular
  - Size: 14px
  - Color: #22C55E
- **"🔥 You're on fire! Keep it up!"**:
  - Font: DM Sans Medium italic
  - Size: 12px
  - Color: #94A3B8

---

## 🎮 PRACTICE MODE (Dentro de un Scenario)

Cuando el usuario selecciona un scenario, la screen cambia a:

```
┌─────────────────────────────────────┐
│ ✕  The Price Objection   [⏸️][💬]│  ← Practice Header
│  ────────────────────────────────── │
│                                     │
│  🙋 Client: "It's too expensive"    │  ← Objection Display
│                                     │
│  ┌─────────────────────────────────┐│  ← AI Tip Box
│  │ 💡 AI Coach Tip:                ││
│  │ Acknowledge first, then pivot   ││
│  │ to value, not price             ││
│  └─────────────────────────────────┘│
│                                     │
│  🎤 Your Response:                  │  ← Input Section
│  ╔═════════════════════════════════╗│
│  ║ [Record your response...]      ║│
│  ║                                 ║│
│  ║                                 ║│
│  ╚═════════════════════════════════╝│
│                                     │
│  [🎙️ Record]  [⌨️ Type]  [✓ Submit]│  ← Action Buttons
└─────────────────────────────────────┘
```

### Practice Mode Elements

**A. Header**
- **Close button ✕**: 24px, top left
- **Title**: "The Price Objection"
  - Font: DM Sans Bold
  - Size: 18px
  - Color: #F1F5F9
- **Actions** (top right):
  - ⏸️ Pause: 20px
  - 💬 Hint: 20px

**B. Client Objection Display**
- **Icono 🙋**: 40px, color #94A3B8
- **Quote**: "It's too expensive"
  - Font: DM Sans Medium italic
  - Size: 20px
  - Color: #F1F5F9
  - In quote marks
- **Background**: #0F172A
- **Border-left**: 4px solid #EF4444
- **Padding**: 16px
- **Border-radius**: 8px

**C. AI Tip Box**
- **Icono 💡**: 16px
- **"AI Coach Tip:"**:
  - Font: DM Sans Bold
  - Size: 12px
  - Color: #D4AF37
- **Tip text**:
  - Font: DM Sans Regular
  - Size: 13px
  - Color: #94A3B8
- **Background**: rgba(212, 175, 55, 0.1)
- **Border**: 1px solid #D4AF37
- **Border-radius**: 8px
- **Padding**: 12px

**D. Input Section**

**Voice Mode (Default)**:
```
┌─────────────────────────────────────┐
│  🎤 Your Response:                  │
│  ╔═════════════════════════════════╗│
│  ║ Tap microphone to start...     ║│
│  ║                                 ║│
│  ╚═════════════════════════════════╝│
│                                     │
│       [🎙️ Record Response]           │
└─────────────────────────────────────┘
```
- **Recording state**:
  - Pulse animation on mic
  - Timer: "0:00 / 1:00"
  - Waveform animation
  - "Stop Recording" button when active

**Text Mode**:
```
┌─────────────────────────────────────┐
│  🎤 Your Response:                  │
│  ╔═════════════════════════════════╗│
│  ║ Type your response here...     ║│
│  ║                                 ║│
│  ║                                 ║│
│  ║                                 ║│
│  ╚═════════════════════════════════╝│
│  0/280 characters                   │
└─────────────────────────────────────┘
```

**E. Action Buttons**

**Row of 3 buttons**:
```
[🎙️ Record]  [⌨️ Type]  [✓ Submit]
```

**Button 1: Record**
- Width: 32%
- Height: 48px
- Background: #D4AF37
- Border-radius: 12px
- Icon 🎙️: 20px
- Text: "Record"
- Font: DM Sans Bold
- Size: 14px
- Color: #020204
- Active state: Pulsing red cuando recording

**Button 2: Type**
- Width: 32%
- Height: 48px
- Background: #1E3A8A
- Border-radius: 12px
- Icon ⌨️: 20px
- Text: "Type"
- Font: DM Sans Medium
- Size: 14px
- Color: #F1F5F9

**Button 3: Submit**
- Width: 32%
- Height: 48px
- Background: #22C55E
- Border-radius: 12px
- Icon ✓: 20px
- Text: "Submit"
- Font: DM Sans Bold
- Size: 14px
- Color: #020204
- Disabled: #334155 cuando no hay input

---

## 📊 FEEDBACK SCREEN (Después de Submit)

```
╔════════════════════════════════════════════════╗
║  ✓ Response Complete                          ║
║  ─────────────────────────────────────────────  ║
║                                                 ║
║       Your Score: 8.5/10                      ║
║      ⭐⭐⭐⭐☆                              ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  ✅ Strengths                            │ ║
║  │  ─────────────────────────────────────   │ ║
║  │  • Good acknowledgment                  │ ║
║  │  • Confident delivery                   │ ║
║  │  • Used social proof effectively         │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  💡 Improvements                         │ ║
║  │  ─────────────────────────────────────   │ ║
║  │  • Add specific benefit mention           │ ║
║  │  • Include urgency element                │ ║
║  │  • Close with next step                  │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  ┌───────────────────────────────────────────┐ ║
║  │  🎯 Suggested Response                    │ ║
║  │  ─────────────────────────────────────   │ ║
║  │  "I understand budget is important.       │ ║
║  │   Most members find the value far         │ ║
║  │   exceeds the investment, especially       │ ║
║  │   with our exclusive perks..."            │ ║
║  └───────────────────────────────────────────┘ ║
║                                                 ║
║  [🔄 Try Again]  [→ Next Scenario]           ║
║                                                 ║
╚════════════════════════════════════════════════╝
```

### Feedback Screen Elements

**A. Success Header**
- Icono ✓: 40px, color #22C55E, animated checkmark
- "Response Complete":
  - Font: DM Sans Bold
  - Size: 20px
  - Color: #22C55E
- Animation: Confetti burst 🎊

**B. Score Display**
- **"Your Score: 8.5/10"**:
  - Font: DM Sans Bold
  - Size: 48px
  - Color: #D4AF37
  - Animation: Count up from 0 to 8.5
- **Stars**:
  - ⭐⭐⭐⭐☆ (32px each)
  - Filled: #D4AF37
  - Empty: #334155
  - Animation: Stagger fill, 100ms delay cada uno

**C. Strengths Section**
- **Icono ✅**: 16px, color #22C55E
- **"Strengths"**:
  - Font: DM Sans Bold
  - Size: 14px
  - Color: #22C55E
- **Bullet points**:
  - Each strength: Font DM Sans Regular, 13px, #F1F5F9
  - Bullet: • en #22C55E

**D. Improvements Section**
- **Icono 💡**: 16px, color #F59E0B
- **"Improvements"**:
  - Font: DM Sans Bold
  - Size: 14px
  - Color: #F59E0B
- **Bullet points**: Same style, color #F1F5F9

**E. Suggested Response**
- **Icono 🎯**: 16px, color #3B82F6
- **"Suggested Response"**:
  - Font: DM Sans Bold
  - Size: 14px
  - Color: #3B82F6
- **Quote**: Text en italic, DM Sans Regular, 13px, #94A3B8
- **Background**: #0F172A
- **Border-left**: 4px solid #3B82F6
- **Border-radius**: 8px
- **Padding**: 16px

**F. Action Buttons**

**Button 1: Try Again**
- Width: 48%
- Height: 48px
- Background: #1E3A8A
- Text: "🔄 Try Again"
- Font: DM Sans Medium, 14px, #F1F5F9
- Border-radius: 12px

**Button 2: Next Scenario**
- Width: 48%
- Height: 48px
- Background: #22C55E
- Text: "→ Next Scenario"
- Font: DM Sans Bold, 14px, #020204
- Border-radius: 12px

---

## 🎨 Color Palette - PLAY ROLE

```
🎭 Difficulty Colors:
Easy:     #22C55E  ████ (green)
Medium:   #F59E0B  ████ (orange)
Hard:     #EF4444  ████ (red)
Expert:   #A855F7  ████ (purple)

📊 Score Colors:
9-10:     #D4AF37  ████ (gold)
7-8:      #22C55E  ████ (green)
5-6:      #F59E0B  ████ (orange)
0-4:      #EF4444  ████ (red)

💬 Feedback:
Success:  #22C55E  ████
Improve:  #F59E0B  ████
Suggest:  #3B82F6  ████
```

---

## ✨ Animations & Micro-Interactions

### Scenario Selection
1. **Cards slide up**: Stagger, 50ms delay cada uno
2. **Featured card**: Subtle pulse en el gold border
3. **Difficulty dots**: Animan in
4. **On tap**: Scale 0.98, brightness +10%

### Practice Mode
1. **Objection appears**: Fade in (300ms)
2. **Tip box**: Slide in from right (400ms)
3. **Voice recording**:
   - Mic pulse (1s loop)
   - Waveform anima
   - Timer counts up
4. **Submit button**: Shakes si no hay input

### Feedback Screen
1. **Score reveal**: Count up (800ms)
2. **Stars fill**: Stagger (100ms delay)
3. **Confetti**: Burst from center (500ms)
4. **Sections cascade**: Each section fade in con delay

---

## 🏆 Gamification Elements

### Achievement Badges
```
🌟 First Practice     - Complete 1 scenario
🔥 3-Day Streak       - Practice 3 days in a row
💪 10 Practices       - Complete 10 scenarios total
🎯 Sharpshooter       - Score 9.0+ on 3 scenarios
🏆 Master            - Score 10.0 on any scenario
📚 Scholar           - Complete all scenarios once
```

### Leaderboard (Optional)
```
┌─────────────────────────────────────┐
│  This Week's Top Performers         │
│  ────────────────────────────────── │
│                                     │
│  1.  Carlos M.   45 practices  🥇   │
│  2.  Sarah K.    42 practices  🥈   │
│  3.  Mike R.     38 practices  🥉   │
│                                     │
│  12. You         12 practices       │
│                                     │
└─────────────────────────────────────┘
```

### Streak Tracking
```
┌─────────────────────────────────────┐
│  🔥 Current Streak: 5 days         │
│  🏆 Personal Best: 15 days         │
│  📊 Total Practices: 127            │
└─────────────────────────────────────┘
```

---

## 📦 Assets Needed

### Icons
- 🎭 Theater Masks (logo, 32px)
- 🎤 Microphone (24px, 48px)
- ⌨️ Keyboard (20px)
- ✓ Check (20px, 40px)
- → Arrow (20px)
- ⭐ Stars (16px, 24px, 32px)
- 🏆 Trophy (varios tamaños)
- 🔥 Fire (animated, 24px)
- 💡 Lightbulb (16px, 24px)
- ✅ Checkmark (16px)
- ⏸️ Pause (20px)
- 💬 Chat/Hint (20px)
- 🙋 Person (40px)
- 🎯 Target (16px)

### Images
- Confetti particles (PNG, varios tamaños)
- Trophy icons (diferentes estilos)
- Achievement badges (diseño custom)
- Celebration illustrations

---

## 🎯 Success Criteria

El diseño exitoso de PLAY ROLE debe:

1. ✅ **Game-like Fun**: Se siente como un juego, no como trabajo
2. ✅ **Clear Progress**: Usuario ve su mejora over time
3. ✅ **Motivating**: Feedback alienta a continuar practicando
4. ✅ **Safe Environment**: No hay presión, es espacio de práctica
5. ✅ **Quick Feedback**: Feedback inmediato después de cada práctica
6. ✅ **Variety**: Suficientes escenarios para mantener interés

---

## 📱 User Flow Summary

```
ENTRY POINT: Dashboard → Play Role button
           ↓
    SELECT SCENARIO (Filter → Choose)
           ↓
    PRACTICE MODE (Voice/Text input)
           ↓
    FEEDBACK SCREEN (Score + tips)
           ↓
    DECISION: Try Again OR Next Scenario
           ↓
    REPEAT OR EXIT
```

---

## 🎓 Learning Curve

### First Time User
1. Onboarding modal explica cómo funciona
2. Featured scenario highlighted para empezar
3. "Start Practice" button obvious
4. Voice mode default (más natural)

### Returning User
1. See weekly stats motivation
2. Continue desde donde left off
3. Personal bests prominent
4. New scenarios highlighted si available

---

## 🚀 Next Steps After Design

1. **Create icon set** para todos los escenarios
2. **Design achievement badges** 
3. **Build animations** (confetti, pulse, etc)
4. **Test user flow** con users reales
5. **Iterate** based en feedback

---

**Fin de la guía detallada**

Ambas screens están completamente especificadas para implementación en Stitch/Figma.

¿Listo para empezar a diseñar? 🎨
