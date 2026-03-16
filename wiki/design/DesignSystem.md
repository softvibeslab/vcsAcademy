# Sistema de Diseño

Guía completa del sistema de diseño de VCSA.

## 🎨 Identidad de Marca

### Arquetipo
**The High-Performance Luxury Authority**

### Tono Emocional
Exclusive, Wealth-Building, Elite, Kinetic, Authoritative

### Mood Visual
Dark Luxury, Amex Centurion, Rolex, High-Stakes Poker

### Valores Principales
- **Mastery** - Excelencia en todo
- **Consistency** - Resultados predecibles
- **Wealth** - Éxito financiero
- **Status** - Reconocimiento elite

---

## 🎨 Paleta de Colores

### Colores Principales

```css
/* Backgrounds */
--background: #020204;          /* Fondo principal */
--card: #0A0A0B;                /* Fondo de tarjetas */
--card-hover: #121214;          /* Hover de tarjetas */

/* Primary */
--primary: #D4AF37;             /* Gold - SOLO para alto valor */
--primary-hover: #B4942D;       /* Gold hover */

/* Secondary */
--secondary: #1E3A8A;           /* Navy */
--accent: #F59E0B;              /* Orange accent */

/* Muted */
--muted: #1F1F22;               /* Gray muted */

/* Borders */
--border: rgba(255,255,255,0.08);  /* Borde sutil */
--border-active: #D4AF37;          /* Borde activo (gold) */

/* Text */
--text-main: #F8FAFC;           /* Texto principal */
--text-muted: #94A3B8;          /* Texto secundario */
```

### Reglas de Uso de Colores

