from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# DeepSeek API endpoints
DEEPSEEK_CHAT_URL = "https://api.deepseek.com/v1/chat/completions"

def get_embedding(text):
    """Generate embedding using simple hash-based approach for demo"""
    import hashlib
    import struct
    
    # Create a deterministic embedding from text
    hash_obj = hashlib.sha256(text.encode())
    hash_bytes = hash_obj.digest()
    
    # Create 1536-dimensional embedding (matching expected size)
    embedding = []
    for i in range(1536):
        # Use hash bytes cyclically to generate float values
        byte_idx = i % len(hash_bytes)
        value = struct.unpack('B', bytes([hash_bytes[byte_idx]]))[0] / 255.0
        # Add some variation based on position
        value = (value + (i / 1536)) / 2.0
        embedding.append(value)
    
    return embedding

def search_knowledge_base(query_embedding, top_k=3):
    """Search Supabase for similar content using vector similarity"""
    try:
        # Call Supabase RPC function for vector similarity search
        result = supabase.rpc(
            'match_fitness_knowledge',
            {
                'query_embedding': query_embedding,
                'match_threshold': 0.5,
                'match_count': top_k
            }
        ).execute()
        
        return result.data if result.data else []
    except Exception as e:
        print(f"Error searching knowledge base: {e}")
        return []

def is_health_fitness_related(query):
    """Check if query is related to health and fitness"""
    health_keywords = [
        # English keywords
        'health', 'fitness', 'exercise', 'workout', 'nutrition', 'diet',
        'weight', 'muscle', 'cardio', 'strength', 'yoga', 'meditation',
        'sleep', 'stress', 'wellness', 'food', 'protein', 'vitamin',
        'hydration', 'water', 'calories', 'training', 'running', 'gym',
        'mental', 'physical', 'body', 'energy', 'recovery', 'injury',
        'posture', 'flexibility', 'stretching', 'core', 'balance',
        # Hindi keywords (हिंदी)
        'स्वास्थ्य', 'फिटनेस', 'व्यायाम', 'कसरत', 'पोषण', 'आहार',
        'वजन', 'मांसपेशी', 'योग', 'ध्यान', 'नींद', 'तनाव',
        'भोजन', 'प्रोटीन', 'विटामिन', 'पानी', 'कैलोरी', 'प्रशिक्षण',
        'दौड़', 'जिम', 'मानसिक', 'शारीरिक', 'शरीर', 'ऊर्जा',
        # Marathi keywords (मराठी)
        'आरोग्य', 'तंदुरुस्ती', 'व्यायाम', 'कसरत', 'पोषण', 'आहार',
        'वजन', 'स्नायू', 'योग', 'ध्यान', 'झोप', 'ताण',
        'अन्न', 'प्रथिने', 'जीवनसत्त्व', 'पाणी', 'कॅलरी', 'प्रशिक्षण',
        'धावणे', 'जिम', 'मानसिक', 'शारीरिक', 'शरीर', 'ऊर्जा'
    ]
    
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in health_keywords)

def generate_response(user_query, context):
    """Generate response using DeepSeek Chat API with RAG context"""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Create system prompt with context
    system_prompt = """You are a professional health and fitness assistant. 
Use the context below to answer the user's question accurately and helpfully.
If the question is unrelated to health or fitness, politely decline and redirect to health/fitness topics.
Be conversational, supportive, and provide actionable advice.

IMPORTANT: Always respond in the SAME LANGUAGE as the user's question.
- If the user asks in Hindi (हिंदी), respond completely in Hindi.
- If the user asks in Marathi (मराठी), respond completely in Marathi.
- If the user asks in English, respond in English.
- Match the user's language exactly in your entire response.

Context:
{context}
""".format(context=context)
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    try:
        response = requests.post(DEEPSEEK_CHAT_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I apologize, but I'm having trouble generating a response right now. Please try again."

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Health & Fitness AI Assistant is running"})

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint with RAG pipeline"""
    try:
        data = request.json
        user_query = data.get('message', '').strip()
        
        if not user_query:
            return jsonify({"error": "Message is required"}), 400
        
        # Check if query is health/fitness related
        if not is_health_fitness_related(user_query):
            return jsonify({
                "response": "I'm trained to talk about health and fitness topics. Could you ask something in that area? I can help with exercise, nutrition, wellness, sleep, stress management, and more!"
            })
        
        # Generate embedding for user query
        query_embedding = get_embedding(user_query)
        
        if not query_embedding:
            return jsonify({"error": "Failed to process query"}), 500
        
        # Search knowledge base
        similar_docs = search_knowledge_base(query_embedding, top_k=3)
        
        # Build context from retrieved documents
        context = "\n\n".join([
            f"Title: {doc['title']}\nContent: {doc['content']}"
            for doc in similar_docs
        ]) if similar_docs else "No specific context available."
        
        # Generate response using DeepSeek
        ai_response = generate_response(user_query, context)
        
        return jsonify({
            "response": ai_response,
            "sources": [doc['title'] for doc in similar_docs]
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/voice', methods=['POST'])
def voice():
    """Optional endpoint for voice-specific processing"""
    try:
        data = request.json
        text = data.get('text', '')
        
        # For now, just return the text (browser will handle TTS)
        return jsonify({"text": text})
        
    except Exception as e:
        print(f"Error in voice endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500
if __name__ == '__main__':
    # Check if environment variables are set
    if not all([DEEPSEEK_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
        print("ERROR: Missing required environment variables!")
        print("Please set DEEPSEEK_API_KEY, SUPABASE_URL, and SUPABASE_KEY")
        exit(1)
    
    print("🚀 Starting Health & Fitness AI Assistant...")
    print("📍 Server running on http://localhost:5000")
    
    # Use PORT from environment (for Render) or default to 5000
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)