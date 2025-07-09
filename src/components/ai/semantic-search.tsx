"use client";

import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { ContentItem, ContentType, SearchFilters } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SemanticSearchProps {
  contentItems: ContentItem[];
  onResultSelect?: (item: ContentItem) => void;
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
}

interface SearchSuggestion {
  text: string;
  type: 'tag' | 'content_type' | 'recent' | 'ai_tag';
  count?: number;
}

const ContentTypeIcon = ({ type }: { type: ContentType }) => {
  const icons = {
    note: "📝",
    link: "🔗",
    image: "🖼️", 
    quote: "💬",
    code: "💻"
  };
  return <span className="mr-2">{icons[type]}</span>;
};

const SearchResultItem = memo(({ 
  item, 
  query, 
  onClick 
}: { 
  item: ContentItem;
  query: string;
  onClick: (item: ContentItem) => void;
}) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-medium">
          {part}
        </mark>
      ) : part
    );
  };

  const getPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all duration-200"
      onClick={() => onClick(item)}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start gap-3">
        <ContentTypeIcon type={item.type} />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1">
            {highlightText(item.title, query)}
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            {highlightText(getPreview(item.content), query)}
          </p>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {item.type}
            </Badge>
            
            {item.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            
            {item.aiTags.slice(0, 1).map(tag => (
              <Badge key={tag} className="text-xs bg-blue-100 text-blue-800">
                AI: {tag}
              </Badge>
            ))}
            
            <span className="text-xs text-gray-500 ml-auto">
              {item.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SearchResultItem.displayName = "SearchResultItem";

const FilterPanel = memo(({ 
  filters, 
  onFiltersChange, 
  contentItems,
  isVisible 
}: { 
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  contentItems: ContentItem[];
  isVisible: boolean;
}) => {
  const contentTypeCounts = useMemo(() => {
    const counts: Record<ContentType, number> = {
      note: 0,
      link: 0, 
      image: 0,
      quote: 0,
      code: 0
    };
    
    contentItems.forEach(item => {
      counts[item.type]++;
    });
    
    return counts;
  }, [contentItems]);

  const popularTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    
    contentItems.forEach(item => {
      [...item.tags, ...item.aiTags].forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }, [contentItems]);

  const toggleContentType = (type: ContentType) => {
    const currentTypes = filters.contentTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFiltersChange({
      ...filters,
      contentTypes: newTypes.length === 0 ? undefined : newTypes
    });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({
      ...filters,
      tags: newTags.length === 0 ? undefined : newTags
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="border-t border-gray-200 pt-4 mt-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="space-y-4">
        {/* Content Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Content Types</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(contentTypeCounts).map(([type, count]) => (
              <button
                key={type}
                onClick={() => toggleContentType(type as ContentType)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                  filters.contentTypes?.includes(type as ContentType)
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <ContentTypeIcon type={type as ContentType} />
                <span className="capitalize">{type}</span>
                <span className="text-xs bg-white px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Tags</h4>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                  filters.tags?.includes(tag)
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <span>{tag}</span>
                <span className="text-xs bg-white px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFiltersChange({
                ...filters,
                hasConnections: !filters.hasConnections
              })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                filters.hasConnections
                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Has Connections
            </button>
            <button
              onClick={() => onFiltersChange({
                ...filters,
                hasAIInsights: !filters.hasAIInsights
              })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                filters.hasAIInsights
                  ? "bg-orange-100 text-orange-800 border border-orange-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Has AI Insights
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FilterPanel.displayName = "FilterPanel";

export const SemanticSearch = memo(({ 
  contentItems, 
  onResultSelect,
  className,
  placeholder = "Search your knowledge base...",
  showFilters = true
}: SemanticSearchProps) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate search suggestions
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const allTags = new Set<string>();
    const aiTags = new Set<string>();
    
    contentItems.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag));
      item.aiTags.forEach(tag => aiTags.add(tag));
    });

    const suggestions: SearchSuggestion[] = [];
    const queryLower = searchQuery.toLowerCase();

    // Tag suggestions
    Array.from(allTags)
      .filter(tag => tag.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .forEach(tag => {
        suggestions.push({
          text: tag,
          type: 'tag',
          count: contentItems.filter(item => item.tags.includes(tag)).length
        });
      });

    // AI tag suggestions
    Array.from(aiTags)
      .filter(tag => tag.toLowerCase().includes(queryLower))
      .slice(0, 2)
      .forEach(tag => {
        suggestions.push({
          text: tag,
          type: 'ai_tag',
          count: contentItems.filter(item => item.aiTags.includes(tag)).length
        });
      });

    // Content type suggestions
    const contentTypes: ContentType[] = ['note', 'link', 'image', 'quote', 'code'];
    contentTypes
      .filter(type => type.includes(queryLower))
      .forEach(type => {
        suggestions.push({
          text: type,
          type: 'content_type',
          count: contentItems.filter(item => item.type === type).length
        });
      });

    setSuggestions(suggestions.slice(0, 8));
  }, [contentItems]);

  // Filter and search content
  const filteredResults = useMemo(() => {
    let results = [...contentItems];

    // Apply text search
    if (query.trim()) {
      const queryLower = query.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.content.toLowerCase().includes(queryLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
        item.aiTags.some(tag => tag.toLowerCase().includes(queryLower))
      );
      
      // Sort by relevance (simple scoring)
      results.sort((a, b) => {
        const scoreA = (
          (a.title.toLowerCase().includes(queryLower) ? 10 : 0) +
          (a.content.toLowerCase().includes(queryLower) ? 5 : 0) +
          (a.tags.some(tag => tag.toLowerCase().includes(queryLower)) ? 3 : 0) +
          (a.aiTags.some(tag => tag.toLowerCase().includes(queryLower)) ? 2 : 0)
        );
        const scoreB = (
          (b.title.toLowerCase().includes(queryLower) ? 10 : 0) +
          (b.content.toLowerCase().includes(queryLower) ? 5 : 0) +
          (b.tags.some(tag => tag.toLowerCase().includes(queryLower)) ? 3 : 0) +
          (b.aiTags.some(tag => tag.toLowerCase().includes(queryLower)) ? 2 : 0)
        );
        return scoreB - scoreA;
      });
    }

    // Apply filters
    if (filters.contentTypes?.length) {
      results = results.filter(item => filters.contentTypes!.includes(item.type));
    }

    if (filters.tags?.length) {
      results = results.filter(item => 
        filters.tags!.some(tag => 
          item.tags.includes(tag) || item.aiTags.includes(tag)
        )
      );
    }

    if (filters.dateRange) {
      results = results.filter(item => 
        item.createdAt >= filters.dateRange!.start &&
        item.createdAt <= filters.dateRange!.end
      );
    }

    return results;
  }, [contentItems, query, filters]);

  // Handle query change
  const handleQueryChange = (value: string) => {
    setQuery(value);
    generateSuggestions(value);
    setShowSuggestions(value.length >= 2);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'content_type') {
      setFilters({
        ...filters,
        contentTypes: [suggestion.text as ContentType]
      });
    } else if (suggestion.type === 'tag' || suggestion.type === 'ai_tag') {
      setFilters({
        ...filters,
        tags: [suggestion.text]
      });
    }
    setQuery(suggestion.text);
    setShowSuggestions(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setQuery("");
  };

  const hasActiveFilters = !!(
    filters.contentTypes?.length || 
    filters.tags?.length || 
    filters.hasConnections || 
    filters.hasAIInsights
  );

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={placeholder}
            className="pr-20"
            onFocus={() => setShowSuggestions(query.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
            {showFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={cn(
                  "h-6 px-2 text-xs",
                  showFilterPanel && "bg-blue-100 text-blue-700"
                )}
              >
                Filters
              </Button>
            )}
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2">Suggestions</div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{suggestion.text}</span>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      {suggestion.count && (
                        <span className="text-xs text-gray-500">
                          {suggestion.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            contentItems={contentItems}
            isVisible={showFilterPanel}
          />
        </AnimatePresence>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
          </span>
          {hasActiveFilters && (
            <span className="text-blue-600">
              {Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} active
            </span>
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredResults.map((item) => (
              <SearchResultItem
                key={item.id}
                item={item}
                query={query}
                onClick={(item) => onResultSelect?.(item)}
              />
            ))}
          </AnimatePresence>
          
          {filteredResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>No results found</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  Clear filters to see all content
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

SemanticSearch.displayName = "SemanticSearch";