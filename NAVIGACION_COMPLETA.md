# 📚 TABLA COMPLETA DE MÓDULOS Y NAVEGACIÓN

## 🌐 **URL BASE**
- **Local:** http://localhost:1234
- **Backend API:** http://localhost:2345

---

## 👥 **FLUJO DE AUTENTICACIÓN**

```
1. Landing Page → /landing
2. Login → /login
3. Register → /register
4. Auth Callback (OAuth) → /auth/callback
5. Onboarding → /get-started (Step 0-5)
6. Dashboard → /dashboard
```

---

## 📊 **ESTRUCTURA JERÁRQUICA DE NAVEGACIÓN**

### 🎯 **1. STRATEGY**
- **Dashboard Principal** → `/dashboard`
  - Vista general de métricas y progreso

- **Daily Performance** → `/daily-performance`
  - Grid de ventas de 25 días
  - Tracker de 7 atributos personales
  - Combo diario (100 puntos bonus)
  - Métricas financieras resumen
  - 6 tabs: Overview, Sales Grid, Attributes, Metrics, Challenges, Goals

- **Goal Sheets** → `/goals`
  - Planificación de objetivos SMART
  - 5 categorías de metas
  - 4 timeframes (diario, semanal, mensual, trimestral)
  - Acciones prioritarias
  - Compromisos con tracking de streaks

- **Financial Planner** → `/financial`
  - Planificación financiera
  - Proyecciones de ingresos
  - Análisis de comisiones

- **Analytics** → `/analytics`
  - **Tab 1: Efficiency** → Dashboard de eficiencia (0-100)
  - **Tab 2: Predictions** → Insights predictivos con IA
  - **Tab 3: Monthly Report** → Reportes mensuales automatizados

---

## 🎓 **2. TOP PRODUCER PATH**

### **Dashboard Principal** → `/top-producer`
- **Stage 1: New Rep** (150 pts, 1-2 semanas)
- **Stage 2: Developing Rep** (300 pts, 2-4 semanas)
- **Stage 3: Performing Rep** (500 pts, 4-8 semanas)
- **Stage 4: Top Producer** (750 pts, 8-12 semanas)

### **6 Tracks de Entrenamiento**

| Track | Módulos | Path |
|-------|---------|------|
| **1. Pro Mindset** | 6 módulos | `/track/pro-mindset` |
| **2. Discovery & Control** | 6 módulos | `/track/discovery-control` |
| **3. Value Architecture** | 6 módulos | `/track/value-architecture` |
| **4. Decision Management** | 6 módulos | `/track/decision-management` |
| **5. Objection Mastery** | 6 módulos | `/track/objection-mastery` |
| **6. Post-Decision Integrity** | 6 módulos | `/track/post-decision` |

**Total: 36 módulos (6 por track)**

### **Detalle de Track** → `/track/{track-slug}`
- Video del módulo
- "Key Move" (takeaway accionable)
- Progreso del módulo
- Botón "Mark as Complete"

### **Deal Breakdowns** → `/deal-breakdowns`
- 15 escenarios de deals reales
- Análisis paso a paso
- Lecciones aprendidas

### **Quick Wins** → `/quick-wins`
- 20 tácticas rápidas
- Aplicables inmediatamente
- Tags para búsqueda (Pre-Tour, Closing, Objections, etc.)

---

## 🎥 **3. COACHING**

### **Coaching Page** → `/coaching`
- Biblioteca de contenido coaching
- Videos tácticos de ventas

### **Group Coaching** → `/group-coaching`
- Sesiones en vivo grupales
- Calendario de sesiones

### **Role Play Sessions** → `/role-play`
- Práctica de escenarios
- Simulaciones de ventas

### **Q&A Sessions** → `/qa-sessions`
- Preguntas y respuestas
- Formulario para enviar preguntas

### **Masterclasses** → `/masterclasses`
- Biblioteca de masterclasses
- Contenido avanzado

---

## 📚 **4. ADDITIONAL LEARNING**

### **Courses** → `/courses`
- Biblioteca de cursos legados
- Categorías temáticas

### **Course Detail** → `/courses/{courseId}`
- Detalle del curso
- Lecciones y módulos

### **Resources** → `/resources`
- Descargas PDF
- Plantillas y herramientas
- Materiales de apoyo

---

## 👥 **5. COMMUNITY**

### **Community Feed** → `/community`
- Posts de la comunidad
- Comentarios y likes
- Compartir logros

