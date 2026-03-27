# Configuración del Entorno de Desarrollo

Guía paso a paso para configurar tu entorno de desarrollo local para VCSA.

## Requisitos Previos

- **Node.js** v18+ y npm/yarn
- **Python** 3.9+
- **MongoDB** 4.4+ (local o Atlas)
- **Git**

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/your-repo/vcsa.git
cd vcsa
```

### 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

**Variables de Entorno Requeridas** (`.env`):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=vcsa
STRIPE_API_KEY=sk_test_...
JWT_SECRET=your-secret-key
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
```

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
yarn install
# o npm install

# Configurar variables de entorno
cp .env.example .env
```

**Variables de Entorno Requeridas** (`.env`):
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 4. Iniciar MongoDB

**Opción A: Local**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Opción B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 🚀 Ejecutar en Desarrollo

### Backend (FastAPI)

```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

El backend estará disponible en: `http://localhost:8000`

**Documentación API**: `http://localhost:8000/docs`

### Frontend (React)

```bash
cd frontend
yarn start
# o npm start
```

El frontend estará disponible en: `http://localhost:3000`

---

## 🐳 Docker (Alternativa)

Usa Docker Compose para ejecutar todo el stack:

```bash
docker-compose up -d
```

Esto inicia:
- Frontend (port 3000)
- Backend (port 8000)
- MongoDB (port 27017)

---

## 🧪 Probar la Instalación

### 1. Verificar Backend

```bash
curl http://localhost:8000/api/health
```

Debería retornar: `{"status": "ok"}`

### 2. Verificar Frontend

Navega a `http://localhost:3000` - deberías ver la landing page.

### 3. Probar Autenticación

**Registrar nuevo usuario**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

**Login**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  -c cookies.txt
```

---

## 🔧 Herramientas de Desarrollo

### Backend

```bash
# Linting
flake8 server.py phase1_routes.py

# Formateo
black server.py phase1_routes.py

# Type checking
mypy server.py phase1_routes.py

# Tests
pytest backend/tests/
```

### Frontend

```bash
# Linting
yarn lint
# o npm run lint

# Tests
yarn test
# o npm test

# Build para producción
yarn build
# o npm run build
```

---

## 📝 Estructura de Directorios

```
vcsa/
├── backend/
│   ├── server.py              # Main FastAPI app
│   ├── phase1_routes.py       # Phase 1 routes
│   ├── requirements.txt       # Python dependencies
│   └── tests/                 # Backend tests
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # React components
│   │   └── App.js            # Main app
│   ├── package.json          # Node dependencies
│   └── public/               # Static assets
├── wiki/                     # This documentation
├── docker-compose.yml        # Docker configuration
└── CLAUDE.md                 # Claude Code instructions
```

---

## 🐛 Solución de Problemas

### MongoDB no conecta

```bash
# Verificar si MongoDB está corriendo
ps aux | grep mongo

# Ver logs
tail -f /var/log/mongodb/mongod.log
```

### Puerto ya en uso

```bash
# Encontrar proceso usando puerto 8000
lsof -i :8000
# Matar proceso
kill -9 <PID>
```

### CORS errors

Verifica que `REACT_APP_BACKEND_URL` en frontend/.env coincida con la URL del backend.

---

## 📚 Recursos Adicionales

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
