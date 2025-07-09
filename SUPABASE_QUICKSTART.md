# 🗄️ Supabase Setup for MindSync.ai

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Click "New project" 
3. Name: `mindsync-ai`
4. Generate password and region
5. Wait 2-3 minutes for initialization

### 2. Run Database Schema
1. In Supabase dashboard → SQL Editor
2. Copy ALL content from `supabase-schema.sql`
3. Paste and click "Run"
4. Verify tables created: `profiles`, `bookmarks`, `ai_insights`, `connections`

### 3. Get API Credentials
- **Settings → API**
- Copy `Project URL` 
- Copy `anon public` key
- Save for deployment

### 4. Configure Authentication
- **Authentication → Settings**
- Enable Email provider
- Set Site URL to your Vercel URL (after deployment)

## Environment Variables for Vercel

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Verify Setup

After deployment, test:
1. ✅ Sign up with email
2. ✅ Bookmark a URL  
3. ✅ See content in dashboard
4. ✅ Search functionality

## Database Schema Overview

- **profiles**: User data and preferences
- **bookmarks**: Saved URLs with metadata  
- **ai_insights**: AI-generated patterns and connections
- **connections**: Relationships between content items

Ready for deployment! 🚀