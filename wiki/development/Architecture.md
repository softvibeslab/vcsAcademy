# Arquitectura del Sistema

Visión general de la arquitectura técnica de VCSA.

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Pages          │  Components  │  Layout          │  │
│  │  - Landing      │  - UI (shadcn)│  - Dashboard    │  │
│  │  - Dashboard    │  - Forms      │  - Auth         │  │
│  │  - Training     │  - Video      │                 │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (FastAPI)                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Router: /api          │  Router: /api/development │  │
│  │  - Auth                │  - Stages                 │  │
│  │  - Users               │  - Tracks                 │  │
│  │  - Courses             │  - Modules                │  │
│  │  - Community           │  - Progress               │  │
│  │  - Events              │  - Badges                 │  │
│  │  - Resources           │  - Bookmarks              │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ Async Driver
                     ▼
┌─────────────────────────────────────────────────────────┐
│               Database (MongoDB)                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Collections:                                      │  │
│  │  - users              - user_progress              │  │
│  │  - user_activity      - bookmarks                 │  │
│  │  - posts              - events                     │  │
│  │  - resources          - courses (legacy)           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Capas de la Arquitectura

### 1. Capa de Presentación (Frontend)

**Tecnologías**:
- React 19 (UI framework)
- Tailwind CSS (styling)
- Framer Motion (animations)
- shadcn/ui (component library)
- React Router (routing)

**Responsabilidades**:
- Renderizar UI y componentes
- Manejar estado local (useState, useContext)
- Gestión de rutas
- Llamadas a API
- Autenticación client-side

**Archivos Clave**:
```
frontend/src/
├── App.js                    # Router principal + AuthContext
├── pages/                    # Páginas de la aplicación
│   ├── LandingPage.jsx
│   ├── DashboardPage.jsx
│   ├── TopProducerPath.jsx
│   └── ...
└── components/
    ├── layout/               # Layouts
    │   └── DashboardLayout.jsx
    └── ui/                   # shadcn/ui components
        ├── button.jsx
        ├── card.jsx
        └── ...
```

### 2. Capa de Aplicación (Backend)

**Tecnologías**:
- FastAPI (framework)
- Motor (MongoDB async driver)
- Pydantic (validación)
- Python-jose (JWT)

**Responsabilidades**:
- API REST endpoints
- Lógica de negocio
- Autenticación y autorización
- Validación de datos
- Integración con servicios externos (Stripe, Google OAuth)

**Archivos Clave**:
```
backend/
├── server.py                 # Main FastAPI app
│   ├── Authentication routes
│   ├── User routes
│   ├── Course routes (legacy)
│   ├── Community routes
│   ├── Events routes
│   └── Resources routes
└── phase1_routes.py          # Phase 1 Development System
    ├── Stages
    ├── Tracks
    ├── Modules
    ├── Progress
    ├── Badges
    ├── Bookmarks
    └── Deal Breakdowns
```

### 3. Capa de Datos (Database)

**Tecnologías**:
- MongoDB (NoSQL database)
- Motor (async driver)

**Responsabilidades**:
- Almacenamiento de datos
- Indexing
- Queries
- Agregaciones

**Colecciones**:
```javascript
users: {
  _id: ObjectId,
  email: String,
  password_hash: String,
  name: String,
  role: String, // admin, member
  membership_tier: String,
  created_at: DateTime
}

user_progress: {
  _id: ObjectId,
  user_id: ObjectId,
  current_stage: Number, // 1-4
  readiness_score: Number, // 0-100
  points: Number,
  training_streak: Number,
  completed_modules: [ObjectId],
  completed_breakdowns: [ObjectId],
  applied_quickwins: [ObjectId],
  badges_awarded: [String],
  last_training_date: DateTime
}

user_activity: {
  _id: ObjectId,
  user_id: ObjectId,
  action: String, // module_complete, breakdown_review, etc.
  content_id: ObjectId,
  content_type: String,
  timestamp: DateTime
}

bookmarks: {
  _id: ObjectId,
  user_id: ObjectId,
  content_id: ObjectId,
  content_type: String, // module, breakdown, quickwin
  tags: [String], // before_tour, closing_help, objections
  notes: String,
  created_at: DateTime
}

posts: {
  _id: ObjectId,
  author_id: ObjectId,
  content: String,
  likes: [ObjectId],
  comments: [...],
  created_at: DateTime
}

events: {
  _id: ObjectId,
  title: String,
  description: String,
  date: DateTime,
  location: String,
  registration_link: String
}

resources: {
  _id: ObjectId,
  title: String,
  description: String,
  file_url: String,
  category: String
}
```

