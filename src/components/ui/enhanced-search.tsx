"use client";

import React, { useState, useMemo } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContentItem, ContentType } from "@/types";
import { URLAnalyzer } from "@/lib/url-analyzer";
import { 
  IconFilter, 
  IconX, 
  IconSearch,
  IconBook,
  IconShoppingCart,
  IconArticle,
  IconHome,
  IconDeviceTv,
  IconWorld,
  IconBrandTwitter,
  IconNote,
  IconLink,
  IconPhoto,
  IconQuote,
  IconCode
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface EnhancedSearchProps {
  items: ContentItem[];
  onResultsChange: (results: ContentItem[]) => void;
  className?: string;
  placeholder?: string;
}

interface SearchFilters {
  contentTypes: ContentType[];
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  hasImages: boolean;
  hasUrls: boolean;
}

const contentTypeIcons: Record<ContentType, React.ComponentType<any>> = {
  note: IconNote,
  link: IconLink,
  image: IconPhoto,
  quote: IconQuote,
  code: IconCode,
  book: IconBook,
  product: IconShoppingCart,
  article: IconArticle,
  property: IconHome,
  tv_show: IconDeviceTv,
  website: IconWorld,
  tweet: IconBrandTwitter,
};

const contentTypeLabels: Record<ContentType, string> = {
  note: 'Notes',
  link: 'Links',
  image: 'Images',
  quote: 'Quotes',
  code: 'Code',
  book: 'Books',
  product: 'Products',
  article: 'Articles',
  property: 'Properties',
  tv_show: 'TV Shows',
  website: 'Websites',
  tweet: 'Tweets',
};

export function EnhancedSearch({ 
  items, 
  onResultsChange, 
  className, 
  placeholder = "Search books, products, articles..."
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    contentTypes: [],
    tags: [],
    dateRange: 'all',
    hasImages: false,
    hasUrls: false,
  });

  // Extract all available tags for filter suggestions
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach(item => {
      item.tags.forEach(tag => tagSet.add(tag));
      item.aiTags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [items]);

  // Get content type counts
  const contentTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filter and search logic
  const filteredResults = useMemo(() => {
    let results = items;

    // Apply text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        item.aiTags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (item.metadata?.author && item.metadata.author.toLowerCase().includes(searchTerm)) ||
        (item.metadata?.brand && item.metadata.brand.toLowerCase().includes(searchTerm)) ||
        (item.metadata?.publication && item.metadata.publication.toLowerCase().includes(searchTerm))
      );
    }

    // Apply content type filters
    if (filters.contentTypes.length > 0) {
      results = results.filter(item => filters.contentTypes.includes(item.type));
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      results = results.filter(item => 
        filters.tags.some(tag => 
          item.tags.includes(tag) || item.aiTags.includes(tag)
        )
      );
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      results = results.filter(item => item.createdAt >= cutoffDate);
    }

    // Apply image filter
    if (filters.hasImages) {
      results = results.filter(item => item.imageUrl || item.type === 'image');
    }

    // Apply URL filter
    if (filters.hasUrls) {
      results = results.filter(item => item.url);
    }

    return results;
  }, [items, query, filters]);

  // Update results when they change
  React.useEffect(() => {
    onResultsChange(filteredResults);
  }, [filteredResults, onResultsChange]);

  const toggleContentType = (type: ContentType) => {
    setFilters(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      contentTypes: [],
      tags: [],
      dateRange: 'all',
      hasImages: false,
      hasUrls: false,
    });
    setQuery('');
  };

  const hasActiveFilters = query.trim() || 
    filters.contentTypes.length > 0 || 
    filters.tags.length > 0 || 
    filters.dateRange !== 'all' ||
    filters.hasImages ||
    filters.hasUrls;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        </div>
        
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="default"
              className={cn(
                "gap-2",
                hasActiveFilters && "border-mindsync-blue text-mindsync-blue"
              )}
            >
              <IconFilter className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredResults.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Advanced Search Filters</DialogTitle>
              <DialogDescription>
                Filter your content by type, tags, date, and more
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Content Types */}
              <div>
                <h4 className="font-medium mb-3">Content Types</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(contentTypeCounts).map(([type, count]) => {
                    const Icon = contentTypeIcons[type as ContentType] || IconNote;
                    const isSelected = filters.contentTypes.includes(type as ContentType);
                    
                    return (
                      <Button
                        key={type}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleContentType(type as ContentType)}
                        className={cn(
                          "justify-start gap-2 h-auto py-2",
                          isSelected && "bg-mindsync-blue text-white"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{contentTypeLabels[type as ContentType]}</span>
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h4 className="font-medium mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 20).map((tag) => {
                    const isSelected = filters.tags.includes(tag);
                    return (
                      <Badge
                        key={tag}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected && "bg-mindsync-blue text-white"
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="font-medium mb-3">Date Range</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All Time' },
                    { key: 'today', label: 'Today' },
                    { key: 'week', label: 'This Week' },
                    { key: 'month', label: 'This Month' },
                    { key: 'year', label: 'This Year' },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant={filters.dateRange === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, dateRange: key as any }))}
                      className={cn(
                        filters.dateRange === key && "bg-mindsync-blue text-white"
                      )}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div>
                <h4 className="font-medium mb-3">Additional Filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasImages}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasImages: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Has images</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasUrls}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasUrls: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Has URLs</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                  Apply Filters ({filteredResults.length} results)
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-mindsync-gray-light">Active filters:</span>
          
          {filters.contentTypes.map(type => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-red-100"
              onClick={() => toggleContentType(type)}
            >
              {contentTypeLabels[type]}
              <IconX className="h-3 w-3" />
            </Badge>
          ))}
          
          {filters.tags.map(tag => (
            <Badge
              key={tag}
              variant="outline"
              className="gap-1 cursor-pointer hover:bg-red-100"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <IconX className="h-3 w-3" />
            </Badge>
          ))}
          
          {filters.dateRange !== 'all' && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-red-100"
              onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
            >
              {filters.dateRange}
              <IconX className="h-3 w-3" />
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs h-6 px-2"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-mindsync-gray-light">
        {hasActiveFilters ? (
          <>Showing {filteredResults.length} of {items.length} items</>
        ) : (
          <>{items.length} items total</>
        )}
      </div>
    </div>
  );
}