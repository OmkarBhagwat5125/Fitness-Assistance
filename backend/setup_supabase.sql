-- ============================================
-- Health & Fitness AI Assistant - Supabase Setup
-- ============================================
-- Run these commands in your Supabase SQL Editor
-- ============================================

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Create fitness_knowledge table
CREATE TABLE IF NOT EXISTS fitness_knowledge (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Step 3: Create index for faster similarity search
-- This uses IVFFlat algorithm for approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS fitness_knowledge_embedding_idx 
ON fitness_knowledge 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Step 4: Create function for similarity search
-- This function returns the most similar documents based on cosine similarity
CREATE OR REPLACE FUNCTION match_fitness_knowledge(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 3
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

-- Step 5: Verify setup
-- Run this to check if everything is set up correctly
SELECT 
    'pgvector extension' as component,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'vector'
    ) THEN '✅ Installed' ELSE '❌ Not installed' END as status
UNION ALL
SELECT 
    'fitness_knowledge table' as component,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'fitness_knowledge'
    ) THEN '✅ Created' ELSE '❌ Not created' END as status
UNION ALL
SELECT 
    'match_fitness_knowledge function' as component,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'match_fitness_knowledge'
    ) THEN '✅ Created' ELSE '❌ Not created' END as status;

-- ============================================
-- Optional: View data after loading
-- ============================================

-- Count total records
-- SELECT COUNT(*) as total_records FROM fitness_knowledge;

-- View all titles
-- SELECT id, title FROM fitness_knowledge ORDER BY id;

-- Test similarity search (after data is loaded)
-- SELECT title, similarity 
-- FROM match_fitness_knowledge(
--     (SELECT embedding FROM fitness_knowledge LIMIT 1),
--     0.5,
--     5
-- );
