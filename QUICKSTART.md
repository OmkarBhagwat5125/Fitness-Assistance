# 🚀 Quick Start Guide

Get your Health & Fitness AI Assistant running in 10 minutes!

## ⚡ Prerequisites Checklist

- [ ] Python 3.8+ installed
- [ ] DeepSeek API key ([Get one here](https://platform.deepseek.com))
- [ ] Supabase account ([Sign up here](https://supabase.com))

## 📋 Step-by-Step Setup

### 1️⃣ Set Up Supabase (5 minutes)

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Go to SQL Editor** in your project dashboard
3. **Copy and paste** the contents of `backend/setup_supabase.sql`
4. **Click "Run"** to execute the SQL commands
5. **Get your credentials**:
   - Go to Settings → API
   - Copy your **Project URL** and **anon/public key**

### 2️⃣ Configure Backend (2 minutes)

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Create `.env` file**:
   ```bash
   copy .env.example .env
   ```

4. **Edit `.env`** with your credentials:
   ```env
   DEEPSEEK_API_KEY=sk-your-key-here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key-here
   ```

### 3️⃣ Load Knowledge Base (2 minutes)

Run the data loader to populate your database:

```bash
python data_loader.py
```

✅ You should see: "Data loading complete!"

### 4️⃣ Start the Backend (30 seconds)

```bash
python app.py
```

✅ You should see: "Server running on http://localhost:5000"

### 5️⃣ Open the Frontend (30 seconds)

1. **Open a new terminal**
2. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

3. **Open in browser**:
   - Simply double-click `index.html`, or
   - Use a local server:
     ```bash
     python -m http.server 8000
     ```
   - Then open: `http://localhost:8000`

## 🎉 You're Ready!

The assistant will greet you with: "Hello! I'm your Health & Fitness Assistant..."

### Try These Questions:
- "What are the benefits of exercise?"
- "How much water should I drink?"
- "Tell me about strength training"
- "How can I improve my sleep?"

### Use Voice Mode:
1. Click the 🎤 microphone button
2. Speak your question
3. Listen to the response!

## 🐛 Quick Troubleshooting

**Backend won't start?**
- Check if `.env` file exists and has all 3 variables
- Verify Python dependencies are installed

**Frontend can't connect?**
- Make sure backend is running on port 5000
- Check browser console for errors

**Voice not working?**
- Use Chrome, Edge, or Safari
- Allow microphone permissions
- Check if voice toggle is ON

**No responses from AI?**
- Verify DeepSeek API key is valid
- Check Supabase credentials
- Ensure data was loaded successfully

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Add more health data to `health_data.json`
- Customize the UI in `frontend/style.css`
- Deploy to production (see README.md)

## 💬 Need Help?

Check the troubleshooting section in README.md or create an issue on GitHub.

---

**Happy coding! 🏋️💪**
