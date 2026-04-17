# ⚡ VCSA Quick Deploy

Deploy VCSA in under 5 minutes.

## 🚀 One-Command Deploy

```bash
# From project root
./deploy.sh deploy
```

That's it! The script will:
1. ✅ Check environment files
2. ✅ Build Docker images
3. ✅ Start all services
4. ✅ Verify health

## 📍 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost | admin@vcsa.com / admin123 |
| Backend API | http://localhost:8000/api | - |
| API Docs | http://localhost:8000/docs | - |
| MongoDB | mongodb://localhost:27017 | admin / changeme |

## 🛠️ Common Commands

```bash
# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Check health
./deploy.sh health

# View logs
./deploy.sh logs

# Backup database
./deploy.sh backup
```

## 📝 First Time Setup

### 1. Create Admin User

```bash
# Register via API
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@vcsa.com", "password": "admin123", "name": "Admin User"}'
```

### 2. Seed Database (Optional)

```bash
# Seed coaching sessions
docker-compose exec backend python seed_coaching.py

# Seed knowledge hub
docker-compose exec backend python seed_knowledge_hub.py
```

### 3. Access Frontend

Open browser → http://localhost

Login with: admin@vcsa.com / admin123

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Check what's using port 80/8000
netstat -tuln | grep -E ':(80|8000)'

# Stop conflicting services
sudo systemctl stop nginx  # if nginx is running
```

**Services not starting?**
```bash
# View logs
./deploy.sh logs

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

**Database connection issues?**
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Restart MongoDB
docker-compose restart mongodb
```

## 📚 Full Documentation

See [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) for detailed deployment instructions.

---

**Status:** ✅ Ready to deploy

**Time:** ~5 minutes
