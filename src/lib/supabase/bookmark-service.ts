import { createClient } from './client'
import { URLAnalyzer } from '../url-analyzer'
import { ContentItem, ContentType, ContentMetadata } from '@/types'

export interface BookmarkSaveRequest {
  url: string
  title?: string
  tags?: string[]
  notes?: string
}

export interface BookmarkSaveResult {
  success: boolean
  content?: ContentItem
  error?: string
}

export interface BookmarkSearchParams {
  query?: string
  contentTypes?: ContentType[]
  tags?: string[]
  limit?: number
  offset?: number
}

export interface BookmarkSearchResult {
  items: ContentItem[]
  totalCount: number
  hasMore: boolean
}

/**
 * Supabase-powered bookmark service
 * Handles all CRUD operations for bookmarks with real-time sync
 */
export class SupabaseBookmarkService {
  private static supabase = createClient()

  /**
   * Save a new bookmark to the database
   */
  static async saveBookmark(request: BookmarkSaveRequest): Promise<BookmarkSaveResult> {
    try {
      const supabase = this.supabase
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return {
          success: false,
          error: 'Authentication required'
        }
      }

      // Analyze the URL to determine content type and metadata
      const analysis = await URLAnalyzer.analyzeURL(request.url)
      
      // Enrich metadata with additional information
      const enrichedMetadata = await this.enrichMetadata(request.url, analysis.metadata)
      
      // Generate title if not provided
      const title = request.title || await this.generateTitle(request.url, analysis.contentType)
      
      // Generate content preview
      const content = this.generateContentPreview(request.url, analysis.contentType)
      
      // Generate AI tags
      const aiTags = await this.generateAITags(analysis.contentType, title, request.url)
      
      // Prepare bookmark data for database
      const bookmarkData = {
        user_id: user.id,
        url: request.url,
        title,
        content,
        content_type: analysis.contentType,
        image_url: enrichedMetadata.bookCover || enrichedMetadata.poster || this.generatePreviewImage(request.url),
        favicon_url: enrichedMetadata.favicon,
        tags: request.tags || [],
        ai_tags: aiTags,
        metadata: enrichedMetadata
      }

      // Insert bookmark into database
      const { data, error } = await supabase
        .from('bookmarks')
        .insert(bookmarkData)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        return {
          success: false,
          error: `Failed to save bookmark: ${error.message}`
        }
      }

      // Convert database row to ContentItem
      const contentItem = this.dbRowToContentItem(data)

