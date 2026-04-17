# Frontend Development

Guía completa de desarrollo frontend para VCSA.

## 🎨 Stack Tecnológico

- **React 19** - UI Framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - Component library (Radix UI + Tailwind)
- **React Router v6** - Client-side routing
- **Axios** - HTTP client

---

## 📁 Estructura de Directorios

```
frontend/src/
├── App.js                          # Main app + Router + AuthContext
├── index.js                        # Entry point
├── index.css                       # Global styles
├── pages/                          # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── TopProducerPath.jsx         # Phase 1: Stage dashboard
│   ├── TrackDetailPage.jsx         # Track modules + video player
│   ├── DealBreakdownsPage.jsx
│   ├── QuickWinsPage.jsx
│   ├── CoursesPage.jsx
│   ├── CommunityPage.jsx
│   ├── EventsPage.jsx
│   ├── ResourcesPage.jsx
│   ├── MembershipPage.jsx
│   ├── ProfilePage.jsx
│   └── AdminPage.jsx
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.jsx     # Dashboard wrapper
│   │   └── Navigation.jsx          # Sidebar nav
│   └── ui/                         # shadcn/ui components
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── dialog.jsx
│       └── ...
└── services/
    ├── api.js                      # API client
    └── auth.js                     # Auth utilities
```

---

## 🎯 Convenciones de Código

### Componentes

**Named Exports** para componentes reutilizables:
```jsx
// ✅ CORRECTO
export const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="btn-primary">
      {children}
    </button>
  )
}
```

**Default Exports** para páginas:
```jsx
// ✅ CORRECTO
export default function DashboardPage() {
  return <div>Dashboard</div>
}
```

### Estructura de Componente

```jsx
// 1. Imports
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'

// 2. Component
export default function MyPage() {
  // 3. Hooks
  const [data, setData] = useState(null)
  const { user } = useAuth()

  // 4. Effects
  useEffect(() => {
    fetchData()
  }, [])

  // 5. Handlers
  const handleClick = () => {
    // ...
  }

  // 6. Render
  return (
    <div>
      <Button onClick={handleClick}>Click</Button>
    </div>
  )
}
```

---

## 🎨 Sistema de Diseño

### Colores

```jsx
// Tailwind config colors
const colors = {
  background: '#020204',      // Fondo principal
  card: '#0A0A0B',            // Fondo de tarjetas
  primary: '#D4AF37',         // Gold (acciones de alto valor)
  secondary: '#1E3A8A',       // Navy
  accent: '#F59E0B',          // Orange accent
  text_main: '#F8FAFC',       // Texto principal
  text_muted: '#94A3B8',      // Texto secundario
  border: 'rgba(255,255,255,0.08)' // Bordes sutiles
}
```

### Tipografía

```jsx
// Importar fuentes en index.html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono&display=swap" rel="stylesheet">

// Tailwind classes
<h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
  {/* Playfair Display */}
</h1>

<p className="text-lg leading-relaxed text-muted-foreground">
  {/* DM Sans */}
</p>

<span className="font-mono text-sm">
  {/* JetBrains Mono - para datos, stats */}
</span>
```

### Componentes UI (shadcn/ui)

**Uso de componentes pre-existentes**:
```jsx
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'

// Siempre revisar src/components/ui/ antes de crear nuevos componentes
```

**Estilos de tarjetas**:
```jsx
// Tarjeta estándar
<div className="bg-card/50 backdrop-blur-md border border-white/5 p-6 hover:border-primary/30 transition-all">
  {/* Contenido */}
</div>

// Feature card
<div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8">
  {/* Contenido */}
</div>
```

---

## 🔄 Estado y Contexto

### AuthContext

```jsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, loading, login, logout } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protected Routes

```jsx
import { ProtectedRoute } from '../components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
```

---

## 🎬 Animaciones (Framer Motion)

```jsx
import { motion } from 'framer-motion'

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide up
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2 }}
>
  Content
</motion.div>

// Hover effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

---

## 🌐 API Integration

### API Client

```jsx
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
  withCredentials: true // httpOnly cookies
})

export default api
```

