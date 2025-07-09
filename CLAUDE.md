# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MindSync** is a full-stack Next.js 15 application that combines MyMind-style content saving with AI pattern discovery. It's an AI-powered knowledge management system designed to help users save, organize, and discover insights from their content.

## Current Development Status

### ✅ **Completed: MyMind-Style Visual Bookmarking System**

**Smart Content Type Detection:**
- URL analysis service (`src/lib/url-analyzer.ts`) that automatically detects content types from URLs
- Support for books, products, articles, properties, TV shows, tweets, websites
- Domain-based pattern matching for intelligent content classification

**Visual-First Card Components (`src/components/content/specialized-cards.tsx`):**
- **BookCard**: Full cover images with hover overlays showing author, rating
- **ProductCard**: Large product images with floating price badges and availability
- **TweetCard**: Authentic Twitter-style layout with profile pictures and engagement stats
- **QuoteCard**: Yellow sticky note style with rotation effects
- **ArticleCard**: Clean article preview with publication info and reading time
- **PropertyCard**: Real estate listings with images, price, and property details
- **TVShowCard**: Show posters with IMDB ratings and summaries
- **WebsiteCard**: Website previews with favicon and domain info

**Enhanced Content System:**
- Extended `ContentType` union to include all specialized bookmark types
- Rich `ContentMetadata` interface with type-specific fields (price, author, rating, etc.)
- Smart content card router (`SmartContentCard`) that automatically selects appropriate card type
- Fixed card layout issues - replaced virtualized grid with `SimpleContentGrid` for proper display

**UI/UX Improvements:**
- Animated MindSync sidebar with branded navigation
- Visual bookmark saving button integrated into sidebar
- Consistent 320px card heights with proper spacing
- Responsive grid layout (1-4 columns based on screen size)

### 🎯 **Next Phase: Functional Bookmark System**

**High Priority:**
1. **Make Bookmark Button Functional** - Connect "Add Content" button to actually save new bookmarks using URL analyzer
2. **Content Interactions** - Make View/Bookmark/Share buttons on cards functional
3. **Search & Filtering** - Implement working search and content type filters

**Medium Priority:**
4. **AI Features** - Complete insights page with pattern discovery
5. **Content Management** - Add editing, deletion, detail views
6. **Additional Pages** - Timeline, Connections, Settings

**Current State:** Visual bookmarking system is complete and beautiful. Ready to make it functional.

### 📋 **Session Summary (2025-07-02)**

**Completed in this session:**
- ✅ Fixed card layout cutoff issues - replaced VirtualizedContentGrid with SimpleContentGrid
- ✅ Standardized all card heights to 320px for consistent display
- ✅ Enhanced grid spacing and responsive layout (1-4 columns)
- ✅ All visual cards now display properly without truncation
- ✅ Updated documentation with current development status
- ✅ Created comprehensive git commit with all visual bookmarking work

**Ready for next session:**
The MyMind-style visual bookmarking system is now complete and working beautifully. Visit `/content` to see all the specialized visual cards. The next logical step is to make the "Add Content" button functional so users can actually save new bookmarks using the URL analyzer we built.

**Development server:** Running on http://localhost:3002

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion + Aceternity UI (3D effects)
- **Performance:** react-window for virtualization
- **Testing:** Vitest + React Testing Library

## Development Commands

