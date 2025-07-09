import { ContentType, ContentMetadata } from '@/types'

// URL patterns for different content types
const URL_PATTERNS = {
  book: [
    /amazon\.com\/.*\/dp\/[A-Z0-9]+/,
    /goodreads\.com\/book\/show/,
    /barnesandnoble\.com\/w\//,
    /bookdepository\.com\/.*\/book\//
  ],
  product: [
    /amazon\.com\/.*\/dp\/[B][A-Z0-9]+/,
    /etsy\.com\/listing\//,
    /shopify\.com/,
    /nike\.com\/.*\/product/,
    /adidas\.com\/.*\/product/,
    /zara\.com\/.*\/product/
  ],
  article: [
    /medium\.com\/@.*\/.*-[a-f0-9]+/,
    /substack\.com\/p\//,
    /.*\.com\/blog\//,
    /.*\.com\/article\//,
    /.*\.com\/.*\/\d{4}\/\d{2}\/\d{2}\//
  ],
  property: [
    /zillow\.com\/homedetails\//,
    /realtor\.com\/realestateandhomes-detail\//,
    /redfin\.com\/.*\/home\//,
    /apartments\.com\/.*\/\d+/
  ],
  tv_show: [
    /netflix\.com\/title\//,
    /imdb\.com\/title\/tt\d+/,
    /hulu\.com\/watch\//,
    /disney\.com\/.*\/movies/,
    /hbo\.com\/.*\/movies/
  ],
  tweet: [
    /twitter\.com\/.*\/status\/\d+/,
    /x\.com\/.*\/status\/\d+/
  ]
}

// Domain-based content type detection
const DOMAIN_PATTERNS = {
  book: ['amazon.com', 'goodreads.com', 'barnesandnoble.com', 'bookdepository.com'],
  product: ['etsy.com', 'shopify.com', 'nike.com', 'adidas.com', 'zara.com'],
  article: ['medium.com', 'substack.com'],
  property: ['zillow.com', 'realtor.com', 'redfin.com', 'apartments.com'],
  tv_show: ['netflix.com', 'imdb.com', 'hulu.com', 'disney.com', 'hbo.com'],
  tweet: ['twitter.com', 'x.com']
}

export interface URLAnalysisResult {
  contentType: ContentType
  confidence: number
  metadata: Partial<ContentMetadata>
}