      return {
        success: true,
        content: contentItem
      }

    } catch (error) {
      console.error('Error saving bookmark:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get all bookmarks for the current user
   */
  static async getBookmarks(params: BookmarkSearchParams = {}): Promise<BookmarkSearchResult> {
    try {
      const supabase = this.supabase
      const { limit = 50, offset = 0, contentTypes, tags, query } = params

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return {
          items: [],
          totalCount: 0,
          hasMore: false
        }
      }

      let queryBuilder = supabase
        .from('bookmarks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Apply content type filter
      if (contentTypes && contentTypes.length > 0) {
        queryBuilder = queryBuilder.in('content_type', contentTypes)
      }

      // Apply tag filter
      if (tags && tags.length > 0) {
        queryBuilder = queryBuilder.overlaps('tags', tags)
      }

      // Apply search query
      if (query) {
        // Use full-text search function
        const { data: searchResults, error: searchError } = await supabase
          .rpc('search_bookmarks', {
            search_query: query,
            user_uuid: user.id
          })
          .range(offset, offset + limit - 1)

        if (searchError) {
          console.error('Search error:', searchError)
          return {
            items: [],
            totalCount: 0,
            hasMore: false
          }
        }

        return {
          items: searchResults?.map(this.dbRowToContentItem) || [],
          totalCount: searchResults?.length || 0,
          hasMore: searchResults?.length === limit
        }
      }

      // Regular query with pagination
      const { data, error, count } = await queryBuilder
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Query error:', error)
        return {
          items: [],
          totalCount: 0,
          hasMore: false
        }
      }

      return {
        items: data?.map(this.dbRowToContentItem) || [],
        totalCount: count || 0,
        hasMore: (count || 0) > offset + limit
      }

    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      return {
        items: [],
        totalCount: 0,
        hasMore: false
      }
    }
  }

  /**
   * Get a single bookmark by ID
   */
  static async getBookmark(id: string): Promise<ContentItem | null> {
    try {
      const supabase = this.supabase
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return null
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        return null
      }

      return this.dbRowToContentItem(data)

    } catch (error) {
      console.error('Error fetching bookmark:', error)
      return null
    }
  }

  /**
   * Update a bookmark
   */
  static async updateBookmark(id: string, updates: Partial<ContentItem>): Promise<BookmarkSaveResult> {
    try {
      const supabase = this.supabase
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return {
          success: false,
          error: 'Authentication required'
        }
      }

      const updateData: any = {}
      
      if (updates.title) updateData.title = updates.title
      if (updates.content) updateData.content = updates.content
      if (updates.tags) updateData.tags = updates.tags
      if (updates.imageUrl) updateData.image_url = updates.imageUrl
      if (updates.metadata) updateData.metadata = updates.metadata

      const { data, error } = await supabase
        .from('bookmarks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: `Failed to update bookmark: ${error.message}`
        }
      }

      return {
        success: true,
        content: this.dbRowToContentItem(data)
      }

    } catch (error) {
      console.error('Error updating bookmark:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Delete a bookmark
   */
  static async deleteBookmark(id: string): Promise<boolean> {
    try {
      const supabase = this.supabase
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return false
      }

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      return !error

    } catch (error) {
      console.error('Error deleting bookmark:', error)
      return false
    }
  }

  /**
   * Subscribe to real-time bookmark changes
   */
  static subscribeToBookmarks(callback: (bookmarks: ContentItem[]) => void) {
    const supabase = this.supabase
    
    const subscription = supabase
      .channel('bookmarks')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks' 
        }, 
        () => {
          // Refresh bookmarks when any change occurs
          this.getBookmarks().then(result => {
            callback(result.items)
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  // Private helper methods

  private static dbRowToContentItem(row: any): ContentItem {
    return {
      id: row.id,
      type: row.content_type as ContentType,
      title: row.title,
      content: row.content,
      url: row.url,
      imageUrl: row.image_url,
      tags: row.tags || [],
      aiTags: row.ai_tags || [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      userId: row.user_id,
      metadata: row.metadata || {}
    }
  }

  private static async enrichMetadata(url: string, baseMetadata: Partial<ContentMetadata>): Promise<ContentMetadata> {
    // This is the same logic as in the original bookmark service
    // In a real implementation, you'd fetch actual metadata from the URL
    
    const enriched: ContentMetadata = { ...baseMetadata }
    
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.toLowerCase()
      
      // Mock enrichment based on domain patterns
      if (domain.includes('amazon.')) {
        enriched.price = '$29.99'
        enriched.brand = 'Brand Name'
        enriched.availability = 'In Stock'
        enriched.category = 'Electronics'
      } else if (domain.includes('goodreads.')) {
        enriched.author = 'Author Name'
        enriched.publisher = 'Publisher Name'
        enriched.rating = 4.5
        enriched.genre = 'Fiction'
        enriched.publishDate = '2024'
      } else if (domain.includes('netflix.') || domain.includes('imdb.')) {
        enriched.imdbRating = 8.5
        enriched.releaseYear = '2024'
        enriched.genre_entertainment = 'Drama'
        enriched.duration = '120 min'
        enriched.summary = 'A compelling story about...'
      } else if (domain.includes('zillow.') || domain.includes('realtor.')) {
        enriched.propertyPrice = '$450,000'
        enriched.bedrooms = 3
        enriched.bathrooms = 2
        enriched.squareFootage = '1,850 sq ft'
        enriched.location = 'City, State'
        enriched.propertyType = 'Single Family Home'
      } else if (domain.includes('twitter.') || domain.includes('x.com')) {
        enriched.tweetAuthor = 'User Name'
        enriched.tweetHandle = 'username'
        enriched.tweetDate = new Date().toISOString()
        enriched.likes = Math.floor(Math.random() * 1000)
        enriched.retweets = Math.floor(Math.random() * 100)
      } else if (this.isArticleDomain(domain)) {
        enriched.publication = this.getPublicationName(domain)
        enriched.publishedDate = new Date().toISOString()
        enriched.readingTime = Math.floor(Math.random() * 10) + 1
        enriched.excerpt = 'This article explores...'
      }
      
      enriched.domain = domain
      enriched.sourceUrl = url
      
    } catch (error) {
      console.error('Error enriching metadata:', error)
    }
    
    return enriched
  }

  private static async generateTitle(url: string, contentType: ContentType): Promise<string> {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    
    switch (contentType) {
      case 'book':
        return 'Book Title from ' + domain
      case 'product':
        return 'Product Name from ' + domain
      case 'article':
        return 'Article Title from ' + domain
      case 'property':
        return 'Property Listing from ' + domain
      case 'tv_show':
        return 'TV Show from ' + domain
      case 'tweet':
        return 'Tweet from ' + domain
      default:
        return domain + ' - Website'
    }
  }

  private static generateContentPreview(url: string, contentType: ContentType): string {
    switch (contentType) {
      case 'book':
        return 'A book I want to read...'
      case 'product':
        return 'A product I\'m interested in...'
      case 'article':
        return 'An article I\'m reading...'
      case 'property':
        return 'A property I\'m considering...'
      case 'tv_show':
        return 'A show I want to watch...'
      case 'tweet':
        return 'An interesting tweet...'
      case 'website':
        return 'A website I find useful...'
      default:
        return 'Saved from ' + new URL(url).hostname
    }
  }

  private static async generateAITags(contentType: ContentType, title: string, url: string): Promise<string[]> {
    const baseTags: string[] = []
    
    switch (contentType) {
      case 'book':
        baseTags.push('reading', 'literature')
        break
      case 'product':
        baseTags.push('shopping', 'purchase')
        break
      case 'article':
        baseTags.push('reading', 'information')
        break
      case 'property':
        baseTags.push('real-estate', 'housing')
        break
      case 'tv_show':
        baseTags.push('entertainment', 'watching')
        break
      case 'tweet':
        baseTags.push('social-media', 'discussion')
        break
      case 'website':
        baseTags.push('reference', 'resource')
        break
    }
    
    const domain = new URL(url).hostname.toLowerCase()
    if (domain.includes('amazon')) baseTags.push('amazon')
    if (domain.includes('netflix')) baseTags.push('netflix')
    if (domain.includes('youtube')) baseTags.push('youtube', 'video')
    if (domain.includes('github')) baseTags.push('github', 'development')
    
    return baseTags
  }

  private static generatePreviewImage(url: string): string | undefined {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()
    
    if (domain.includes('amazon.')) {
      return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    } else if (domain.includes('netflix.')) {
      return 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop'
    }
    
    return undefined
  }

  private static isArticleDomain(domain: string): boolean {
    const articleDomains = [
      'medium.com', 'substack.com', 'dev.to', 'hashnode.com',
      'blog.', 'news.', 'article.', 'post.'
    ]
    
    return articleDomains.some(d => domain.includes(d))
  }

  private static getPublicationName(domain: string): string {
    if (domain.includes('medium.com')) return 'Medium'
    if (domain.includes('substack.com')) return 'Substack'
    if (domain.includes('dev.to')) return 'DEV Community'
    if (domain.includes('hashnode.com')) return 'Hashnode'
    
    const parts = domain.split('.')
    if (parts[0] === 'blog' && parts.length > 2) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1) + ' Blog'
    }
    
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  }

  /**
   * Quick save method for browser extension or bookmarklet
   */
  static async quickSave(url: string, title?: string): Promise<BookmarkSaveResult> {
    return this.saveBookmark({
      url,
      title,
      tags: [],
      notes: ''
    })
  }
}