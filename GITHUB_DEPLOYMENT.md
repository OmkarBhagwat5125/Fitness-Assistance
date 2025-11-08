# 🚀 Deploy Fitness AI Assistant with GitHub

## 📋 **Complete Deployment Guide**

This guide will help you deploy your Fitness AI Assistant using GitHub and GitHub Pages.

---

## 🎯 **What You'll Deploy**

- ✅ **Frontend**: HTML, CSS, JavaScript (on GitHub Pages)
- ⚠️ **Backend**: Python Flask API (needs separate hosting)

**Note**: GitHub Pages only hosts static files (frontend). Backend needs a service like Render, Railway, or Heroku.

---

## 📦 **Part 1: Setup GitHub Repository**

### **Step 1: Create GitHub Account**

If you don't have one:
1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Enter email, password, username
4. Verify email
5. Complete setup

---

### **Step 2: Install Git on Your Computer**

**Download Git:**
1. Go to [git-scm.com](https://git-scm.com/downloads)
2. Download for Windows
3. Run installer
4. Click "Next" for all options (default settings are fine)
5. Finish installation

**Verify Installation:**
```powershell
git --version
```
Should show: `git version 2.x.x`

---

### **Step 3: Configure Git**

Open PowerShell and run:

```powershell
# Set your name
git config --global user.name "Your Name"

# Set your email (use GitHub email)
git config --global user.email "your-email@example.com"

# Verify
git config --list
```

---

### **Step 4: Create New Repository on GitHub**

1. **Go to GitHub** and login
2. **Click** the **"+"** icon (top-right)
3. **Select** "New repository"

**Repository Settings:**
- **Repository name**: `fitness-ai-assistant` (or any name you like)
- **Description**: "AI-powered fitness assistant with voice support"
- **Visibility**: 
  - ✅ **Public** (required for free GitHub Pages)
  - Or **Private** (if you have GitHub Pro)
- **Initialize**:
  - ❌ Don't check "Add a README file"
  - ❌ Don't add .gitignore
  - ❌ Don't choose a license
- **Click** "Create repository"

---

### **Step 5: Initialize Local Git Repository**

Open PowerShell in your project folder:

```powershell
# Navigate to your project
cd "c:\Users\omkar\Desktop\fitness assistance"

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Fitness AI Assistant"
```

---

### **Step 6: Connect to GitHub**

**Copy the commands from GitHub** (shown after creating repo), or use these:

```powershell
# Add remote repository (replace YOUR-USERNAME and REPO-NAME)
git remote add origin https://github.com/YOUR-USERNAME/fitness-ai-assistant.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**If asked for credentials:**
- Username: Your GitHub username
- Password: Use **Personal Access Token** (not your password)

---

### **Step 7: Create Personal Access Token (if needed)**

If GitHub asks for password:

1. **Go to GitHub** → Settings → Developer settings
2. **Click** "Personal access tokens" → "Tokens (classic)"
3. **Click** "Generate new token" → "Generate new token (classic)"
4. **Name**: "Fitness AI Deploy"
5. **Expiration**: 90 days (or custom)
6. **Scopes**: Check ✅ **repo** (all repo permissions)
7. **Click** "Generate token"
8. **Copy token** (save it somewhere - you won't see it again!)
9. **Use token as password** when pushing to GitHub

---

## 🌐 **Part 2: Deploy Frontend with GitHub Pages**

### **Step 1: Prepare Frontend Files**

Make sure your frontend files are in the root or a `docs` folder:

**Option A: Root Directory (Recommended)**
```
fitness-ai-assistant/
├── index.html          ← Move from frontend/
├── style.css           ← Move from frontend/
├── script.js           ← Move from frontend/
├── backend/
│   ├── app.py
│   └── ...
└── README.md
```

**Move files to root:**
```powershell
# Move frontend files to root
Move-Item "frontend\index.html" "index.html"
Move-Item "frontend\style.css" "style.css"
Move-Item "frontend\script.js" "script.js"

# Commit changes
git add .
git commit -m "Move frontend files to root for GitHub Pages"
git push
```

---

### **Step 2: Enable GitHub Pages**

1. **Go to your repository** on GitHub
2. **Click** "Settings" tab
3. **Scroll down** to "Pages" (in left sidebar)
4. **Under "Source"**:
   - Branch: Select **main**
   - Folder: Select **/ (root)**
5. **Click** "Save"
6. **Wait 1-2 minutes**
7. **Refresh page** - you'll see:
   ```
   Your site is live at https://YOUR-USERNAME.github.io/fitness-ai-assistant/
   ```

---

### **Step 3: Update API URL in Frontend**

Your frontend needs to connect to the backend API.

**Edit `script.js`:**

```javascript
// Change this line:
const API_URL = 'http://localhost:5000';

// To your deployed backend URL (we'll set this up next):
const API_URL = 'https://your-backend-app.onrender.com';
```

**Commit and push:**
```powershell
git add script.js
git commit -m "Update API URL for production"
git push
```

---

## 🖥️ **Part 3: Deploy Backend (Flask API)**

GitHub Pages can't run Python backend. Use one of these services:

---

### **Option A: Deploy Backend on Render (Recommended - Free)**

#### **Step 1: Create Render Account**
1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub (easiest)
4. Authorize Render

#### **Step 2: Prepare Backend for Deployment**

**Create `requirements.txt`** (if not exists):
```powershell
cd backend
pip freeze > requirements.txt
```

**Create `render.yaml`** in project root:
```yaml
services:
  - type: web
    name: fitness-ai-backend
    env: python
    buildCommand: "pip install -r backend/requirements.txt"
    startCommand: "cd backend && python app.py"
    envVars:
      - key: DEEPSEEK_API_KEY
        sync: false
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
```

**Update `backend/app.py`** - change last line:
```python
if __name__ == '__main__':
    # ... existing code ...
    
    # Change this:
    app.run(debug=True, host='0.0.0.0', port=5000)
    
    # To this (for production):
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
```

**Commit changes:**
```powershell
git add .
git commit -m "Prepare backend for Render deployment"
git push
```

#### **Step 3: Deploy on Render**

1. **Go to Render Dashboard**
2. **Click** "New +" → "Web Service"
3. **Connect** your GitHub repository
4. **Configure**:
   - Name: `fitness-ai-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn app:app`
   - Instance Type: `Free`
5. **Add Environment Variables**:
   - Click "Advanced"
   - Add:
     - `DEEPSEEK_API_KEY`: (your API key)
     - `SUPABASE_URL`: (your Supabase URL)
     - `SUPABASE_KEY`: (your Supabase key)
6. **Click** "Create Web Service"
7. **Wait** 5-10 minutes for deployment
8. **Copy** the URL (e.g., `https://fitness-ai-backend.onrender.com`)

#### **Step 4: Update Frontend with Backend URL**

**Edit `script.js`:**
```javascript
const API_URL = 'https://fitness-ai-backend.onrender.com';
```

**Commit and push:**
```powershell
git add script.js
git commit -m "Update API URL to Render backend"
git push
```

**Wait 1-2 minutes** for GitHub Pages to update.

---

### **Option B: Deploy Backend on Railway (Alternative - Free)**

#### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

#### **Step 2: Deploy**
1. **Click** "New Project"
2. **Select** "Deploy from GitHub repo"
3. **Choose** your repository
4. **Railway auto-detects** Python
5. **Add Environment Variables**:
   - `DEEPSEEK_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
6. **Click** "Deploy"
7. **Copy** the generated URL

#### **Step 3: Update Frontend**
Same as Render - update `API_URL` in `script.js`

---

### **Option C: Deploy Backend on Heroku (Paid)**

Heroku no longer has free tier, but if you want to use it:

1. Create Heroku account
2. Install Heroku CLI
3. Create `Procfile`:
   ```
   web: cd backend && gunicorn app:app
   ```
4. Deploy:
   ```powershell
   heroku login
   heroku create fitness-ai-backend
   git push heroku main
   ```

---

## 🔧 **Part 4: Configure CORS for Production**

Update `backend/app.py` to allow your GitHub Pages domain:

```python
from flask_cors import CORS

# Change this:
CORS(app)

# To this:
CORS(app, origins=[
    "https://YOUR-USERNAME.github.io",
    "http://localhost:3000",  # For local testing
])
```

**Commit and push:**
```powershell
git add backend/app.py
git commit -m "Configure CORS for production"
git push
```

---

## ✅ **Part 5: Test Your Deployment**

### **Step 1: Test Frontend**
1. Go to: `https://YOUR-USERNAME.github.io/fitness-ai-assistant/`
2. Should see your app interface
3. Check browser console (F12) for errors

### **Step 2: Test Backend**
1. Go to: `https://your-backend.onrender.com/health`
2. Should see: `{"status": "healthy", ...}`

### **Step 3: Test Full App**
1. Open your GitHub Pages URL
2. Try asking a question
3. Should get AI response
4. Test voice features

---

## 🔄 **Part 6: Update Your App (Future Changes)**

Whenever you make changes:

```powershell
# 1. Make your changes to files

# 2. Add changes to git
git add .

# 3. Commit with message
git commit -m "Description of changes"

# 4. Push to GitHub
git push

# Frontend updates automatically (1-2 minutes)
# Backend updates automatically on Render/Railway
```

---

## 📁 **Recommended Project Structure**

```
fitness-ai-assistant/
├── index.html              ← Frontend (GitHub Pages)
├── style.css               ← Frontend
├── script.js               ← Frontend
├── test_marathi_voice.html ← Utility
├── backend/                ← Backend (Render/Railway)
│   ├── app.py
│   ├── data_loader.py
│   ├── requirements.txt
│   └── .env (don't commit!)
├── .gitignore
├── README.md
├── QUICKSTART.md
├── INSTALL_MARATHI_VOICE.md
└── DEPLOYMENT.md
```

---

## 🔒 **Part 7: Secure Your Secrets**

### **Create `.gitignore`**

Make sure you have `.gitignore` with:

```
# Environment variables
.env
*.env
!.env.example

# Python
__pycache__/
*.pyc
*.pyo

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### **Never Commit**:
- ❌ `.env` file
- ❌ API keys
- ❌ Database passwords
- ❌ Supabase keys

### **Use Environment Variables**:
- ✅ On Render/Railway: Add in dashboard
- ✅ Locally: Use `.env` file
- ✅ In code: Use `os.getenv()`

---

## 🎯 **Complete Deployment Checklist**

### **GitHub Setup**
- [ ] Created GitHub account
- [ ] Installed Git
- [ ] Configured Git (name, email)
- [ ] Created repository
- [ ] Pushed code to GitHub

### **Frontend Deployment**
- [ ] Moved frontend files to root
- [ ] Enabled GitHub Pages
- [ ] Site is live at GitHub Pages URL
- [ ] Updated API_URL in script.js

### **Backend Deployment**
- [ ] Created Render/Railway account
- [ ] Added requirements.txt
- [ ] Configured environment variables
- [ ] Deployed backend
- [ ] Backend health check works
- [ ] Updated CORS settings

### **Testing**
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Can ask questions and get responses
- [ ] Voice features work
- [ ] Hindi/Marathi support works

---

## 🌐 **Your Live URLs**

After deployment, you'll have:

**Frontend (GitHub Pages):**
```
https://YOUR-USERNAME.github.io/fitness-ai-assistant/
```

**Backend (Render):**
```
https://fitness-ai-backend.onrender.com
```

**Share these URLs** with anyone to use your app!

---

## 🐛 **Troubleshooting**

### **Issue: GitHub Pages shows 404**
**Solution:**
- Check Settings → Pages is enabled
- Make sure `index.html` is in root or selected folder
- Wait 2-3 minutes for deployment
- Clear browser cache

### **Issue: Can't connect to backend**
**Solution:**
- Check backend URL is correct in `script.js`
- Check backend is running (visit `/health` endpoint)
- Check CORS is configured
- Check browser console for errors

### **Issue: Environment variables not working**
**Solution:**
- Make sure they're added in Render/Railway dashboard
- Restart the backend service
- Check variable names match exactly

### **Issue: Git push fails**
**Solution:**
- Use Personal Access Token, not password
- Check internet connection
- Make sure you have permission to push
- Try: `git push -f origin main` (force push)

---

## 📚 **Useful Git Commands**

```powershell
# Check status
git status

# See changes
git diff

# Undo changes (before commit)
git checkout -- filename

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main

# Pull latest changes
git pull origin main

# Clone repository
git clone https://github.com/USERNAME/REPO.git
```

---

## 🎉 **Success!**

After completing all steps:

✅ **Your app is live on the internet!**
✅ **Anyone can access it via URL**
✅ **Updates automatically when you push to GitHub**
✅ **Backend handles AI requests**
✅ **Frontend provides beautiful UI**

**Share your app:**
```
🌐 https://YOUR-USERNAME.github.io/fitness-ai-assistant/
```

---

## 📞 **Need Help?**

**Common Resources:**
- GitHub Docs: [docs.github.com](https://docs.github.com)
- Render Docs: [render.com/docs](https://render.com/docs)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Git Tutorial: [git-scm.com/book](https://git-scm.com/book)

---

**Follow the steps in order and your app will be live!** 🚀🌐✨
