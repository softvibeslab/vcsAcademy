# 🔄 DIAGRAMA DE FLUJO - SISTEMA VCSA

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 VCSA ACADEMY SYSTEM                       │
│                    http://localhost:1234                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │     ¿USUARIO AUTENTICADO?           │
        └─────────────────────────────────────┘
                    │                │
                   NO               SÍ
                    │                │
                    ▼                ▼
        ┌──────────────┐   ┌──────────────────┐
        │  /landing    │   │   /dashboard     │
        │  /login      │   │   (Página        │
        │  /register   │   │    Principal)    │
        └──────────────┘   └──────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────────┐
                    │   🏠 DASHBOARD PRINCIPAL     │
                    │   - Métricas generales       │
                    │   - Progreso actual          │
                    │   - Readiness Score          │
                    │   - Streak actual            │
                    └──────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │   STRATEGY    │   │ TOP PRODUCER  │   │   COACHING    │
    │   /strategy   │   │     PATH      │   │  /coaching    │
    └───────────────┘   └───────────────┘   └───────────────┘
              │                   │                   │
              ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │📊 Daily Perf  │   │🎓 4 Stages    │   │👥 Group Coach │
    │/daily-perf    │   │/top-producer  │   │/group-coach   │
    │               │   │               │   │               │
    │🎯 Goal Sheets │   │📚 6 Tracks    │   │🎭 Role Play   │
    │/goals         │   │(36 módulos)   │   │/role-play     │
    │               │   │               │   │               │
    │💰 Financial   │   │💥 Breakdowns  │   │❓ Q&A Sessions │
    │/financial     │   │/deal-breakdowns│   │/qa-sessions   │
    │               │   │               │   │               │
    │📈 Analytics   │   │⚡ Quick Wins  │   │🎓 Masterclass │
    │/analytics     │   │/quick-wins    │   │/masterclasses │
    │(3 tabs)       │   │               │   │               │
    └───────────────┘   └───────────────┘   └───────────────┘

              │                   │                   │
              └───────────────────┼───────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────────┐
                    │   📚 ADDITIONAL LEARNING     │
                    └──────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │   COURSES     │   │  COMMUNITY    │   │   SETTINGS    │
    │   /courses    │   │  /community   │   │  /settings    │
    │               │   │               │   │               │
    │📖 Biblioteca  │   │💬 Feed        │   │👤 Profile     │
    │  de cursos    │   │  de posts     │   │/profile       │
    │               │   │               │   │               │
    │📄 Course      │   │📅 Events      │   │💳 Membership  │
    │  Detail       │   │/events        │   │/membership    │
    │/courses/:id   │   │               │   │               │
    │               │   │❤️ Likes/      │   │🔧 Admin Panel │
    │📥 Resources   │   │  Comments     │   │/admin         │
    │/resources     │   │               │   │(Solo admin)   │
    └───────────────┘   └───────────────┘   └───────────────┘
```

---

## 🎯 **TOP PRODUCER PATH - DETALLE**

```
┌─────────────────────────────────────────────────────────────┐
│              🎓 TOP PRODUCER DEVELOPMENT SYSTEM             │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                    STAGE 1: NEW REP                         │
│                  150 puntos | 1-2 semanas                    │
├───────────────────────────────────────────────────────────────┤
│ ✓ Fundamentos de ventas                                      │
│ ✓ Pro Mindset (6 módulos)                                   │
│ ✓ Discovery & Control (6 módulos)                           │
└───────────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────────┐
│                 STAGE 2: DEVELOPING REP                      │
│                  300 puntos | 2-4 semanas                    │
├───────────────────────────────────────────────────────────────┤
│ ✓ Ejecución consistente                                      │
│ ✓ Value Architecture (6 módulos)                            │
│ ✓ Decision Management (6 módulos)                           │
└───────────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────────┐
│                 STAGE 3: PERFORMING REP                      │
│                  500 puntos | 4-8 semanas                    │
├───────────────────────────────────────────────────────────────┤
│ ✓ Cierre consistente                                         │
│ ✓ Objection Mastery (6 módulos)                             │
│ ✓ Post-Decision Integrity (6 módulos)                       │
└───────────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────────┐
│                 STAGE 4: TOP PRODUCER                        │
│                  750 puntos | 8-12 semanas                   │
├───────────────────────────────────────────────────────────────┤
│ ✓ Élite performer                                           │
│ ✓ Dominio de todas las habilidades                           │
│ ✓ Liderazgo en el equipo                                     │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 **DAILY PERFORMANCE - DETALLE**

```
┌─────────────────────────────────────────────────────────────┐
│         📊 DAILY PERFORMANCE TRACKING SYSTEM                │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  TAB 1: OVERVIEW                                              │
│  ├── Resumen diario de métricas                              │
│  ├── Progreso de atributos                                   │
│  └── Combo del día                                            │
├───────────────────────────────────────────────────────────────┤
│  TAB 2: SALES GRID                                            │
│  └── Grid de 25 días con ventas diarias                      │
├───────────────────────────────────────────────────────────────┤
│  TAB 3: ATTRIBUTES                                            │
│  └── Tracker de 7 atributos personales                       │
│      ├── Commitment                                          │
│      ├── Preparation                                         │
│      ├── Energy                                              │
│      ├── Attitude                                            │
│      ├── Resilience                                          │
│      ├── Adaptability                                        │
│      └── Professionalism                                     │
├───────────────────────────────────────────────────────────────┤
│  TAB 4: METRICS                                               │
│  └── Métricas financieras detalladas                         │
├───────────────────────────────────────────────────────────────┤
│  TAB 5: CHALLENGES                                            │
│  └── Daily challenges (weekdays + weekend mode)              │
├───────────────────────────────────────────────────────────────┤
│  TAB 6: GOALS                                                 │
│  └── Metas SMART con tracking                                │
└───────────────────────────────────────────────────────────────┘

          🎯 COMBO DIARIO: 7 atributos = 100 puntos bonus
```

