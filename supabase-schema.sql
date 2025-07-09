-- MindSync.ai Database Schema
-- Run this in your Supabase SQL editor to create the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{
    "theme": "light",
    "ai_insights_enabled": true,
    "notifications_enabled": true,
    "auto_tagging": true,
    "content_types": ["note", "link", "image", "quote", "code", "book", "product", "article", "property", "tv_show", "website", "tweet"]
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('note', 'link', 'image', 'quote', 'code', 'book', 'product', 'article', 'property', 'tv_show', 'website', 'tweet')),
  image_url TEXT,
  favicon_url TEXT,
  tags TEXT[] DEFAULT '{}',
  ai_tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pattern', 'connection', 'summary', 'suggestion')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  related_content_ids UUID[] DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content connections table
CREATE TABLE IF NOT EXISTS content_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  source_id UUID REFERENCES bookmarks(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES bookmarks(id) ON DELETE CASCADE NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('similar_topic', 'builds_on', 'contradicts', 'references', 'related_context')),
  strength DECIMAL(3,2) NOT NULL CHECK (strength >= 0 AND strength <= 1),
  reason TEXT NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, target_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_content_type ON bookmarks(content_type);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON bookmarks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_bookmarks_ai_tags ON bookmarks USING GIN(ai_tags);
CREATE INDEX IF NOT EXISTS idx_bookmarks_metadata ON bookmarks USING GIN(metadata);

CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_is_read ON ai_insights(is_read);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_connections_user_id ON content_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_content_connections_source_id ON content_connections(source_id);
CREATE INDEX IF NOT EXISTS idx_content_connections_target_id ON content_connections(target_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at BEFORE UPDATE ON bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_connections ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON bookmarks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- AI insights policies
CREATE POLICY "Users can view own insights" ON ai_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON ai_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON ai_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" ON ai_insights
    FOR DELETE USING (auth.uid() = user_id);

-- Content connections policies
CREATE POLICY "Users can view own connections" ON content_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections" ON content_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections" ON content_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections" ON content_connections
    FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Full-text search function for bookmarks
CREATE OR REPLACE FUNCTION search_bookmarks(
  search_query TEXT,
  user_uuid UUID
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  content TEXT,
  content_type TEXT,
  url TEXT,
  image_url TEXT,
  tags TEXT[],
  ai_tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.content,
    b.content_type,
    b.url,
    b.image_url,
    b.tags,
    b.ai_tags,
    b.metadata,
    b.created_at,
    ts_rank(
      to_tsvector('english', b.title || ' ' || b.content || ' ' || array_to_string(b.tags, ' ') || ' ' || array_to_string(b.ai_tags, ' ')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM bookmarks b
  WHERE b.user_id = user_uuid
    AND (
      to_tsvector('english', b.title || ' ' || b.content || ' ' || array_to_string(b.tags, ' ') || ' ' || array_to_string(b.ai_tags, ' '))
      @@ plainto_tsquery('english', search_query)
    )
  ORDER BY rank DESC, b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;