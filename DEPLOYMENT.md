# 🚀 MindSync.ai Deployment Guide

## Option 1: Vercel + Supabase (Recommended)

### Step 1: Setup Supabase Database

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New project"
   - Choose organization and project name
   - Wait for project to initialize

2. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase-schema.sql`
   - Run the SQL to create tables

3. **Get API Keys**
   - Go to Settings → API
   - Copy your `Project URL` and `anon` key
   - Keep these for Vercel environment variables

### Step 2: Deploy to Vercel

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Choose the `test-nextjs` folder as root directory

3. **Add Environment Variables**
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get your live URL!

### Step 3: Test Your Live App

1. Visit your Vercel URL
2. Sign up with email/password
3. Try bookmarking a URL
4. See real-time content appear

## Option 2: Local Development Setup

### Prerequisites
- Node.js v20 (use `nvm use 20`)
- Supabase project setup (Step 1 above)

### Setup
1. **Clone and Install**
   ```bash
   cd test-nextjs
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3002

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check that Supabase schema is properly applied
- Verify Node.js version (v20 recommended)

### Authentication Issues
- Confirm Supabase project is active
- Check API keys are correct
- Verify email configuration in Supabase Auth settings

### Performance
- Images are optimized for Unsplash domains
- Content grid uses virtualization for large datasets
- All animations are GPU-accelerated

## Features Overview

✅ **Smart Bookmarking**: URL analysis and content type detection  
✅ **Real-time Sync**: Live updates across browser tabs  
✅ **Search & Filter**: Full-text search and content type filters  
✅ **Authentication**: Email/password with Supabase Auth  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  
🔄 **AI Insights**: Ready for Claude API integration  

## Next Steps

After deployment:
1. **Custom Domain**: Add your domain in Vercel settings
2. **AI Features**: Add `ANTHROPIC_API_KEY` for AI insights
3. **Analytics**: Connect Vercel Analytics for usage tracking
4. **Monitoring**: Set up error tracking and performance monitoring

Your MindSync.ai is now live! 🎉