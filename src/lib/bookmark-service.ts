import { ContentItem, ContentType, ContentMetadata } from '@/types'
import { URLAnalyzer } from './url-analyzer'

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

/**
 * BookmarkService handles the smart bookmarking functionality
 * similar to MyMind's automatic content recognition and categorization
 */
export class BookmarkService {
  /**
   * Saves a bookmark with smart content detection and metadata extraction
   */
  static async saveBookmark(request: BookmarkSaveRequest): Promise<BookmarkSaveResult> {
    try {
      // Step 1: Analyze the URL to determine content type and basic metadata
      const analysis = await URLAnalyzer.analyzeURL(request.url)
      
      // Step 2: Fetch additional metadata from the URL
      const enrichedMetadata = await this.enrichMetadata(request.url, analysis.metadata)
      
      // Step 3: Generate title if not provided
      const title = request.title || await this.generateTitle(request.url, analysis.contentType)
      
      // Step 4: Create the content item
      const contentItem: ContentItem = {
        id: this.generateId(),
        type: analysis.contentType,
        title: title,
        content: this.generateContentPreview(request.url, analysis.contentType),
        url: request.url,
        imageUrl: enrichedMetadata.bookCover || enrichedMetadata.poster || this.generatePreviewImage(request.url),
        tags: request.tags || [],
        aiTags: await this.generateAITags(analysis.contentType, title, request.url),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'current-user', // In a real app, get from auth context
        metadata: enrichedMetadata
      }
      
      // Step 5: Save to storage (in a real app, this would be a database call)
      await this.saveToStorage(contentItem)
      
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
   * Enriches metadata by attempting to fetch additional information from the URL
   */
  private static async enrichMetadata(url: string, baseMetadata: Partial<ContentMetadata>): Promise<ContentMetadata> {
    // In a real implementation, this would make HTTP requests to fetch:
    // - Open Graph metadata
    // - Twitter Card metadata  
    // - Schema.org structured data
    // - API calls to specific services (Amazon, IMDB, etc.)
    
    const enriched: ContentMetadata = { ...baseMetadata }
    
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.toLowerCase()
      
      // Mock enrichment based on domain patterns
      if (domain.includes('amazon.')) {
        // Mock Amazon product data
        enriched.price = '$29.99'
        enriched.brand = 'Brand Name'
        enriched.availability = 'In Stock'
        enriched.category = 'Electronics'
      } else if (domain.includes('goodreads.')) {
        // Mock book data
        enriched.author = 'Author Name'
        enriched.publisher = 'Publisher Name'
        enriched.rating = 4.5
        enriched.genre = 'Fiction'
        enriched.publishDate = '2024'
      } else if (domain.includes('netflix.') || domain.includes('imdb.')) {
        // Mock movie/TV data
        enriched.imdbRating = 8.5
        enriched.releaseYear = '2024'
        enriched.genre_entertainment = 'Drama'
        enriched.duration = '120 min'
        enriched.summary = 'A compelling story about...'
      } else if (domain.includes('zillow.') || domain.includes('realtor.')) {
        // Mock property data
        enriched.propertyPrice = '$450,000'
        enriched.bedrooms = 3
        enriched.bathrooms = 2
        enriched.squareFootage = '1,850 sq ft'
        enriched.location = 'City, State'
        enriched.propertyType = 'Single Family Home'
      } else if (domain.includes('twitter.') || domain.includes('x.com')) {
        // Mock tweet data
        enriched.tweetAuthor = 'User Name'
        enriched.tweetHandle = 'username'
        enriched.tweetDate = new Date().toISOString()
        enriched.likes = Math.floor(Math.random() * 1000)
        enriched.retweets = Math.floor(Math.random() * 100)
      } else if (this.isArticleDomain(domain)) {
        // Mock article data
        enriched.publication = this.getPublicationName(domain)
        enriched.publishedDate = new Date().toISOString()
        enriched.readingTime = Math.floor(Math.random() * 10) + 1
        enriched.excerpt = 'This article explores...'
      }
      
      // Always set basic metadata
      enriched.domain = domain
      enriched.sourceUrl = url
      
    } catch (error) {
      console.error('Error enriching metadata:', error)
    }
    
    return enriched
  }
  
  /**
   * Generates a title for the bookmark if none is provided
   */
  private static async generateTitle(url: string, contentType: ContentType): Promise<string> {
    // In a real implementation, this would:
    // 1. Fetch the HTML page
    // 2. Extract the <title> tag
    // 3. Clean it up and format it appropriately
    
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    
    // Mock title generation based on content type
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
  
  /**
   * Generates a content preview based on the content type
   */
  private static generateContentPreview(url: string, contentType: ContentType): string {
    switch (contentType) {
      case 'book':
        return 'A book I want to read...'
      case 'product':
        return 'A product I&apos;m interested in...'
      case 'article':
        return 'An article I&apos;m reading...'
      case 'property':
        return 'A property I&apos;m considering...'
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
  
  /**
   * Generates AI tags based on content analysis
   */
  private static async generateAITags(contentType: ContentType, title: string, url: string): Promise<string[]> {
    // In a real implementation, this would use AI/ML to analyze content and generate relevant tags
    const baseTags: string[] = []
    
    // Add content-type specific tags
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
    
    // Add domain-based tags
    const domain = new URL(url).hostname.toLowerCase()
    if (domain.includes('amazon')) baseTags.push('amazon')
    if (domain.includes('netflix')) baseTags.push('netflix')
    if (domain.includes('youtube')) baseTags.push('youtube', 'video')
    if (domain.includes('github')) baseTags.push('github', 'development')
    
    return baseTags
  }
  
  /**
   * Generates a preview image URL for the content
   */
  private static generatePreviewImage(url: string): string | undefined {
    // In a real implementation, this would:
    // 1. Check for Open Graph images
    // 2. Use a screenshot service
    // 3. Look for the largest image on the page
    
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()
    
    // Return placeholder images based on domain
    if (domain.includes('amazon.')) {
      return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    } else if (domain.includes('netflix.')) {
      return 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop'
    }
    
    return undefined
  }
  
  /**
   * Saves the content item to storage
   */
  private static async saveToStorage(contentItem: ContentItem): Promise<void> {
    // In a real implementation, this would save to a database
    // For now, we'll just log it
    console.log('Saving bookmark:', contentItem)
    
    // You could also save to localStorage for demo purposes:
    // const existingBookmarks = JSON.parse(localStorage.getItem('mindsync_bookmarks') || '[]')
    // existingBookmarks.push(contentItem)
    // localStorage.setItem('mindsync_bookmarks', JSON.stringify(existingBookmarks))
  }
  
  /**
   * Generates a unique ID for the content item
   */
  private static generateId(): string {
    return 'bookmark_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  /**
   * Checks if a domain typically hosts articles
   */
  private static isArticleDomain(domain: string): boolean {
    const articleDomains = [
      'medium.com', 'substack.com', 'dev.to', 'hashnode.com',
      'blog.', 'news.', 'article.', 'post.'
    ]
    
    return articleDomains.some(d => domain.includes(d))
  }
  
  /**
   * Gets a publication name from a domain
   */
  private static getPublicationName(domain: string): string {
    if (domain.includes('medium.com')) return 'Medium'
    if (domain.includes('substack.com')) return 'Substack'
    if (domain.includes('dev.to')) return 'DEV Community'
    if (domain.includes('hashnode.com')) return 'Hashnode'
    
    // Extract from domain (e.g., "blog.example.com" -> "Example Blog")
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