---

## 🎮 **GAMIFICATION SYSTEM**

```
┌─────────────────────────────────────────────────────────────┐
│              🎮 GAMIFICATION & REWARDS SYSTEM              │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  📊 POINTS SYSTEM                                             │
│  ├── 10 puntos por módulo completado                         │
│  ├── 5 puntos por deal breakdown                             │
│  ├── 3 puntos por quick win                                  │
│  └── 100 puntos bonus (combo diario 7 atributos)            │
├───────────────────────────────────────────────────────────────┤
│  🏆 BADGES (14 Total)                                         │
│  ├── 7 Badges de Atributos                                   │
│  │   ├── Commitment Champion                                 │
│  │   ├── Preparation Pro                                     │
│  │   ├── Energy Expert                                       │
│  │   ├── Attitude Ace                                        │
│  │   ├── Resilience Rockstar                                 │
│  │   ├── Adaptability All-Star                               │
│  │   └── Professionalism Pro                                 │
│  ├── 3 Badges de Streaks                                     │
│  │   ├── 3-Day Streak                                        │
│  │   ├── 7-Day Streak                                        │
│  │   └── 30-Day Streak                                       │
│  └── 4 Badges de Logros                                      │
│      ├── First Sale                                          │
│      ├── Week Warrior                                        │
│      ├── Monthly Master                                      │
│      └── Top Performer                                       │
├───────────────────────────────────────────────────────────────┤
│  🏅 LEADERBOARDS                                              │
│  ├── Daily Leaderboard (Top del día)                        │
│  ├── Weekly Leaderboard (Top de la semana)                  │
│  ├── Monthly Leaderboard (Top del mes)                      │
│  └── Attributes Leaderboard (Ranking por atributo)          │
└───────────────────────────────────────────────────────────────┘

⚡ STREAK SYSTEM: Ventana de 24hr para mantener streak activo
```

---

## 📈 **READINESS SCORE FORMULA**

```
┌─────────────────────────────────────────────────────────────┐
│              📈 READINESS SCORE CALCULATION                 │
└─────────────────────────────────────────────────────────────┘

Readiness Score =
  (Video Completion × 40%) +
  (Track Progress × 30%) +
  (Quick Wins Applied × 10%) +
  (Breakdowns Reviewed × 10%) +
  (Training Streak × 10%)

  Rango: 0-100
  Objetivo: Mantener score > 80 para óptimo performance
```

---

## 🚀 **ONBOARDING FLOW**

```
┌─────────────────────────────────────────────────────────────┐
│              🚀 NEW USER ONBOARDING FLOW                    │
└─────────────────────────────────────────────────────────────┘

  /register → /login
       │
       ▼
┌───────────────────────────────────────────────────────────────┐
│  STEP 0: WELCOME                                              │
│  └── Tipo de organización                                    │
├───────────────────────────────────────────────────────────────┤
│  STEP 1: BRANDING                                             │
│  ├── Logo                                                    │
│  ├── Colores (Primary/Secondary)                            │
│  └── Fuentes                                                 │
├───────────────────────────────────────────────────────────────┤
│  STEP 2: CONTENT                                              │
│  ├── Custom Tracks enabled/disabled                          │
│  ├── Industry focus                                          │
│  └── Target audience                                         │
├───────────────────────────────────────────────────────────────┤
│  STEP 3: SETTINGS                                             │
│  ├── Gamification on/off                                     │
│  ├── Community on/off                                        │
│  ├── Events on/off                                           │
│  └── Badges on/off                                           │
├───────────────────────────────────────────────────────────────┤
│  STEP 4: TEAM                                                 │
│  └── Invite members via email                                │
├───────────────────────────────────────────────────────────────┤
│  STEP 5: LAUNCH ✅                                            │
│  └── Review summary → Launch → /dashboard                   │
└───────────────────────────────────────────────────────────────┘

✅ CORREGIDO: Ahora redirige correctamente al dashboard
```

---

## 📱 **PWA MOBILE EXPERIENCE**

```
┌─────────────────────────────────────────────────────────────┐
│              📱 MOBILE PWA FEATURES                         │
└─────────────────────────────────────────────────────────────┘

✅ PWA Ready
   ├── Installable en iOS/Android
   ├── Service Worker activado
   ├── Offline capability
   └── Push notifications ready

✅ Mobile-Optimized UI
   ├── Touch-friendly buttons
   ├── Swipe gestures
   ├── Bottom navigation
   └── Responsive grids

✅ Native Features
   ├── Camera integration
   ├── File upload
   ├── Geolocation
   └── Local storage
```

---

**Estado del Sistema:** ✅ COMPLETAMENTE FUNCIONAL
**Onboarding:** ✅ CORREGIDO - Redirige al dashboard
**Última actualización:** Abril 12, 2026
