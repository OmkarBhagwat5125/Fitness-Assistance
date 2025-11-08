# 🏋️ Health & Fitness AI Assistant

A full-stack intelligent Health & Fitness Assistant with two-way voice communication, powered by DeepSeek API, Flask backend, and Supabase RAG (Retrieval-Augmented Generation).

## 🌟 Features

### 🗣️ Two-Way Voice Interaction
- **Voice Greeting**: Automatically greets users with a spoken welcome message on page load
- **Speech Input**: Ask questions using your microphone (Web Speech API)
- **Speech Output**: Hear AI responses spoken aloud
- **Voice Toggle**: Easy ON/OFF control for voice mode

### 💬 Modern Chat Interface
- Clean, responsive design with gradient themes
- User messages on the right, AI messages on the left
- Typing animation for AI responses
- Scrollable conversation history
- Source citations for RAG responses

### 🧠 RAG-Powered Knowledge Base
- Vector similarity search using Supabase pgvector
- DeepSeek embeddings for semantic understanding
- 20+ pre-loaded health & fitness topics
- Grounded, accurate responses based on knowledge base

### 🚫 Domain Restriction
- Only answers health, fitness, wellness, and nutrition questions
- Politely redirects off-topic queries

## 🛠️ Tech Stack

### Frontend
- **HTML5, CSS3, JavaScript** (Vanilla - no frameworks)
- **Web Speech API** for voice input/output
- **Fetch API** for backend communication
- Responsive design with modern UI/UX

### Backend
- **Python 3.8+**
- **Flask** web framework
- **DeepSeek API** for embeddings and chat completions
- **Supabase** with pgvector for vector storage
- **Flask-CORS** for cross-origin requests

## 📦 Project Structure

```
health_fitness_assistant/
│
├── backend/
│   ├── app.py                 # Flask application with RAG pipeline
│   ├── data_loader.py         # Script to populate Supabase
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (create this)
│   ├── .env.example          # Example environment file
│   └── health_data.json      # Sample health & fitness data
│
├── frontend/
│   ├── index.html            # Main HTML page
│   ├── style.css             # Styling and animations
│   └── script.js             # Voice & chat functionality
│
└── README.md                 # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js (optional, for serving frontend)
- DeepSeek API key
- Supabase account and project

### Step 1: Clone or Download the Project

```bash
cd "c:/Users/omkar/Desktop/fitness assistance"
```

### Step 2: Set Up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run SQL commands** in Supabase SQL Editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create fitness_knowledge table
CREATE TABLE IF NOT EXISTS fitness_knowledge (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536)
);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS fitness_knowledge_embedding_idx 
ON fitness_knowledge 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION match_fitness_knowledge(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id bigint,
    title text,
    content text,
    similarity float
)
LANGUAGE sql STABLE
AS $$
    SELECT
        fitness_knowledge.id,
        fitness_knowledge.title,
        fitness_knowledge.content,
        1 - (fitness_knowledge.embedding <=> query_embedding) AS similarity
    FROM fitness_knowledge
    WHERE 1 - (fitness_knowledge.embedding <=> query_embedding) > match_threshold
    ORDER BY fitness_knowledge.embedding <=> query_embedding
    LIMIT match_count;
$$;
```

3. **Get your Supabase credentials**:
   - Project URL: `https://your-project.supabase.co`
   - Anon/Public Key: Found in Project Settings → API

### Step 3: Configure Backend

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

3. **Create `.env` file** (copy from `.env.example`):
```bash
copy .env.example .env
```

4. **Edit `.env` file** with your credentials:
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### Step 4: Load Data into Supabase

Run the data loader script to populate your knowledge base:

```bash
python data_loader.py
```

This will:
- Generate embeddings for 20+ health & fitness topics
- Insert data into Supabase
- Verify the insertion

**Note**: This process may take a few minutes depending on API rate limits.

### Step 5: Start the Backend Server

```bash
python app.py
```

The Flask server will start at `http://localhost:5000`

### Step 6: Open the Frontend

1. **Navigate to frontend directory**:
```bash
cd ../frontend
```

2. **Open `index.html` in your browser**:
   - Double-click the file, or
   - Use a local server (recommended):

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

