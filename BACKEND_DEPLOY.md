# Backend Deployment Guide

## Quick Deploy Options

### Option 1: Render (Recommended - Free Tier)

**Steps:**
1. Create account at https://render.com
2. Fork this repository
3. Click "New +" → "Blueprint" in Render
4. Connect your GitHub repository
5. Render will detect `render.yaml` and deploy both services

**After Deployment:**
1. Get your MongoDB URL from Render dashboard
2. Set it as `MONGO_URL` in backend environment variables
3. Update frontend `.env.production` with your backend URL

**Backend URL format:** `https://vcsa-backend.onrender.com`

---

### Option 2: Railway

**Steps:**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy backend:
   ```bash
   railway add backend
   railway up
   ```
5. Add MongoDB: `railway add mongodb`
6. Set environment variables in Railway dashboard

**Backend URL format:** `https://vcsa-backend.up.railway.app`

---

### Option 3: Fly.io

**Steps:**
1. Install Flyctl: `curl -L https://fly.io/install.sh | sh`
2. Login: `flyctl auth signup`
3. Deploy:
   ```bash
   cd backend
   flyctl launch
   flyctl deploy
   ```
4. Add MongoDB via Fly.io dashboard

**Backend URL format:** `https://vcsa-backend.fly.dev`

---

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/vcsa` |
| `DB_NAME` | Database name | `vcsa` |
| `STRIPE_API_KEY` | Stripe secret key | `sk_test_...` |
| `SENTRY_DSN` | Sentry error tracking (optional) | `https://...` |

---

## Update Frontend After Deployment

After deploying the backend, update the frontend to use the new URL:

**Option A: Update `.env.production`**
```bash
cd frontend
echo "REACT_APP_BACKEND_URL=https://your-backend-url.com" > .env.production
```

**Option B: Set in Netlify**
1. Go to Netlify Dashboard → Site Settings
2. Environment Variables → Add Variable
3. Key: `REACT_APP_BACKEND_URL`
4. Value: `https://your-backend-url.com`
5. Trigger redeploy

**Option C: Update Netlify.toml**
```toml
[build.environment]
  REACT_APP_BACKEND_URL = "https://your-backend-url.com"
```

---

## Verify Deployment

```bash
# Health check
curl https://your-backend-url.com/api/health

# Check branding endpoint
curl https://your-backend-url.com/api/branding/config

# Check API docs
open https://your-backend-url.com/docs
```

---

## Troubleshooting

**Backend returning 502/503:**
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure environment variables are set

**CORS errors in frontend:**
- Update backend CORS settings in `server.py`
- Add your Netlify domain to allowed origins

**MongoDB connection failed:**
- Verify IP whitelist (MongoDB Atlas)
- Check connection string format
- Ensure database user has correct permissions
