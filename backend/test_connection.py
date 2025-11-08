"""
Test script to verify DeepSeek and Supabase connections
Run this before starting the main application
"""

import os
from dotenv import load_dotenv
import requests
from supabase import create_client

# Load environment variables
load_dotenv()

DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

def test_env_variables():
    """Test if environment variables are set"""
    print("=" * 60)
    print("🔍 Testing Environment Variables")
    print("=" * 60)
    
    checks = {
        'DEEPSEEK_API_KEY': DEEPSEEK_API_KEY,
        'SUPABASE_URL': SUPABASE_URL,
        'SUPABASE_KEY': SUPABASE_KEY
    }
    
    all_set = True
    for key, value in checks.items():
        if value:
            # Show only first 10 chars for security
            masked = value[:10] + '...' if len(value) > 10 else value
            print(f"✅ {key}: {masked}")
        else:
            print(f"❌ {key}: Not set")
            all_set = False
    
    print()
    return all_set

def test_deepseek_connection():
    """Test DeepSeek API connection"""
    print("=" * 60)
    print("🤖 Testing DeepSeek API Connection")
    print("=" * 60)
    
    try:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Test with a simple chat completion
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "user", "content": "Say 'Hello' if you can hear me."}
            ],
            "max_tokens": 10
        }
        
        print("⏳ Sending test request to DeepSeek...")
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            message = data['choices'][0]['message']['content']
            print(f"✅ DeepSeek API is working!")
            print(f"   Response: {message}")
            print()
            return True
        else:
            print(f"❌ DeepSeek API error: {response.status_code}")
            print(f"   Response: {response.text}")
            print()
            return False
            
    except Exception as e:
        print(f"❌ Error connecting to DeepSeek: {e}")
        print()
        return False

def test_supabase_connection():
    """Test Supabase connection"""
    print("=" * 60)
    print("🗄️  Testing Supabase Connection")
    print("=" * 60)
    
    try:
        print("⏳ Connecting to Supabase...")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Test connection by querying the table
        print("⏳ Checking fitness_knowledge table...")
        result = supabase.table('fitness_knowledge').select('id, title').limit(1).execute()
        
        if result.data:
            print(f"✅ Supabase connection successful!")
            print(f"   Found data in fitness_knowledge table")
            print(f"   Sample: {result.data[0]['title']}")
        else:
            print(f"⚠️  Supabase connected but no data found")
            print(f"   Run data_loader.py to populate the database")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Error connecting to Supabase: {e}")
        print()
        return False

def test_supabase_function():
    """Test Supabase RPC function"""
    print("=" * 60)
    print("🔧 Testing Supabase RPC Function")
    print("=" * 60)
    
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Create a dummy embedding (all zeros)
        dummy_embedding = [0.0] * 1536
        
        print("⏳ Testing match_fitness_knowledge function...")
        result = supabase.rpc(
            'match_fitness_knowledge',
            {
                'query_embedding': dummy_embedding,
                'match_threshold': 0.0,
                'match_count': 1
            }
        ).execute()
        
        if result.data is not None:
            print(f"✅ RPC function is working!")
            if result.data:
                print(f"   Found {len(result.data)} result(s)")
            else:
                print(f"   Function works but returned no results")
        else:
            print(f"⚠️  RPC function returned None")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Error testing RPC function: {e}")
        print(f"   Make sure you ran setup_supabase.sql")
        print()
        return False

def main():
    """Run all tests"""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "Health & Fitness AI - Connection Test" + " " * 10 + "║")
    print("╚" + "=" * 58 + "╝")
    print()
    
    # Test environment variables
    if not test_env_variables():
        print("❌ Please set all environment variables in .env file")
        return
    
    # Test DeepSeek
    deepseek_ok = test_deepseek_connection()
    
    # Test Supabase
    supabase_ok = test_supabase_connection()
    
    # Test Supabase function
    function_ok = test_supabase_function()
    
    # Summary
    print("=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    print(f"DeepSeek API:     {'✅ Pass' if deepseek_ok else '❌ Fail'}")
    print(f"Supabase DB:      {'✅ Pass' if supabase_ok else '❌ Fail'}")
    print(f"Supabase RPC:     {'✅ Pass' if function_ok else '❌ Fail'}")
    print("=" * 60)
    
    if deepseek_ok and supabase_ok and function_ok:
        print("\n🎉 All tests passed! You're ready to run the application!")
        print("\nNext steps:")
        print("1. If you haven't loaded data yet, run: python data_loader.py")
        print("2. Start the backend: python app.py")
        print("3. Open frontend/index.html in your browser")
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above.")
        print("\nCommon solutions:")
        print("- Check your .env file has correct credentials")
        print("- Verify DeepSeek API key is valid and has credits")
        print("- Ensure Supabase project is active")
        print("- Run setup_supabase.sql in Supabase SQL Editor")
    
    print()

if __name__ == '__main__':
    main()