1. **Gold (#D4AF37)**: USAR SOLO para acciones de alto valor
   - Suscribirse (Subscribe)
   - Actualizar (Upgrade)
   - Ganar (Win/Achieve)
   - NO usar para elementos comunes

2. **Texto**: NUNCA usar blanco puro (#FFFFFF)
   - Usar `#F8FAFC` o `#F1F5F9`
   - Evita fatiga visual

3. **Bordes**: Siempre sutiles
   - `rgba(255,255,255,0.08)` - estándar
   - `rgba(255,255,255,0.05)` - más sutil
   - `rgba(255,255,255,0.1)` - más visible

### Gradientes

```css
/* Gold Rush - para CTAs principales */
--gradient-gold: linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%);

/* Deep Ocean - para fondos */
--gradient-ocean: linear-gradient(180deg, #020204 0%, #0F172A 100%);

/* Glass Surface - para tarjetas glassmorphism */
--gradient-glass: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);

/* VIP Glow - efectos de luz */
--gradient-vip: radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
```

---

## ✏️ Tipografía

### Fuentes

```css
/* Headings - Playfair Display */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');

/* Body - DM Sans */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

/* Mono - JetBrains Mono */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap');
```

### Escala Tipográfica

```css
/* H1 - Hero text */
.text-5xl md:text-7xl font-bold tracking-tighter leading-none

/* H2 - Section headers */
.text-4xl md:text-5xl font-semibold tracking-tight

/* H3 - Subsections */
.text-2xl md:text-3xl font-medium tracking-normal

/* Body Large - Intro text */
.text-lg leading-relaxed text-muted-foreground

/* Body Small - Regular text */
.text-sm leading-normal text-muted-foreground

/* Caption - Labels, tags */
.text-xs uppercase tracking-widest text-muted-foreground/60
```

### Uso de Fuentes

```jsx
// ✅ CORRECTO
<h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
  {/* Playfair Display */}
  Become a Top Producer
</h1>

<p className="text-lg leading-relaxed text-muted-foreground">
  {/* DM Sans */}
  Master the art of vacation club sales
</p>

<span className="font-mono text-sm">
  {/* JetBrains Mono */}
  $12,450
</span>
```

---

## 🎭 Componentes

### Botones

```jsx
// Primary - Solo para alto valor
<button className="bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary_hover transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]">
  Subscribe Now
</button>

// Secondary
<button className="border border-border bg-transparent text-white hover:bg-white/5 hover:border-primary/50 transition-all">
  Learn More
</button>

// Ghost
<button className="text-muted-foreground hover:text-primary transition-colors">
  Cancel
</button>
```

### Tarjetas

```jsx
// Tarjeta estándar
<div className="bg-card/50 backdrop-blur-md border border-white/5 p-6 hover:border-primary/30 transition-all group relative overflow-hidden">
  {/* Contenido */}
</div>

// Feature card
<div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8">
  {/* Contenido */}
</div>

// Con efecto glow
<div className="shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]">
  {/* Contenido */}
</div>
```

### Inputs

```jsx
<input
  className="bg-black/50 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 h-12"
  placeholder="Enter your email"
/>
```

---

## 📐 Layouts

### Marketing Page - Tetris Grid

```jsx
<div className="grid grid-cols-12 gap-8 md:gap-12">
  {/* Card grande */}
  <div className="col-span-12 md:col-span-8">
    {/* Contenido */}
  </div>

  {/* Card pequeña */}
  <div className="col-span-12 md:col-span-4">
    {/* Contenido */}
  </div>

  {/* Cards medianas */}
  <div className="col-span-12 md:col-span-6">
    {/* Contenido */}
  </div>
  <div className="col-span-12 md:col-span-6">
    {/* Contenido */}
  </div>
</div>
```

### Dashboard - Bento Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Readiness Score - 2 columnas */}
  <Card className="md:col-span-2">
    <ReadinessScore />
  </Card>

  {/* Current Stage - 1 columna */}
  <Card>
    <CurrentStage />
  </Card>

  {/* Continue Learning - 2 columnas */}
  <Card className="md:col-span-2">
    <ContinueLearning />
  </Card>

  {/* Training Streak - 1 columna */}
  <Card>
    <TrainingStreak />
  </Card>
</div>
```

---

## 🎬 Animaciones

### Micro-interacciones

```jsx
// Hover effect
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  <Card>Content</Card>
</motion.div>

// Fade in
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div key={item.id} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Transiciones

```css
/* ✅ CORRECTO - Transiciones específicas */
.button {
  transition: background-color 0.2s, transform 0.1s;
}

/* ❌ EVITAR - Transición universal */
.button {
  transition: all 0.3s; /* Rompe transforms */
}
```

---

## 🎯 Patrones de Diseño

### Glassmorphism

```jsx
<div className="backdrop-blur-md bg-white/5 border border-white/10">
  {/* Contenido con efecto glass */}
</div>
```

### Depth Layers

```jsx
<div className="relative z-10">
  {/* Capa superior */}
</div>
<div className="relative z-20">
  {/* Capa media */}
</div>
<div className="relative z-30">
  {/* Capa superior */}
</div>
```

### Glow Effects

```jsx
{/* VIP Glow */}
<div className="absolute inset-0 bg-gradient-radial from-primary/15 to-transparent" />

{/* Button Glow */}
<button className="shadow-[0_0_15px_rgba(212,175,55,0.4)]">
  Subscribe
</button>
```

---

## 📏 Espaciado

### Principios Generales

1. **Usar 2-3x más espacio del que parece necesario**
2. **Evitar diseños cramped**
3. **Usar Tailwind spacing scale**

### Ejemplos

```jsx
// ✅ CORRECTO - Espaciado generoso
<div className="space-y-12">
  <Section>...</Section>
  <Section>...</Section>
</div>

<div className="p-8 md:p-12">
  {/* Contenido con padding amplio */}
</div>

// ❌ EVITAR - Espaciado insuficiente
<div className="space-y-2">
  <Section>...</Section>
  <Section>...</Section>
</div>
```

---

## 🖼️ Imágenes

### Backgrounds

```jsx
{/* Hero Background con overlay */}
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: 'url("https://images.unsplash.com/photo-...")',
  }}
>
  <div className="absolute inset-0 bg-black/70" />
  {/* Contenido */}
</div>
```

### Avatares

```jsx
{/* Avatar con glow */}
<div className="relative">
  <img
    src="avatar.jpg"
    className="w-16 h-16 rounded-full border-2 border-primary/50"
  />
  <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/20 to-transparent" />
</div>
```

---

## 🎨 Iconografía

### Uso de Iconos

```jsx
import { IconName } from 'lucide-react'

// ✅ CORRECTO - Lucide React icons
<IconName className="w-5 h-5" />

// ❌ EVITAR - Emoji como iconos
<span>🤖</span>
<span>💡</span>
```

---

## 🔥 Reglas de Oro

1. **Nunca usar blanco puro (#FFFFFF)**: Usa `#F8FAFC` o `#F1F5F9`
2. **Gold solo para alto valor**: No sobresaturar con gold
3. **Bordes siempre sutiles**: `rgba(255,255,255,0.08)` o `rgba(255,255,255,0.05)`
4. **Espaciado generoso**: 2-3x más del necesario
5. **No centrar todo**: Layouts asimétricos son más interesantes
6. **Micro-animaciones**: Cada interacción necesita feedback
7. **Profundidad con z-index**: Usa capas para crear jerarquía
8. **Glassmorphism moderado**: No abusar del efecto blur
9. **Transiciones específicas**: Evitar `transition: all`
10. **Dark colors independientes**: No usar dark colors como gradientes

---

## 📚 Referencias

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