export class URLAnalyzer {
  /**
   * Analyzes a URL and determines its content type and metadata
   */
  static async analyzeURL(url: string): Promise<URLAnalysisResult> {
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.toLowerCase()
      
      // First, try pattern matching
      const patternResult = this.analyzeByPattern(url)
      if (patternResult.confidence > 0.8) {
        return patternResult
      }
      
      // Then try domain-based detection
      const domainResult = this.analyzeByDomain(domain)
      if (domainResult.confidence > 0.6) {
        return domainResult
      }
      
      // If we can't determine the type, try to fetch metadata
      const metadataResult = await this.analyzeByMetadata(url)
      return metadataResult
      
    } catch (error) {
      console.error('Error analyzing URL:', error)
      return {
        contentType: 'website',
        confidence: 0.3,
        metadata: {
          domain: new URL(url).hostname
        }
      }
    }
  }
  
  /**
   * Analyzes URL using regex patterns
   */
  private static analyzeByPattern(url: string): URLAnalysisResult {
    for (const [contentType, patterns] of Object.entries(URL_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(url)) {
          return {
            contentType: contentType as ContentType,
            confidence: 0.9,
            metadata: this.extractBasicMetadata(url, contentType as ContentType)
          }
        }
      }
    }
    
    return {
      contentType: 'website',
      confidence: 0.0,
      metadata: {}
    }
  }
  
  /**
   * Analyzes URL using domain patterns
   */
  private static analyzeByDomain(domain: string): URLAnalysisResult {
    for (const [contentType, domains] of Object.entries(DOMAIN_PATTERNS)) {
      if (domains.some(d => domain.includes(d))) {
        return {
          contentType: contentType as ContentType,
          confidence: 0.7,
          metadata: {
            domain: domain
          }
        }
      }
    }
    
    return {
      contentType: 'website',
      confidence: 0.0,
      metadata: {
        domain: domain
      }
    }
  }
  
  /**
   * Analyzes URL by fetching and parsing HTML metadata
   */
  private static async analyzeByMetadata(url: string): Promise<URLAnalysisResult> {
    try {
      // In a real implementation, you'd fetch the URL and parse meta tags
      // For now, we'll simulate this based on common patterns
      const urlObj = new URL(url)
      
      // Simple heuristics based on URL structure
      if (url.includes('/product') || url.includes('/item') || url.includes('shop')) {
        return {
          contentType: 'product',
          confidence: 0.6,
          metadata: {
            domain: urlObj.hostname
          }
        }
      }
      
      if (url.includes('/article') || url.includes('/blog') || url.includes('/news')) {
        return {
          contentType: 'article',
          confidence: 0.6,
          metadata: {
            domain: urlObj.hostname
          }
        }
      }
      
      return {
        contentType: 'website',
        confidence: 0.5,
        metadata: {
          domain: urlObj.hostname
        }
      }
      
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return {
        contentType: 'website',
        confidence: 0.3,
        metadata: {}
      }
    }
  }
  
  /**
   * Extracts basic metadata from URL based on content type
   */
  private static extractBasicMetadata(url: string, contentType: ContentType): Partial<ContentMetadata> {
    const urlObj = new URL(url)
    const metadata: Partial<ContentMetadata> = {
      sourceUrl: url,
      domain: urlObj.hostname
    }
    
    switch (contentType) {
      case 'book':
        // Extract ASIN/ISBN if it's an Amazon link
        const asinMatch = url.match(/\/dp\/([A-Z0-9]+)/)
        if (asinMatch) {
          metadata.isbn = asinMatch[1]
        }
        break
        
      case 'product':
        // Extract product ID if available
        const productMatch = url.match(/\/dp\/([B][A-Z0-9]+)/)
        if (productMatch) {
          metadata.category = 'electronics' // Default assumption for Amazon B-type ASINs
        }
        break
        
      case 'tweet':
        // Extract tweet ID
        const tweetMatch = url.match(/status\/(\d+)/)
        if (tweetMatch) {
          metadata.tweetDate = new Date().toISOString()
        }
        break
        
      case 'property':
        // Extract basic property info from URL if available
        if (url.includes('zillow.com')) {
          metadata.propertyType = 'residential'
        }
        break
    }
    
    return metadata
  }
  
  /**
   * Gets a display name for a content type
   */
  static getContentTypeDisplayName(contentType: ContentType): string {
    const displayNames: Record<ContentType, string> = {
      note: 'Note',
      link: 'Link',
      image: 'Image',
      quote: 'Quote',
      code: 'Code',
      book: 'Book',
      product: 'Product',
      article: 'Article',
      property: 'Property',
      tv_show: 'TV Show',
      website: 'Website',
      tweet: 'Tweet'
    }
    
    return displayNames[contentType] || 'Unknown'
  }
  
  /**
   * Gets an icon name for a content type (for use with Tabler icons)
   */
  static getContentTypeIcon(contentType: ContentType): string {
    const iconNames: Record<ContentType, string> = {
      note: 'IconNote',
      link: 'IconLink',
      image: 'IconPhoto',
      quote: 'IconQuote',
      code: 'IconCode',
      book: 'IconBook',
      product: 'IconShoppingCart',
      article: 'IconArticle',
      property: 'IconHome',
      tv_show: 'IconDeviceTv',
      website: 'IconWorld',
      tweet: 'IconBrandTwitter'
    }
    
    return iconNames[contentType] || 'IconFile'
  }
}