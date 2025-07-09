# Supabase Setup Guide for MindSync.ai

## Quick Start

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and database region
   - Set a strong database password

2. **Set Up Database Schema**
   - In your Supabase dashboard, go to SQL Editor
   - Copy the contents of `supabase-schema.sql` 
   - Paste and run the SQL script
   - This creates all tables, indexes, and security policies

3. **Configure Environment Variables**
   - Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   - Find these in Settings → API in your Supabase dashboard

4. **Enable Email Authentication**
   - Go to Authentication → Settings
   - Enable "Email" provider
   - Configure email templates if desired

5. **Test the Setup**
   - Run `npm run dev`
   - Visit http://localhost:3002
   - Sign up for a new account
   - Try saving your first bookmark!

## Database Schema Overview

The database includes these main tables:

### `profiles`
- User profiles (extends Supabase auth.users)
- Stores user preferences and metadata

### `bookmarks`
- Main content storage
- Supports all content types (books, articles, products, etc.)
- Includes tags, AI tags, and rich metadata

### `ai_insights`
- AI-generated insights and patterns
- Confidence scores and related content

### `content_connections`
- Relationships between content items
- Strength scores and discovery reasoning

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Email/password with Supabase Auth
- **Real-time subscriptions**: Live updates when content changes
- **Full-text search**: PostgreSQL-powered search across all content

## What's Working Now

✅ **Authentication**: Sign up/sign in with email  
✅ **Bookmark Saving**: URL analysis and smart content detection  
✅ **Real-time Updates**: Live sync across browser tabs  
✅ **Search & Filtering**: Full-text search and content type filters  
✅ **Content Grid**: Responsive grid with specialized cards  

## Next Steps

To complete the AI features, you'll need to:

1. **Add Claude API Key** to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your-claude-api-key
   ```

2. **Enable AI Insights** - The system will automatically analyze your content and generate insights

3. **Connect to Real APIs** - Currently using mock data for metadata enrichment. You can integrate with:
   - OpenGraph/Twitter Card parsers
   - Amazon Product API
   - IMDB API
   - Real estate APIs

## Troubleshooting

### Common Issues:

1. **"Authentication required" error**
   - Check your environment variables
   - Ensure user is signed in
   - Verify RLS policies are set up correctly

2. **Schema errors**
   - Make sure you ran the complete `supabase-schema.sql`
   - Check that UUID extension is enabled

3. **Real-time not working**
   - Verify your Supabase project has real-time enabled
   - Check browser console for WebSocket errors

Need help? Check the Supabase docs at docs.supabase.com