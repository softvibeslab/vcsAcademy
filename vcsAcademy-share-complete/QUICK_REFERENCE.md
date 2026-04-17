# 🎯 VCSA MVP Preview - Quick Reference

## 🚀 Access URLs

| Page | URL | Auth Required |
|------|-----|---------------|
| Home | http://localhost | ❌ No |
| Courses | http://localhost/courses | ❌ No |
| Phase 1 | http://localhost/development | ❌ No |
| Admin | http://localhost/admin | ❌ No |
| API Docs | http://localhost:8001/docs | ❌ No |

## 👤 Test Users

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Demo | demo@vcsa.com | demo123 | General testing |
| Admin | admin@vcsa.com | admin123 | Admin panel |

## ✅ Quick Tests

### 1. Test Public Access
```bash
curl http://localhost:8001/api/public/courses | python3 -m json.tool | grep -A 2 "total"
```
**Expected**: `"total": 2`

### 2. Test Skool Track
```bash
curl "http://localhost:8001/api/development/tracks/track_skool_roadmap" | python3 -m json.tool | grep -A 5 "module_count"
```
**Expected**: `"module_count": 6`

### 3. Test Admin Panel
```bash
curl http://localhost:8001/api/ai-assistant/public/admin/team-stats | python3 -m json.tool
```
**Expected**: `{"success": true, ...}`

### 4. Test AI Chat
```bash
curl -X POST http://localhost:8001/api/ai-assistant/public/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","conversation_history":[]}'
```
**Expected**: Response from VCSA Coach

## 🔧 Troubleshooting

### Frontend Issues
```bash
docker logs vcsa-frontend --tail 50
docker-compose restart frontend
```

### Backend Issues
```bash
docker logs vcsa-backend --tail 50
docker-compose restart backend
```

### Database Issues
```bash
docker logs vcsa-mongodb --tail 50
docker-compose restart mongodb
```

## 📊 Validation Script

```bash
./deploy-preview.sh
```

**Expected**: 20/20 tests passed (100%)

---

**Generated**: $(date)  
**Full Report**: See `MVP_PREVIEW_REPORT.md`
