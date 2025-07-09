import { ContentItem, AIInsight, ContentConnection, User } from '@/types'

// Generate mock user
export const mockUser: User = {
  id: 'user-1',
  email: 'alex@example.com',
  name: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  preferences: {
    theme: 'light',
    aiInsightsEnabled: true,
    notificationsEnabled: true,
    autoTagging: true,
    contentTypes: ['note', 'link', 'image', 'quote', 'code', 'book', 'product', 'article', 'property', 'tv_show', 'website', 'tweet'],
  },
  createdAt: new Date('2024-01-01'),
}

// Generate diverse mock content items with realistic interconnections
export const mockContentItems: ContentItem[] = [
  // Smart Bookmark Examples (MyMind style)
  
  // Designer Product - Handbag
  {
    id: 'bookmark-1',
    type: 'product',
    title: 'Large Arco Tote Bag',
    content: 'Premium leather tote bag with geometric quilted design. Perfect for everyday use with laptop compartment.',
    url: 'https://bottegaveneta.com/arco-tote-bag',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
    tags: ['fashion', 'handbag', 'luxury', 'bottega-veneta'],
    aiTags: ['designer-bag', 'investment-piece', 'accessories'],
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    userId: mockUser.id,
    metadata: {
      price: '$2,900',
      brand: 'Bottega Veneta',
      category: 'Handbags',
      availability: 'In Stock',
      designer: 'Bottega Veneta',
      domain: 'bottegaveneta.com',
    },
  },

  // Quote/Sticky Note
  {
    id: 'bookmark-2',
    type: 'quote',
    title: 'Motivation on Persistence',
    content: "There's a world of difference between insisting on someone's doing something and establishing an atmosphere in which that person can grow into wanting to do it.",
    tags: ['motivation', 'leadership', 'growth'],
    aiTags: ['leadership-philosophy', 'personal-development', 'team-building'],
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    userId: mockUser.id,
    metadata: {
      author: 'Fred Rogers',
    },
  },

  // Tweet about MyMind
  {
    id: 'bookmark-3',
    type: 'tweet',
    title: 'Tweet about MyMind tool',
    content: 'The best tool the internet has given me in the past few years is @mymind — it&apos;s the service I am the happiest to pay for.',
    url: 'https://twitter.com/naomi/status/1234567890',
    tags: ['productivity', 'tools', 'recommendation'],
    aiTags: ['knowledge-management', 'digital-tools', 'user-testimonial'],
    createdAt: new Date('2024-02-11'),
    updatedAt: new Date('2024-02-11'),
    userId: mockUser.id,
    metadata: {
      tweetAuthor: 'Naomi Accardi',
      tweetHandle: 'naomi',
      tweetDate: '2024-02-11',
      likes: 847,
      retweets: 123,
      domain: 'twitter.com',
    },
  },

  // Book
  {
    id: 'bookmark-4',
    type: 'book',
    title: 'Atomic Habits',
    content: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear',
    url: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    tags: ['habits', 'productivity', 'self-improvement', 'reading-list'],
    aiTags: ['behavior-change', 'personal-development', 'psychology'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    userId: mockUser.id,
    metadata: {
      author: 'James Clear',
      isbn: '0735211299',
      publisher: 'Avery',
      publishDate: '2018',
      rating: 4.8,
      genre: 'Self-Help',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      domain: 'amazon.com',
    },
  },

  // TV Show
  {
    id: 'bookmark-5',
    type: 'tv_show',
    title: 'The Bear',
    content: 'A young chef from the fine dining world returns to Chicago to run his family&apos;s Italian beef sandwich shop.',
    url: 'https://www.hulu.com/series/the-bear',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
    tags: ['cooking', 'drama', 'tv-show', 'watchlist'],
    aiTags: ['culinary-arts', 'family-business', 'chicago'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    userId: mockUser.id,
    metadata: {
      imdbRating: 8.5,
      releaseYear: '2022',
      genre_entertainment: 'Drama/Comedy',
      duration: '30 min',
      summary: 'A young chef from the fine dining world returns to Chicago to run his family&apos;s Italian beef sandwich shop.',
      poster: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
      domain: 'hulu.com',
    },
  },

  // Property Listing
  {
    id: 'bookmark-6',
    type: 'property',
    title: 'Modern Loft in Downtown',
    content: 'Stunning 2-bedroom loft with exposed brick, high ceilings, and city views. Recently renovated with modern amenities.',
    url: 'https://www.zillow.com/homedetails/123-main-st-new-york-ny-10001/12345_zpid/',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    tags: ['real-estate', 'loft', 'downtown', 'investment'],
    aiTags: ['urban-living', 'modern-architecture', 'city-apartment'],
    createdAt: new Date('2024-02-09'),
    updatedAt: new Date('2024-02-09'),
    userId: mockUser.id,
    metadata: {
      propertyPrice: '$450,000',
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: '1,200 sq ft',
      location: 'Downtown, New York, NY',
      propertyType: 'Loft',
      domain: 'zillow.com',
    },
  },

  // Article
  {
    id: 'bookmark-7',
    type: 'article',
    title: 'The Future of Remote Work',
    content: 'How distributed teams are reshaping the modern workplace and what it means for productivity and collaboration.',
    url: 'https://www.fastcompany.com/future-remote-work-2024',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
    tags: ['remote-work', 'future-of-work', 'productivity'],
    aiTags: ['distributed-teams', 'workplace-innovation', 'digital-transformation'],
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    userId: mockUser.id,
    metadata: {
      publication: 'Fast Company',
      author: 'Jessica Thompson',
      publishedDate: '2024-02-08',
      readingTime: 7,
      excerpt: 'How distributed teams are reshaping the modern workplace and what it means for productivity and collaboration.',
      domain: 'fastcompany.com',
    },
  },

  // Another Product - Sneakers
  {
    id: 'bookmark-8',
    type: 'product',
    title: 'Classic White Sneakers',
    content: 'Timeless white leather sneakers with red laces. Perfect for casual wear and street style.',
    url: 'https://www.nike.com/classic-white-sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    tags: ['sneakers', 'footwear', 'fashion', 'casual'],
    aiTags: ['streetwear', 'athletic-fashion', 'everyday-style'],
    createdAt: new Date('2024-02-07'),
    updatedAt: new Date('2024-02-07'),
    userId: mockUser.id,
    metadata: {
      price: '€325',
      brand: 'Nike',
      category: 'Footwear',
      availability: 'Limited Stock',
      domain: 'nike.com',
    },
  },

  // Website
  {
    id: 'bookmark-9',
    type: 'website',
    title: 'Minimalist Interior Design Inspiration',
    content: 'A curated collection of minimalist interior design ideas and inspiration for modern homes.',
    url: 'https://www.dezeen.com/minimalist-interiors',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    tags: ['interior-design', 'minimalism', 'inspiration', 'home'],
    aiTags: ['scandinavian-design', 'clean-aesthetics', 'home-decor'],
    createdAt: new Date('2024-02-06'),
    updatedAt: new Date('2024-02-06'),
    userId: mockUser.id,
    metadata: {
      siteName: 'Dezeen',
      description: 'A curated collection of minimalist interior design ideas and inspiration for modern homes.',
      domain: 'dezeen.com',
    },
  },

  // Video/Educational Content
  {
    id: 'bookmark-10',
    type: 'article',
    title: 'One video, article or side project can change everything',
    content: 'How a single piece of content or project can transform your career and open unexpected opportunities.',
    url: 'https://www.youtube.com/watch?v=example123',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    tags: ['career-advice', 'content-creation', 'opportunities'],
    aiTags: ['personal-branding', 'career-growth', 'creative-impact'],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    userId: mockUser.id,
    metadata: {
      publication: 'YouTube',
      readingTime: 12,
      excerpt: 'How a single piece of content or project can transform your career and open unexpected opportunities.',
      domain: 'youtube.com',
    },
  },
  // Research Notes
  {
    id: 'content-1',
    type: 'note',
    title: 'Design Systems and Component Libraries',
    content: 'Design systems provide a unified language and set of guidelines for building consistent user interfaces. Key benefits include faster development, better consistency, and improved collaboration between design and development teams. Modern design systems like Material Design, Ant Design, and Chakra UI have revolutionized how we approach UI development.',
    tags: ['design-systems', 'ui-ux', 'frontend'],
    aiTags: ['component-architecture', 'design-consistency', 'development-efficiency'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    userId: mockUser.id,
    metadata: {
      wordCount: 58,
      readingTime: 1,
    },
  },
  
  // Code Snippet
  {
    id: 'content-2',
    type: 'code',
    title: 'React Custom Hook for Local Storage',
    content: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}`,
    tags: ['react', 'hooks', 'typescript', 'localstorage'],
    aiTags: ['state-management', 'data-persistence', 'error-handling'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    userId: mockUser.id,
    metadata: {
      codeLanguage: 'typescript',
      wordCount: 89,
    },
  },

  // Link with metadata
  {
    id: 'content-3',
    type: 'link',
    title: 'The Psychology of Design: How to make people think',
    content: 'Excellent article about cognitive load and user experience design principles. Discusses how mental models affect user behavior and decision-making in digital interfaces.',
    url: 'https://example.com/psychology-of-design',
    tags: ['psychology', 'ux-design', 'cognitive-load'],
    aiTags: ['user-behavior', 'mental-models', 'decision-making'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    userId: mockUser.id,
    metadata: {
      domain: 'ux-magazine.com',
      author: 'Sarah Johnson',
      readingTime: 8,
    },
  },

  // Image note
  {
    id: 'content-4',
    type: 'image',
    title: 'Color Theory Wheel Reference',
    content: 'Visual reference for understanding complementary, analogous, and triadic color schemes. Useful for making design decisions.',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    tags: ['color-theory', 'design', 'reference'],
    aiTags: ['visual-hierarchy', 'brand-consistency', 'accessibility'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    userId: mockUser.id,
    metadata: {
      imageAlt: 'Color wheel showing primary, secondary, and tertiary colors',
    },
  },

  // Quote
  {
    id: 'content-5',
    type: 'quote',
    title: 'Steve Jobs on Design Philosophy',
    content: '"Design is not just what it looks like and feels like. Design is how it works."',
    tags: ['quotes', 'design-philosophy', 'steve-jobs'],
    aiTags: ['functional-design', 'user-experience', 'minimalism'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    userId: mockUser.id,
    metadata: {
      author: 'Steve Jobs',
      sourceUrl: 'https://example.com/steve-jobs-interview',
    },
  },

  // Research Note - AI/ML related
  {
    id: 'content-6',
    type: 'note',
    title: 'Vector Embeddings for Semantic Search',
    content: 'Vector embeddings transform text into numerical representations that capture semantic meaning. This enables similarity search where documents with similar meanings are clustered together in vector space, even if they use different words. Popular models include OpenAI embeddings, sentence-transformers, and Google Universal Sentence Encoder.',
    tags: ['ai', 'machine-learning', 'embeddings', 'search'],
    aiTags: ['semantic-similarity', 'natural-language-processing', 'information-retrieval'],
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    userId: mockUser.id,
    metadata: {
      wordCount: 52,
      readingTime: 1,
    },
  },

  // Long form content (edge case)
  {
    id: 'content-7',
    type: 'note',
    title: 'The Future of Human-Computer Interaction',
    content: 'Human-computer interaction is evolving rapidly with the integration of AI, voice interfaces, gesture recognition, and brain-computer interfaces. We are moving towards more natural, intuitive ways of interacting with technology. Voice assistants like Siri and Alexa have already changed how we interact with devices, making technology more accessible to a broader audience. Gesture recognition technology allows for touchless interaction, which became particularly relevant during the pandemic. Brain-computer interfaces, while still in early stages, promise revolutionary changes in how we control digital systems. The future likely holds multimodal interfaces that combine voice, gesture, touch, and even thought-based controls. This evolution requires us to rethink traditional UI/UX paradigms and consider new design principles that account for context-aware, adaptive interfaces. The challenge for designers and developers is to create systems that feel natural and reduce cognitive load while being powerful enough to handle complex tasks.',
    tags: ['hci', 'future-tech', 'ai', 'interfaces'],
    aiTags: ['multimodal-interaction', 'adaptive-interfaces', 'accessibility'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    userId: mockUser.id,
    metadata: {
      wordCount: 178,
      readingTime: 4,
    },
  },

  // Another code snippet
  {
    id: 'content-8',
    type: 'code',
    title: 'CSS Grid Layout for Responsive Design',
    content: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}`,
    tags: ['css', 'grid', 'responsive-design', 'frontend'],
    aiTags: ['layout-systems', 'mobile-optimization', 'modern-css'],
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-03'),
    userId: mockUser.id,
    metadata: {
      codeLanguage: 'css',
    },
  },

  // Design-related link
  {
    id: 'content-9',
    type: 'link',
    title: 'Atomic Design Methodology',
    content: 'Brad Frost\'s atomic design methodology breaks down interfaces into fundamental building blocks: atoms, molecules, organisms, templates, and pages.',
    url: 'https://bradfrost.com/blog/post/atomic-web-design/',
    tags: ['atomic-design', 'design-systems', 'methodology'],
    aiTags: ['component-hierarchy', 'systematic-design', 'scalability'],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    userId: mockUser.id,
    metadata: {
      domain: 'bradfrost.com',
      author: 'Brad Frost',
      readingTime: 12,
    },
  },

  // Productivity note
  {
    id: 'content-10',
    type: 'note',
    title: 'The Pomodoro Technique for Deep Work',
    content: 'The Pomodoro Technique involves working in focused 25-minute intervals followed by 5-minute breaks. After 4 pomodoros, take a longer 15-30 minute break. This technique helps maintain focus and prevents burnout, especially useful for coding and design work.',
    tags: ['productivity', 'time-management', 'focus'],
    aiTags: ['work-optimization', 'attention-management', 'cognitive-performance'],
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    userId: mockUser.id,
    metadata: {
      wordCount: 45,
      readingTime: 1,
    },
  },

  // Recent AI insight
  {
    id: 'content-11',
    type: 'note',
    title: 'Pattern: Design Systems + AI = Scalable Interfaces',
    content: 'I\'ve noticed an emerging pattern: teams that combine robust design systems with AI-powered tools are creating more scalable and consistent interfaces faster than ever. The design system provides the constraints and guidelines, while AI helps generate variations and maintain consistency at scale.',
    tags: ['ai', 'design-systems', 'scalability', 'automation'],
    aiTags: ['human-ai-collaboration', 'design-automation', 'systematic-thinking'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    userId: mockUser.id,
    metadata: {
      wordCount: 48,
      readingTime: 1,
    },
  },
]

// Generate AI insights that demonstrate pattern discovery
export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'pattern',
    title: 'Design System Theme Emerging',
    description: 'You\'ve been consistently saving content about design systems, component libraries, and systematic approaches to UI development. This suggests a growing interest in scalable design methodologies.',
    confidence: 0.89,
    relatedContentIds: ['content-1', 'content-9', 'content-11'],
    createdAt: new Date('2024-02-08'),
    isRead: false,
  },
  {
    id: 'insight-2',
    type: 'connection',
    title: 'Code + Design Convergence',
    description: 'Your React hook for localStorage and CSS Grid layout both relate to creating reusable, systematic solutions. You might be interested in exploring design tokens and component architecture.',
    confidence: 0.76,
    relatedContentIds: ['content-2', 'content-8', 'content-1'],
    createdAt: new Date('2024-02-05'),
    isRead: true,
  },
  {
    id: 'insight-3',
    type: 'suggestion',
    title: 'Explore AI-Powered Design Tools',
    description: 'Based on your interest in both AI/ML concepts and design systems, you might want to explore tools like GitHub Copilot for design systems, Figma AI plugins, or automated design token generation.',
    confidence: 0.82,
    relatedContentIds: ['content-6', 'content-11', 'content-1'],
    createdAt: new Date('2024-02-10'),
    isRead: false,
  },
  {
    id: 'insight-4',
    type: 'summary',
    title: 'Your Learning Journey This Month',
    description: 'This month you\'ve explored design systems, AI/ML concepts, and productivity techniques. There\'s a clear progression from theoretical concepts to practical implementation, with a focus on systematic approaches to problem-solving.',
    confidence: 0.94,
    relatedContentIds: ['content-1', 'content-6', 'content-10', 'content-11'],
    createdAt: new Date('2024-02-09'),
    isRead: true,
  },
]

// Generate content connections showing relationships
export const mockContentConnections: ContentConnection[] = [
  {
    id: 'connection-1',
    sourceId: 'content-1',
    targetId: 'content-9',
    relationship: 'builds_on',
    strength: 0.91,
    reason: 'Both discuss systematic approaches to design - design systems and atomic design methodology complement each other',
    discoveredAt: new Date('2024-02-05'),
  },
  {
    id: 'connection-2',
    sourceId: 'content-2',
    targetId: 'content-8',
    relationship: 'similar_topic',
    strength: 0.73,
    reason: 'Both are code snippets demonstrating modern frontend development practices',
    discoveredAt: new Date('2024-02-03'),
  },
  {
    id: 'connection-3',
    sourceId: 'content-3',
    targetId: 'content-5',
    relationship: 'related_context',
    strength: 0.67,
    reason: 'Both explore the philosophical aspects of design - psychology and philosophy of design',
    discoveredAt: new Date('2024-01-25'),
  },
  {
    id: 'connection-4',
    sourceId: 'content-6',
    targetId: 'content-11',
    relationship: 'builds_on',
    strength: 0.85,
    reason: 'Vector embeddings enable the AI-powered design systems mentioned in the pattern note',
    discoveredAt: new Date('2024-02-10'),
  },
  {
    id: 'connection-5',
    sourceId: 'content-4',
    targetId: 'content-1',
    relationship: 'references',
    strength: 0.58,
    reason: 'Color theory is a fundamental aspect of design systems and visual consistency',
    discoveredAt: new Date('2024-01-22'),
  },
  {
    id: 'connection-6',
    sourceId: 'content-7',
    targetId: 'content-6',
    relationship: 'similar_topic',
    strength: 0.71,
    reason: 'Both discuss future technology trends and human-computer interaction',
    discoveredAt: new Date('2024-02-01'),
  },
  {
    id: 'connection-7',
    sourceId: 'content-10',
    targetId: 'content-7',
    relationship: 'contradicts',
    strength: 0.45,
    reason: 'Focused work sessions vs. multimodal interfaces represent different approaches to productivity',
    discoveredAt: new Date('2024-02-08'),
  },
]

// Helper function to get content by type
export const getContentByType = (type: string) => {
  return mockContentItems.filter(item => item.type === type)
}

// Helper function to get recent content
export const getRecentContent = (days: number = 7) => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return mockContentItems.filter(item => item.createdAt >= cutoff)
}

// Helper function to get unread insights
export const getUnreadInsights = () => {
  return mockAIInsights.filter(insight => !insight.isRead)
}

// Helper function to get connections for a specific content item
export const getConnectionsForContent = (contentId: string) => {
  return mockContentConnections.filter(
    conn => conn.sourceId === contentId || conn.targetId === contentId
  )
}