3. **Access the application**:
   - Open `http://localhost:8000` in your browser

## 🎯 Usage

### Text Chat
1. Type your health/fitness question in the input box
2. Press Enter or click the send button
3. View the AI's response with source citations

### Voice Chat
1. Click the microphone button 🎤
2. Speak your question clearly
3. The app will transcribe and send automatically
4. Listen to the AI's spoken response

### Toggle Voice Mode
- Click the "Voice ON/OFF" button in the header
- When OFF, responses won't be spoken aloud

## 💡 Example Questions

Try asking:
- "What are the benefits of regular exercise?"
- "How much water should I drink daily?"
- "What's a balanced diet?"
- "How can I improve my sleep quality?"
- "Tell me about strength training"
- "How do I manage stress?"
- "What are good sources of protein?"
- "Why is stretching important?"

## 🔧 Configuration

### Backend Configuration

**API Endpoints**:
- `GET /health` - Health check endpoint
- `POST /chat` - Main chat endpoint with RAG pipeline
- `POST /voice` - Voice processing endpoint (optional)

**Environment Variables**:
- `DEEPSEEK_API_KEY` - Your DeepSeek API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key

### Frontend Configuration

Edit `script.js` to change the API URL:

```javascript
const API_URL = 'http://localhost:5000'; // Change for production
```

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. **Push code to GitHub**

2. **Deploy on Render**:
   - Create new Web Service
   - Connect your repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `python app.py`
   - Add environment variables

3. **Deploy on Railway**:
   - Create new project
   - Connect repository
   - Add environment variables
   - Deploy automatically

### Frontend Deployment (Netlify/GitHub Pages)

1. **GitHub Pages**:
   - Push frontend folder to GitHub
   - Enable GitHub Pages in repository settings
   - Select main branch and `/frontend` folder

2. **Netlify**:
   - Drag and drop frontend folder to Netlify
   - Or connect GitHub repository
   - Configure build settings (none needed for static site)

**Important**: Update `API_URL` in `script.js` to your deployed backend URL.

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use environment variables** for all sensitive data
3. **Enable CORS** only for trusted domains in production
4. **Use HTTPS** for production deployments
5. **Rotate API keys** regularly
6. **Implement rate limiting** for production use

## 🐛 Troubleshooting

### Backend Issues

**"Missing environment variables" error**:
- Ensure `.env` file exists in backend directory
- Verify all three variables are set correctly

**"Failed to connect to Supabase" error**:
- Check Supabase URL and key
- Verify pgvector extension is enabled
- Ensure table and function are created

**"DeepSeek API error"**:
- Verify API key is valid
- Check API rate limits
- Ensure you have credits/quota

### Frontend Issues

**"Unable to connect to server" error**:
- Ensure backend is running on port 5000
- Check CORS settings
- Verify API_URL in script.js

**Voice not working**:
- Use Chrome, Edge, or Safari (best support)
- Allow microphone permissions
- Check browser console for errors

**No voice output**:
- Ensure voice mode is ON
- Check browser volume settings
- Try different browser

## 📚 API Documentation

### DeepSeek API

**Embeddings Endpoint**:
```
POST https://api.deepseek.com/v1/embeddings
```

**Chat Completions Endpoint**:
```
POST https://api.deepseek.com/v1/chat/completions
```

**Documentation**: [DeepSeek API Docs](https://platform.deepseek.com/docs)

### Supabase API

**Vector Similarity Search**:
```python
supabase.rpc('match_fitness_knowledge', {
    'query_embedding': embedding,
    'match_threshold': 0.5,
    'match_count': 3
})
```

**Documentation**: [Supabase Docs](https://supabase.com/docs)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Add more health & fitness content to `health_data.json`
2. Improve the UI/UX design
3. Add new features (e.g., user profiles, workout tracking)
4. Fix bugs and improve error handling
5. Enhance voice recognition accuracy

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **DeepSeek** for powerful AI capabilities
- **Supabase** for vector database infrastructure
- **Web Speech API** for voice functionality
- **Flask** for backend framework

## 📧 Support

For issues, questions, or suggestions:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with detailed information

---

**Built with ❤️ for health and wellness**

🏋️ Stay fit, stay healthy! 🏋️
