# 🚀 Quick Deployment Guide

## 📋 **Deployment Options**

This guide covers different deployment options for the Health & Fitness AI Assistant.

**For detailed GitHub deployment, see:** `GITHUB_DEPLOYMENT.md`

## 📋 Pre-Deployment Checklist

- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] Supabase database populated
- [ ] API keys secured
- [ ] CORS configured
- [ ] Environment variables ready

## 🔧 Backend Deployment

### Option 1: Render (Recommended)

**Why Render?**
- Free tier available
- Easy Python deployment
- Automatic HTTPS
- Environment variable management

**Steps:**

1. **Prepare your repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Create Render account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

4. **Configure service**
   - **Name**: `health-fitness-ai`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

5. **Add environment variables**
   - Click "Environment" tab
   - Add:
     - `DEEPSEEK_API_KEY`: Your DeepSeek key
     - `SUPABASE_URL`: Your Supabase URL
     - `SUPABASE_KEY`: Your Supabase key

6. **Add gunicorn to requirements.txt**
   ```bash
   echo "gunicorn==21.2.0" >> backend/requirements.txt
   ```

7. **Update app.py for production**
   Replace the last line:
   ```python
   if __name__ == '__main__':
       app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
   ```

8. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your service URL: `https://health-fitness-ai.onrender.com`

### Option 2: Railway

**Steps:**

1. **Create Railway account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Python
   - Add environment variables in "Variables" tab
   - Set root directory to `backend`

4. **Deploy**
   - Automatic deployment starts
   - Get your URL from "Settings" → "Domains"

### Option 3: Heroku

**Steps:**

1. **Install Heroku CLI**
   ```bash
   # Download from heroku.com/cli
   ```

2. **Create Procfile**
   ```bash
   echo "web: gunicorn app:app" > backend/Procfile
   ```

3. **Deploy**
   ```bash
   cd backend
   heroku login
   heroku create health-fitness-ai
   heroku config:set DEEPSEEK_API_KEY=your_key
   heroku config:set SUPABASE_URL=your_url
   heroku config:set SUPABASE_KEY=your_key
   git push heroku main
   ```

## 🌐 Frontend Deployment

### Option 1: Netlify (Recommended)

**Why Netlify?**
- Free tier with generous limits
- Automatic HTTPS
- CDN distribution
- Easy drag-and-drop deployment

**Steps:**

1. **Update API URL**
   Edit `frontend/script.js`:
   ```javascript
   const API_URL = 'https://your-backend-url.onrender.com';
   ```

2. **Deploy via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag `frontend` folder to deploy area
   - Wait for deployment
   - Get URL: `https://your-site.netlify.app`

3. **Deploy via GitHub (Continuous Deployment)**
   - Click "New site from Git"
   - Connect GitHub
   - Select repository
   - Build settings:
     - **Base directory**: `frontend`
     - **Build command**: (leave empty)
     - **Publish directory**: `.`
   - Deploy

4. **Custom domain (optional)**
   - Go to "Domain settings"
   - Add custom domain
   - Update DNS records

### Option 2: GitHub Pages

**Steps:**

1. **Update API URL** in `script.js`

2. **Create gh-pages branch**
   ```bash
   git checkout -b gh-pages
   git add frontend/*
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **Enable GitHub Pages**
   - Go to repository settings
   - Scroll to "Pages"
   - Source: `gh-pages` branch
   - Folder: `/frontend`
   - Save

4. **Access site**
   - URL: `https://yourusername.github.io/repository-name/`

### Option 3: Vercel

**Steps:**

1. **Update API URL** in `script.js`

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts**
   - Login with GitHub
   - Configure project
   - Deploy

## 🔒 Production Security

### 1. Environment Variables

**Never commit sensitive data!**

```bash
# .env should be in .gitignore
echo ".env" >> .gitignore
```

### 2. CORS Configuration

Update `backend/app.py`:

```python
from flask_cors import CORS

# Development
# CORS(app)

# Production - restrict to your frontend domain
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://your-site.netlify.app",
            "https://yourdomain.com"
        ]
    }
})
```