```bash
# Start development server
npm run dev                 # Runs on http://localhost:3002

# Build and test
npm run build              # Production build
npm run start             # Start production server
npm run lint              # ESLint
npm run test              # Run tests with Vitest
npm run test:ui            # Run tests with Vitest UI

# Quick fixes for server issues
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## Architecture Overview

### Core Application Structure

MindSync follows Next.js 15 App Router conventions with a feature-based component organization:

**Key Application Pages:**
- `/` - Main dashboard with content overview and AI insights
- `/content` - 3D content grid with filtering and grouping
- `/insights` - AI-powered pattern discovery and insights
- `/timeline` - Orbital timeline visualization of content relationships
- `/working` - Simplified fallback version for development/debugging

**Component Architecture:**
- `components/ui/` - Enhanced shadcn/ui components with custom styling
- `components/aceternity/` - Advanced 3D effects and animations
- `components/content/` - Content-specific components (cards, grids, virtualization)
- `components/layout/` - Application layout and navigation
- `components/ai/` - AI-specific features (insights, pattern discovery)

### Data Layer

The application currently uses comprehensive mock data defined in `src/data/mock-content.ts`:

**Core Entities:**
- `ContentItem` - Individual pieces of content (notes, links, images, quotes, code)
- `AIInsight` - AI-generated patterns, connections, and suggestions
- `ContentConnection` - Relationships between content items
- `User` - User profiles and preferences

**Type Safety:**
All data structures are strictly typed in `src/types/index.ts` with comprehensive interfaces for content management, AI insights, search functionality, and UI state.

### Design System

MindSync uses a complete design system defined in `src/lib/design-tokens.ts`:

**Key Principles:**
- Clean, Notion-inspired aesthetic with generous white space
- **Color Palette:** Primary blues (#2383E2), grays, whites, green accents for AI features
- **Typography:** SF Pro Display/Inter with carefully defined scales
- **Animation:** Subtle 3D effects and smooth transitions

**Custom Tailwind Theme:**
The `tailwind.config.ts` extends the base theme with MindSync-specific colors, typography scales, and spacing that align with the design tokens.

## Component Integration Patterns

### Aceternity UI Components

The app integrates several advanced UI components with specific patterns:

**3D Effects:**
- `Card3D` - Interactive 3D card hovers
- `Sidebar` - Animated collapsible navigation
- `TextGenerateEffect` - AI-style text generation animations

**Background Effects:**
- `BackgroundBeams` - Animated gradient beams (used in insights page)
- `GlowingEffect` - Interactive border animations that follow mouse
- `Glow` - Subtle radial background effects
- `StarsBackground` - Animated starfield (available but not active)

### Content Management

**Virtualization:**
The content grid uses `react-window` for performance with large datasets via `VirtualizedContentGrid`.

**Content Types:**
- `note` - Text-based content
- `link` - URLs with metadata
- `image` - Visual content
- `quote` - Attributed quotes
- `code` - Code snippets with syntax highlighting

**AI Features:**
- Pattern discovery across content
- Automatic relationship detection
- Content summarization and insights
- Semantic search capabilities

## Development Guidelines

### Working with Visual Effects

The application layers multiple visual effects:

1. **Base Layer:** Subtle glow effects provide depth
2. **Content Layer:** Cards with glowing borders on hover
3. **Interactive Layer:** 3D hover effects on content cards
4. **Background Layer:** Animated beams and gradients in hero sections

When adding new effects, maintain the subtle, professional aesthetic. Avoid overwhelming animations.

### Content Architecture

New content types should:
1. Extend the `ContentType` union in `types/index.ts`
2. Add corresponding mock data in `mock-content.ts`
3. Update the type-specific rendering in content components
4. Consider AI insight generation for the new type

### State Management

The application uses React state and props for state management. UI state types are defined in `types/index.ts` for consistent state structure across components.

## Known Issues & Solutions

### Server Not Starting
**Symptoms:** `npm run dev` hangs or times out
**Solutions:**
1. Clear cache: `rm -rf .next`
2. Fresh install: `rm -rf node_modules package-lock.json && npm install`
3. Check port conflicts: `lsof -i :3002`
4. Use simplified pages: `/working` instead of `/`

### Node.js Version Compatibility
**Requirement:** Node.js v20 (LTS) - v22 causes compatibility issues
**Solution:** Use nvm to switch: `nvm use 20`

### Image Configuration
External images require domain configuration in `next.config.js`. Currently configured for `images.unsplash.com`.

## Environment Notes

- **Port:** 3002 (avoids conflicts with other projects)
- **Node version:** v20 (LTS) - v22 not supported
- **Dependencies:** All included in package.json, no external services required
- **Working pages:** All pages functional - `/working` provides simplified fallback
- **Development mode:** Hot reload enabled, TypeScript strict mode active

## Testing

Tests use Vitest with React Testing Library. Component tests are located in `components/ui/__tests__/`. Run `npm run test:ui` for interactive testing interface.