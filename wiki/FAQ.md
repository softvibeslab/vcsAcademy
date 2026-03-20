# FAQ

Frequently asked questions about VCSA development, usage, and deployment.

## 📚 Table of Contents

- [General](#general)
- [Development](#development)
- [Authentication](#authentication)
- [Database](#database)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 General

### What is VCSA?

VCSA (Vacation Club Sales Academy) is a premium sales training platform for vacation club/timeshare sales professionals. It's designed as a "Sales Operating System" - a daily tool that reps use on the sales floor.

### What technology stack does VCSA use?

- **Frontend**: React 19 + Tailwind CSS + Framer Motion + shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (with Motor async driver)
- **Authentication**: JWT with httpOnly cookies + Google OAuth
- **Payments**: Stripe

### Is VCSA open source?

Yes! VCSA is open source and available on GitHub. Contributions are welcome.

---

## 🛠️ Development

### How do I set up the development environment?

See the [Setup Guide](getting-started/Setup.md) for detailed instructions. Quick start:

```bash
# Clone repository
git clone https://github.com/your-repo/vcsa.git
cd vcsa

# Start with Docker (recommended)
docker-compose up -d

# Or start manually
# Backend
cd backend && pip install -r requirements.txt
uvicorn server:app --reload

# Frontend
cd frontend && yarn install
yarn start
```

### How do I run tests?

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
yarn test:ci
```

### What's the component naming convention?

- **Components**: Named exports - `export const Button = () => {}`
- **Pages**: Default exports - `export default function PageName() {}`

### How do I add a new shadcn/ui component?

```bash
cd frontend
npx shadcn-ui@latest add [component-name]
```

Always check `src/components/ui/` before creating new components.

---

## 🔐 Authentication

### How does authentication work?

VCSA uses JWT tokens stored in httpOnly cookies:

1. User logs in via `/api/auth/login`
2. Backend validates credentials
3. Backend creates JWT token
4. Token set as httpOnly cookie (not accessible via JavaScript)
5. Subsequent requests include cookie automatically

### How do I add OAuth?

OAuth is already configured for Google. To add other providers:

1. Update `backend/server.py` with new OAuth endpoints
2. Add OAuth button in `frontend/src/pages/LoginPage.jsx`
3. Update environment variables with OAuth credentials

### How do I protect routes?

Use the `ProtectedRoute` wrapper:

```jsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

---

## 🗄️ Database

### How do I seed the database?

```bash
cd backend

# Seed coaching content
python seed_coaching.py

# Seed knowledge hub content
python seed_knowledge_hub.py
```

### How do I create database indexes?

```javascript
// Via MongoDB Shell/Compass
db.users.createIndex({ "email": 1 }, { unique: true })
db.user_progress.createIndex({ "user_id": 1 }, { unique: true })
db.posts.createIndex({ "created_at": -1 })
```

### How do I backup the database?

```bash
# Using mongodump
mongodump --uri="mongodb://user:pass@host:port/dbname" --archive=backup.gz

# Using Docker
docker-compose exec mongodb mongodump --archive=/data/backup.gz
```

---

## 🚀 Deployment

### How do I deploy to production?

See the [Production Deployment Guide](deployment/Production.md). Options include:

1. **Docker Compose** (simplest)
2. **Cloud platforms** (AWS, GCP, Azure)
3. **Traditional VPS** with Nginx

### What environment variables do I need?

**Backend** (`.env`):
```bash
MONGO_URL=mongodb://...
DB_NAME=vcsa
JWT_SECRET=your-secret-key
STRIPE_API_KEY=sk_test_...
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
SENTRY_DSN=... (optional)
```

**Frontend** (`.env`):
```bash
REACT_APP_BACKEND_URL=https://api.yourdomain.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### How do I set up SSL?

Use Let's Encrypt with Certbot:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔧 Troubleshooting

### Frontend won't connect to backend

**Solution**:
1. Check `REACT_APP_BACKEND_URL` in frontend `.env`
2. Verify backend is running: `curl http://localhost:8000/api/health`
3. Check CORS settings in backend

### MongoDB connection failed

**Solution**:
1. Verify `MONGO_URL` is correct
2. Check MongoDB is running: `docker ps | grep mongo`
3. Verify credentials
4. Check firewall rules

### Tests are failing

**Solution**:
1. Ensure all dependencies are installed
2. Check test database configuration
3. Run tests with verbose output: `pytest -v` or `yarn test --verbose`

### Docker containers won't start

**Solution**:
1. Check Docker is running: `docker ps`
2. View logs: `docker-compose logs`
3. Rebuild: `docker-compose up -d --build`

### High memory usage

**Solution**:
1. Limit container memory in `docker-compose.yml`
2. Add swap space
3. Check for memory leaks in application code

---

## 📞 Support

### Where can I get help?

- **Documentation**: This wiki
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/vcsa/issues)
- **Email**: support@vcsa.com
- **Community**: [Join our Discord](https://discord.gg/vcsa)

### How do I report a bug?

1. Check existing issues first
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots/error messages

### How do I request a feature?

1. Check existing feature requests
2. Create a new issue with:
   - Feature description
   - Use case/benefits
   - Possible implementation approach

---

## 📚 Additional Resources

- [Architecture Overview](development/Architecture.md)
- [API Documentation](api/Development.md)
- [Design System](design/DesignSystem.md)
- [Contributing Guide](development/Contributing.md)

---

**Last updated**: March 20, 2026