### **Events Calendar** → `/events`
- Calendario de eventos
- Registro a eventos
- Recordatorios

---

## ⚙️ **6. SETTINGS**

### **Profile** → `/profile`
- Información personal
- Cambio de contraseña
- Preferencias

### **Membership** → `/membership`
- Planes de suscripción
- Upgrade/Downgrade
- Información de pago

### **Admin Panel** → `/admin` (Solo admin)
- Gestión de usuarios
- Configuración del sistema
- Analytics de equipo

---

## 🔐 **PÁGINAS DE AUTENTICACIÓN**

| Página | Path | Descripción |
|--------|------|-------------|
| Landing | `/landing` | Página de aterrizaje pública |
| Login | `/login` | Inicio de sesión |
| Register | `/register` | Registro de nuevos usuarios |
| Auth Callback | `/auth/callback` | Callback OAuth (Google) |
| Onboarding | `/get-started` | Wizard de onboarding (6 pasos) |

---

## 📝 **ONBOARDING WIZARD**

### **6 Pasos de Onboarding** → `/get-started`

| Step | Título | Descripción |
|------|--------|-------------|
| **Step 0** | Welcome | Tipo de organización |
| **Step 1** | Branding | Logo, colores, fuentes |
| **Step 2** | Content | Tracks, módulos, industria |
| **Step 3** | Settings | Gamificación, comunidad, features |
| **Step 4** | Team | Invitaciones a miembros |
| **Step 5** | Launch | Completar y lanzar |

**Estado:** ✅ Corregido - Ahora redirige al dashboard después de completar

---

## 🎮 **SISTEMA DE GAMIFICACIÓN**

### **Badges (14 badges)**
- **7 de Atributos:** Commitment, Preparation, Energy, Attitude, Resilience, Adaptability, Professionalism
- **3 de Streaks:** 3-day, 7-day, 30-day streaks
- **4 de Logros:** First Sale, Week Warrior, Monthly Master, Top Performer

### **Leaderboards**
- **Daily:** Top ventas del día
- **Weekly:** Top de la semana
- **Monthly:** Top del mes
- **Attributes:** Ranking por atributos

### **Puntos**
- 10 puntos por módulo completado
- 5 puntos por deal breakdown
- 3 puntos por quick win
- 100 puntos bonus por combo diario de 7 atributos

---

## 📈 **READINESS SCORE**

```
Readiness Score =
  (Video Completion × 40%) +
  (Track Progress × 30%) +
  (Quick Wins Applied × 10%) +
  (Breakdowns Reviewed × 10%) +
  (Training Streak × 10%)
```

---

## 🔑 **USUARIOS DEMO**

| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| Admin | admin@vcsa.com | admin123 | admin |
| Demo | demo@vcsa.com | demo123 | member |

---

## 🚀 **FLUJO COMPLETO DE USUARIO**

```
1. Registro → /register
2. Email/Password login → /login
   ↓
3. Onboarding Wizard (6 pasos) → /get-started
   ↓
4. Dashboard Principal → /dashboard
   ↓
5. Elegir ruta:
   - Strategy → Planificación diaria/semanal
   - Top Producer Path → Entrenamiento sistemático
   - Coaching → Sesiones grupales y role play
   - Additional Learning → Cursos y recursos
   - Community → Feed y eventos
   - Settings → Perfil y membership
```

---

## 📱 **MÓVIL PWA**

- **PWA Ready:** Instalable en móviles
- **Service Worker:** Offline capability
- **Manifest:** Iconos y splash screens configurados
- **Install Prompt:** Prompt de instalación nativo

---

## 🎨 **DESIGN SYSTEM**

- **Background:** `#020204`
- **Gold Accent:** `#D4AF37`
- **Navy:** `#1E3A8A`
- **Text Primary:** `#F1F5F9`
- **Text Secondary:** `#94A3B8`
- **Font Headings:** Playfair Display
- **Font Body:** DM Sans
- **Font Mono:** JetBrains Mono

---

## 📊 **ESTADÍSTICAS DEL SISTEMA**

- **36 módulos** de entrenamiento
- **15 deal breakdowns**
- **20 quick wins**
- **6 tracks** de entrenamiento
- **4 stages** de progresión
- **14 badges** coleccionables
- **4 leaderboards** competitivos
- **5 fases** de gamificación completa

---

**Última actualización:** Abril 12, 2026
**Versión:** 1.0.0
**Status:** ✅ Sistema completo y funcional
