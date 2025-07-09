'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { SupabaseBookmarkService } from '@/lib/supabase/bookmark-service'
import { ContentItem, ContentType } from '@/types'
import { SmartContentCard } from './smart-content-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  IconLoader2, 
  IconSearch, 
  IconFilter,
  IconPlus,
  IconRefresh
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface SupabaseContentGridProps {
  className?: string
}

const CONTENT_TYPES: ContentType[] = [
  'note', 'link', 'image', 'quote', 'code', 'book', 
  'product', 'article', 'property', 'tv_show', 'website', 'tweet'
]

export function SupabaseContentGrid({ className }: SupabaseContentGridProps) {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const loadBookmarks = async (reset = false) => {
    if (!user) return
    
    setLoading(reset)
    
    try {
      const result = await SupabaseBookmarkService.getBookmarks({
        query: searchQuery || undefined,
        contentTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
        limit: 20,
        offset: reset ? 0 : page * 20
      })
      
      if (reset) {
        setBookmarks(result.items)
        setPage(0)
      } else {
        setBookmarks(prev => [...prev, ...result.items])
      }
      
      setTotalCount(result.totalCount)
      setHasMore(result.hasMore)
      
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadBookmarks(true)
  }

  const handleSearch = () => {
    loadBookmarks(true)
  }

  const handleTypeToggle = (type: ContentType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  // Load bookmarks when user changes, filters change, or page changes
  useEffect(() => {
    loadBookmarks(page === 0)
  }, [user, selectedTypes, page])

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return

    const unsubscribe = SupabaseBookmarkService.subscribeToBookmarks((updatedBookmarks) => {
      setBookmarks(updatedBookmarks)
    })

    return unsubscribe
  }, [user])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Sign in to view your bookmarks</h2>
          <p className="text-gray-600">Create an account or sign in to start saving and organizing your content.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <IconLoader2 className="h-4 w-4 animate-spin" /> : <IconSearch className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <IconLoader2 className="h-4 w-4 animate-spin" /> : <IconRefresh className="h-4 w-4" />}
          </Button>
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <IconFilter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by type:</span>
          </div>
          {CONTENT_TYPES.map(type => (
            <Badge
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleTypeToggle(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {totalCount > 0 ? (
            <>
              Showing {bookmarks.length} of {totalCount} bookmarks
              {selectedTypes.length > 0 && (
                <span className="ml-1">
                  filtered by {selectedTypes.join(', ')}
                </span>
              )}
            </>
          ) : loading ? (
            'Loading...'
          ) : (
            'No bookmarks found'
          )}
        </div>
        
        {selectedTypes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTypes([])}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Content Grid */}
      {loading && bookmarks.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <IconLoader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your bookmarks...</p>
          </div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <IconPlus className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-gray-600">Start by saving your first bookmark using the bookmark button in the sidebar.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarks.map((item) => (
              <SmartContentCard
                key={item.id}
                item={item}
                onView={() => console.log('View:', item.id)}
                onBookmark={() => console.log('Bookmark:', item.id)}
                onShare={() => console.log('Share:', item.id)}
                className="h-80"
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={loadMore} 
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}