"""
Data Loader Script for Health & Fitness Knowledge Base
Loads health data from JSON file, generates embeddings, and stores in Supabase
"""

import json
import requests
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import time

# Load environment variables
load_dotenv()

DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_embedding(text):
    """Generate embedding using simple hash-based approach for demo"""
    import hashlib
    import struct
    
    # Create a deterministic embedding from text
    # This is a simplified approach - in production, use a proper embedding model
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

def create_table():
    """Create the fitness_knowledge table with pgvector extension"""
    print("📋 Creating table schema...")
    print("\nPlease run these SQL commands in your Supabase SQL Editor:\n")
    
    sql_commands = """
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
"""
    
    print(sql_commands)
    print("\n" + "="*60)
    input("\nPress Enter after running the SQL commands in Supabase...")

def load_data_from_json(file_path='health_data.json'):
    """Load health data from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Loaded {len(data)} records from {file_path}")
        return data
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return []

def insert_data_with_embeddings(data):
    """Generate embeddings and insert data into Supabase"""
    print(f"\n🚀 Starting to process {len(data)} records...")
    
    success_count = 0
    fail_count = 0
    
    for idx, item in enumerate(data, 1):
        title = item.get('title', '')
        content = item.get('content', '')
        
        print(f"\n[{idx}/{len(data)}] Processing: {title}")
        
        # Combine title and content for embedding
        text_for_embedding = f"{title}\n{content}"
        
        # Generate embedding
        print("  ⏳ Generating embedding...")
        embedding = get_embedding(text_for_embedding)
        
        if not embedding:
            print(f"  ❌ Failed to generate embedding")
            fail_count += 1
            continue
        
        # Insert into Supabase
        try:
            print("  ⏳ Inserting into Supabase...")
            result = supabase.table('fitness_knowledge').insert({
                'title': title,
                'content': content,
                'embedding': embedding
            }).execute()
            
            print(f"  ✅ Successfully inserted")
            success_count += 1
            
        except Exception as e:
            print(f"  ❌ Error inserting: {e}")
            fail_count += 1
        
        # Rate limiting - wait a bit between requests
        if idx < len(data):
            time.sleep(0.5)
    
    print("\n" + "="*60)
    print(f"📊 Summary:")
    print(f"  ✅ Successfully inserted: {success_count}")
    print(f"  ❌ Failed: {fail_count}")
    print(f"  📈 Total: {len(data)}")
    print("="*60)

def verify_data():
    """Verify that data was inserted correctly"""
    try:
        print("\n🔍 Verifying data in Supabase...")
        result = supabase.table('fitness_knowledge').select('id, title').execute()
        
        if result.data:
            print(f"✅ Found {len(result.data)} records in database:")
            for record in result.data[:5]:  # Show first 5
                print(f"  - {record['title']}")
            if len(result.data) > 5:
                print(f"  ... and {len(result.data) - 5} more")
        else:
            print("⚠️  No records found in database")
            
    except Exception as e:
        print(f"❌ Error verifying data: {e}")

def main():
    """Main function to orchestrate data loading"""
    print("="*60)
    print("🏋️  Health & Fitness Knowledge Base Loader")
    print("="*60)
    
    # Check environment variables
    if not all([DEEPSEEK_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
        print("\n❌ ERROR: Missing required environment variables!")
        print("Please set the following in your .env file:")
        print("  - DEEPSEEK_API_KEY")
        print("  - SUPABASE_URL")
        print("  - SUPABASE_KEY")
        return
    
    print("\n✅ Environment variables loaded")
    
    # Step 1: Create table (manual SQL execution)
    create_table()
    
    # Step 2: Load data from JSON
    data = load_data_from_json('health_data.json')
    
    if not data:
        print("❌ No data to process. Exiting.")
        return
    
    # Step 3: Confirm before proceeding
    print(f"\n⚠️  About to process {len(data)} records.")
    print("This will generate embeddings and insert data into Supabase.")
    confirm = input("Continue? (yes/no): ").strip().lower()
    
    if confirm != 'yes':
        print("❌ Operation cancelled.")
        return
    
    # Step 4: Insert data with embeddings
    insert_data_with_embeddings(data)
    
    # Step 5: Verify insertion
    verify_data()
    
    print("\n✅ Data loading complete!")
    print("🎉 Your Health & Fitness AI Assistant is ready to use!")

if __name__ == '__main__':
    main()
