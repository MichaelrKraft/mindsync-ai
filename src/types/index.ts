// Core content types for MindSync

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  content: string
  url?: string
  imageUrl?: string
  tags: string[]
  aiTags: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
  metadata?: ContentMetadata
}

export type ContentType = 'note' | 'link' | 'image' | 'quote' | 'code' | 'book' | 'product' | 'article' | 'property' | 'tv_show' | 'website' | 'tweet'

export interface ContentMetadata {
  wordCount?: number
  readingTime?: number
  sourceUrl?: string
  author?: string
  domain?: string
  imageAlt?: string
  codeLanguage?: string
  
  // Book-specific metadata
  bookCover?: string
  isbn?: string
  publisher?: string
  publishDate?: string
  genre?: string
  rating?: number
  
  // Product-specific metadata
  price?: string
  originalPrice?: string
  brand?: string
  designer?: string
  category?: string
  availability?: string
  
  // Article-specific metadata
  excerpt?: string
  publication?: string
  publishedDate?: string
  
  // Property-specific metadata
  propertyPrice?: string
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
  squareFootage?: string
  location?: string
  
  // TV Show/Movie-specific metadata
  poster?: string
  imdbRating?: number
  genre_entertainment?: string
  releaseYear?: string
  duration?: string
  summary?: string
  
  // Website-specific metadata
  favicon?: string
  siteName?: string
  description?: string
  
  // Tweet-specific metadata
  tweetAuthor?: string
  tweetHandle?: string
  tweetDate?: string
  likes?: number
  retweets?: number
}

export interface AIInsight {
  id: string
  type: InsightType
  title: string
  description: string
  confidence: number
  relatedContentIds: string[]
  createdAt: Date
  isRead: boolean
}

export type InsightType = 'pattern' | 'connection' | 'summary' | 'suggestion'

export interface ContentConnection {
  id: string
  sourceId: string
  targetId: string
  relationship: ConnectionType
  strength: number
  reason: string
  discoveredAt: Date
}

export type ConnectionType = 'similar_topic' | 'builds_on' | 'contradicts' | 'references' | 'related_context'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences: UserPreferences
  createdAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  aiInsightsEnabled: boolean
  notificationsEnabled: boolean
  autoTagging: boolean
  contentTypes: ContentType[]
}

export interface SearchFilters {
  contentTypes?: ContentType[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  hasConnections?: boolean
  hasAIInsights?: boolean
}

export interface SearchResult {
  items: ContentItem[]
  totalCount: number
  facets: {
    contentTypes: Array<{ type: ContentType; count: number }>
    tags: Array<{ tag: string; count: number }>
  }
}

// UI State Types
export interface UIState {
  sidebar: {
    isOpen: boolean
    isCollapsed: boolean
  }
  search: {
    query: string
    filters: SearchFilters
    isLoading: boolean
  }
  content: {
    selectedId?: string
    isCreating: boolean
    isEditing: boolean
  }
  insights: {
    unreadCount: number
    isNotificationOpen: boolean
  }
}

// Mock Data Types
export interface MockDataConfig {
  contentCount: number
  insightCount: number
  connectionCount: number
  userCount: number
}