### 3. Rate Limiting

Add to `backend/requirements.txt`:
```
Flask-Limiter==3.5.0
```

Update `backend/app.py`:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/chat', methods=['POST'])
@limiter.limit("20 per minute")
def chat():
    # ... existing code
```

### 4. API Key Rotation

- Rotate DeepSeek API key monthly
- Use separate keys for dev/prod
- Monitor usage in DeepSeek dashboard

### 5. HTTPS Only

Both Render and Netlify provide automatic HTTPS. Ensure:
- All API calls use HTTPS
- No mixed content warnings
- HSTS headers enabled

## 📊 Monitoring & Logging

### Backend Monitoring

**Render:**
- View logs in dashboard
- Set up log drains
- Monitor resource usage

**Add logging to app.py:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    logger.info(f"Chat request from {request.remote_addr}")
    # ... existing code
```

### Frontend Monitoring

Add error tracking:
```javascript
// In script.js
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to monitoring service (e.g., Sentry)
});
```

## 🧪 Testing Production

### 1. Backend Health Check

```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Health & Fitness AI Assistant is running"
}
```

### 2. Test Chat Endpoint

```bash
curl -X POST https://your-backend-url.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the benefits of exercise?"}'
```

### 3. Frontend Testing

- Open browser console
- Check for errors
- Test voice input/output
- Verify API calls succeed
- Test on mobile devices

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        run: |
          npm install -g netlify-cli
          netlify deploy --prod --dir=frontend
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🐛 Common Deployment Issues

### Backend Issues

**"Application Error" on Render:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure requirements.txt is complete
- Check Python version compatibility

**CORS errors:**
- Update CORS configuration
- Verify frontend URL is whitelisted
- Check browser console for details

**Timeout errors:**
- Increase timeout in Render settings
- Optimize DeepSeek API calls
- Add caching for embeddings

### Frontend Issues

**API connection failed:**
- Verify backend URL in script.js
- Check backend is running
- Ensure HTTPS is used

**Voice not working:**
- HTTPS is required for microphone access
- Check browser permissions
- Test on supported browsers

## 📈 Scaling Considerations

### Backend Scaling

**Render:**
- Upgrade to paid plan for more resources
- Enable auto-scaling
- Use Redis for caching

**Optimization:**
- Cache embeddings
- Implement request queuing
- Use connection pooling for Supabase

### Database Scaling

**Supabase:**
- Upgrade to Pro plan for more storage
- Optimize vector indexes
- Archive old data

## 💰 Cost Estimation

### Free Tier Limits

**Render:**
- 750 hours/month free
- Sleeps after 15 min inactivity
- Wakes on request (cold start)

**Netlify:**
- 100 GB bandwidth/month
- Unlimited sites
- Automatic HTTPS

**Supabase:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth

**DeepSeek:**
- Pay per token
- ~$0.14 per 1M tokens
- Monitor usage in dashboard

### Estimated Monthly Costs

**Low usage (100 users/day):**
- Backend: Free (Render)
- Frontend: Free (Netlify)
- Database: Free (Supabase)
- API: ~$5-10 (DeepSeek)
- **Total: $5-10/month**

**Medium usage (1000 users/day):**
- Backend: $7 (Render Starter)
- Frontend: Free (Netlify)
- Database: $25 (Supabase Pro)
- API: ~$50-100 (DeepSeek)
- **Total: $82-132/month**

## 🎉 Post-Deployment

### 1. Update Documentation

- Add production URLs to README
- Document deployment process
- Create runbook for common issues

### 2. Set Up Monitoring

- Configure uptime monitoring (e.g., UptimeRobot)
- Set up error alerts
- Monitor API usage

### 3. Gather Feedback

- Add analytics (Google Analytics, Plausible)
- Monitor user interactions
- Collect feedback for improvements

### 4. Maintenance

- Regular security updates
- Monitor API costs
- Backup database regularly
- Review and update content

---

**🎊 Congratulations! Your Health & Fitness AI Assistant is now live!**

For support, check the main README.md or create an issue on GitHub.