---

## 🔄 Flujo de Datos

### 1. Autenticación

```
User → LoginForm → POST /api/auth/login
                  → Backend validates credentials
                  → Creates JWT token
                  → Sets httpOnly cookie
                  → Returns user data
                  → Frontend stores user in AuthContext
```

### 2. Completar Módulo

```
User → ModulePage → POST /api/development/modules/:id/complete
                  → Backend verifies auth
                  → Updates user_progress
                  → Adds to user_activity
                  → Awards badge if eligible
                  → Recalculates readiness_score
                  → Returns updated progress
                  → Frontend updates UI
```

### 3. Bookmark con Tags

```
User → BookmarkButton → POST /api/development/bookmarks
                      → Backend verifies auth
                      → Creates bookmark with tags
                      → Returns bookmark
                      → Frontend updates "Watch Later"
```

---

## 🔐 Seguridad

### Autenticación
- JWT tokens con httpOnly cookies
- Password hashing con bcrypt
- Google OAuth integration

### Autorización
- Role-based access control (admin, member)
- Protected routes con `require_auth` dependency
- User ownership verification

### Data Validation
- Pydantic models en backend
- PropTypes/TypeScript en frontend
- Input sanitization

---

## 📊 Escalabilidad

### Frontend
- Code splitting con React.lazy
- Image optimization
- Memoization con React.memo
- Virtual scrolling para listas largas

### Backend
- Async/await para I/O operations
- Connection pooling (Motor)
- Pagination en endpoints de listas
- Caching con Redis (futuro)

### Database
- Indexing en queries frecuentes
- Sharding potencial para gran escala
- Read replicas para analytics

---

## 🔍 Patrones de Diseño

### Frontend
- **Compound Components**: UI component library
- **Render Props**: AuthContext
- **Custom Hooks**: useAuth, useProgress
- **HOC**: ProtectedRoute wrapper

### Backend
- **Dependency Injection**: FastAPI dependencies
- **Repository Pattern**: Database operations
- **DTO Pattern**: Pydantic models
- **Middleware**: CORS, Auth

---

## 🧪 Testing Strategy

### Frontend Tests
```javascript
// Component tests
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click</Button>)
    expect(screen.getByText('Click')).toBeInTheDocument()
  })
})

// Integration tests
describe('Dashboard', () => {
  it('displays user progress', async () => {
    render(<DashboardPage />)
    await waitFor(() => {
      expect(screen.getByText('Readiness Score')).toBeInTheDocument()
    })
  })
})
```

### Backend Tests
```python
# API endpoint tests
def test_login_success(client):
    response = client.post("/api/auth/login", json={
        "email": "test@test.com",
        "password": "test123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

# Database tests
async def test_create_user():
    user = await User.create(email="test@test.com", ...)
    assert user.email == "test@test.com"
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              CDN (Static Assets)                 │
│  - React build (JS, CSS, images)                │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│           Load Balancer (Nginx)                  │
└─────┬───────────────────────────────┬───────────┘
      │                               │
┌─────▼───────┐              ┌────────▼────────┐
│  Frontend    │              │   Backend API   │
│  (Nginx)     │              │   (FastAPI)     │
│  Port 3000   │              │   Port 8000     │
└──────────────┘              └────────┬────────┘
                                       │
                              ┌────────▼────────┐
                              │   MongoDB       │
                              │   Port 27017    │
                              └─────────────────┘
```

---

## 📈 Monitoreo y Logging

### Frontend
- Error boundaries para React errors
- Console logging para debugging
- Analytics tracking (futuro: Google Analytics)

### Backend
- Uvicorn logging
- Request/response logging
- Error tracking (futuro: Sentry)
- Performance monitoring (futuro: Datadog)

---

## 🔗 Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Motor Documentation](https://motor.readthedocs.io/)