### Ejemplo de uso

```jsx
import api from '../services/api'

function TrackDetailPage() {
  const [track, setTrack] = useState(null)

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await api.get(`/api/development/tracks/${trackId}`)
        setTrack(response.data)
      } catch (error) {
        console.error('Error fetching track:', error)
      }
    }
    fetchTrack()
  }, [trackId])

  if (!track) return <div>Loading...</div>

  return (
    <div>
      <h1>{track.title}</h1>
      {/* ... */}
    </div>
  )
}
```

---

## 🎯 Páginas Principales

### DashboardPage.jsx

```jsx
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1>Welcome back, {user?.name}</h1>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Readiness Score */}
        <Card className="md:col-span-2">
          <ReadinessScore />
        </Card>

        {/* Current Stage */}
        <Card>
          <CurrentStage />
        </Card>

        {/* Continue Learning */}
        <Card className="md:col-span-2">
          <ContinueLearning />
        </Card>

        {/* Training Streak */}
        <Card>
          <TrainingStreak />
        </Card>
      </div>
    </DashboardLayout>
  )
}
```

### TopProducerPath.jsx (Phase 1)

```jsx
export default function TopProducerPath() {
  const [stages, setStages] = useState([])
  const [currentStage, setCurrentStage] = useState(1)

  useEffect(() => {
    fetchStages()
    fetchProgress()
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Progress Overview */}
        <div className="mb-12">
          <h1>Top Producer Development Path</h1>
          <ReadinessScore />
        </div>

        {/* 4 Stages */}
        <div className="space-y-8">
          {stages.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              isActive={stage.id === currentStage}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
```

### TrackDetailPage.jsx

```jsx
export default function TrackDetailPage() {
  const [track, setTrack] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="lg:col-span-1">
          <ModuleList
            modules={track?.modules}
            selectedModule={selectedModule}
            onSelectModule={setSelectedModule}
          />
        </div>

        {/* Video Player + Content */}
        <div className="lg:col-span-2">
          {selectedModule && (
            <>
              <VideoPlayer url={selectedModule.video_url} />
              <ModuleContent module={selectedModule} />
              <CompleteButton moduleId={selectedModule.id} />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
```

---

## 🎨 Patrones de UI

### Cards con borde sutil

```jsx
<div className="bg-card/50 backdrop-blur-md border border-white/5 p-6 hover:border-primary/30 transition-all">
  {/* Siempre usar border blanco con baja opacidad */}
</div>
```

### Espaciado generoso

```jsx
<div className="space-y-12">
  {/* Usar 2-3x más espacio del que parece necesario */}
</div>

<div className="p-8 md:p-12">
  {/* Padding amplio para look premium */}
</div>
```

### Grid layouts (no centrar)

```jsx
{/* ✅ CORRECTO - Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-2">Card grande</div>
  <div>Card pequeña</div>
</div>

{/* ❌ EVITAR - Layout centrado genérico */}
<div className="flex justify-center items-center">
  <div>Card</div>
</div>
```

---

## 🔥 Hot Tips

1. **Usar shadcn/ui components**: Siempre revisar `src/components/ui/` antes de crear componentes nuevos
2. **Named exports para components**: `export const Button = ...`
3. **Default exports para pages**: `export default function PageName() {...}`
4. **Nunca usar puro blanco**: Usar `#F8FAFC` o `#F1F5F9` en lugar de `#FFFFFF`
5. **Gold solo para alto valor**: Usar `#D4AF37` solo para acciones importantes
6. **Bordes sutiles**: Siempre `border-white/5` o `border-white/10`
7. **Espaciado generoso**: Usar 2-3x más espacio del que parece necesario
8. **Micro-animaciones**: Cada interacción necesita hover/transition effects
9. **No centrar todo**: Usar layouts asimétricos y bento grids
10. **Background dark**: Fondo principal siempre `#020204`

---

## 🧪 Testing

```jsx
// Example test
import { render, screen } from '@testing-library/react'
import DashboardPage from '../pages/DashboardPage'

describe('DashboardPage', () => {
  it('renders user name', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })
})
```

---

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
