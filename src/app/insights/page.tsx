"use client";

  import React, { useState, useMemo } from "react";
  import { MainLayout } from "@/components/layout/main-layout";
  import { InsightPanel } from "@/components/ai/insight-panel";
  import { SemanticSearch } from "@/components/ai/semantic-search";
  import { Card } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { BackgroundBeams } from "@/components/ui/background-beams";
  import { Input } from "@/components/ui/input";
  import {
    mockAIInsights,
    mockContentItems,
    mockContentConnections,
    getUnreadInsights,
    getConnectionsForContent
  } from "@/data/mock-content";
  import { AIInsight, InsightType } from "@/types";
  import { cn } from "@/lib/utils";
  import { motion, AnimatePresence } from "framer-motion";

  type InsightFilter = 'all' | 'unread' | 'pattern' | 'connection' | 'summary' |
  'suggestion';
  type ViewMode = 'list' | 'discovery' | 'search';

  const InsightTypeStats = ({ insights }: { insights: AIInsight[] }) => {
    const stats = useMemo(() => {
      const counts: Record<InsightType, number> = {
        pattern: 0,
        connection: 0,
        summary: 0,
        suggestion: 0
      };

      insights.forEach(insight => {
        counts[insight.type]++;
      });

      return counts;
    }, [insights]);

    const typeColors: Record<InsightType, string> = {
      pattern: "bg-blue-100 text-blue-800",
      connection: "bg-green-100 text-green-800",
      summary: "bg-purple-100 text-purple-800",
      suggestion: "bg-orange-100 text-orange-800"
    };

    const typeIcons: Record<InsightType, string> = {
      pattern: "🔍",
      connection: "🔗",
      summary: "📊",
      suggestion: "💡"
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([type, count]) => (
          <Card key={type} className="p-4 text-center">
            <div className="text-2xl mb-2">
              {typeIcons[type as InsightType]}
            </div>
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className={cn(
              "text-sm font-medium mt-1 px-2 py-1 rounded-full inline-block capitalize",
              typeColors[type as InsightType]
            )}>
              {type}s
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const FilterTabs = ({ 
    activeFilter, 
    onFilterChange, 
    insights 
  }: { 
    activeFilter: InsightFilter;
    onFilterChange: (filter: InsightFilter) => void;
    insights: AIInsight[];
  }) => {
    const filterCounts = useMemo(() => {
      const counts: Record<InsightFilter, number> = {
        all: insights.length,
        unread: insights.filter(i => !i.isRead).length,
        pattern: insights.filter(i => i.type === 'pattern').length,
        connection: insights.filter(i => i.type === 'connection').length,
        summary: insights.filter(i => i.type === 'summary').length,
        suggestion: insights.filter(i => i.type === 'suggestion').length,
      };
      return counts;
    }, [insights]);

    const filters: Array<{ key: InsightFilter; label: string; icon?: string }> = [
      { key: 'all', label: 'All Insights' },
      { key: 'unread', label: 'Unread', icon: '🔔' },
      { key: 'pattern', label: 'Patterns', icon: '🔍' },
      { key: 'connection', label: 'Connections', icon: '🔗' },
      { key: 'summary', label: 'Summaries', icon: '📊' },
      { key: 'suggestion', label: 'Suggestions', icon: '💡' },
    ];

    return (
      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
  transition-all",
              activeFilter === key
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {icon && <span>{icon}</span>}
            <span>{label}</span>
            <Badge variant="secondary" className="text-xs">
              {filterCounts[key]}
            </Badge>
          </button>
        ))}
      </div>
    );
  };

  const ViewModeToggle = ({ 
    viewMode, 
    onViewModeChange 
  }: { 
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
  }) => {
    const modes: Array<{ key: ViewMode; label: string; icon: string }> = [
      { key: 'list', label: 'List View', icon: '📝' },
      { key: 'discovery', label: 'Pattern Discovery', icon: '🕸️' },
      { key: 'search', label: 'Semantic Search', icon: '🔍' },
    ];

    return (
      <div className="flex rounded-lg bg-gray-100 p-1">
        {modes.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => onViewModeChange(key)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
  transition-all",
              viewMode === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    );
  };

  const InsightsList = ({ 
    insights, 
    contentItems 
  }: { 
    insights: AIInsight[];
    contentItems: any[];
  }) => {
    const getRelatedContent = (insight: AIInsight) => {
      return contentItems.filter(item =>
        insight.relatedContentIds.includes(item.id)
      );
    };

    if (insights.length === 0) {
      return (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-medium mb-2">No Insights Found</h3>
            <p className="text-sm">
              Try adjusting your filters or add more content for AI analysis.
            </p>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <InsightPanel
                insight={insight}
                relatedContent={getRelatedContent(insight)}
                showAnimation={index < 3}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const PatternDiscoveryPlaceholder = () => {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">Pattern Discovery</h3>
          <p className="text-sm">
            AI pattern discovery visualization coming soon.
          </p>
        </div>
      </Card>
    );
  };

  export default function InsightsPage() {
    const [activeFilter, setActiveFilter] = useState<InsightFilter>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    const filteredInsights = useMemo(() => {
      let filtered = [...mockAIInsights];

      switch (activeFilter) {
        case 'unread':
          filtered = filtered.filter(insight => !insight.isRead);
          break;
        case 'pattern':
        case 'connection':
        case 'summary':
        case 'suggestion':
          filtered = filtered.filter(insight => insight.type === activeFilter);
          break;
        case 'all':
        default:
          break;
      }

      return filtered.sort((a, b) => {
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }, [activeFilter]);

    const unreadCount = useMemo(() => {
      return mockAIInsights.filter(insight => !insight.isRead).length;
    }, []);

    const handleContentSelect = (contentItem: any) => {
      console.log('Selected content:', contentItem);
    };

    return (
      <MainLayout>
        <div className="relative h-[40rem] w-full bg-gradient-to-br from-mindsync-blue/10 
  via-white to-mindsync-green/10 flex flex-col items-center justify-center 
  overflow-hidden">
          <div className="max-w-4xl mx-auto p-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent 
  bg-gradient-to-b from-mindsync-gray to-mindsync-gray-light mb-4">
              AI-Powered Insights
            </h1>
            <p className="text-mindsync-gray-light max-w-2xl mx-auto mb-6 text-lg">
              Discover hidden patterns, connections, and insights in your knowledge base.
              Our AI analyzes your content to reveal meaningful relationships and
  suggestions.
            </p>
            <div className="max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search insights or ask AI..."
                className="w-full relative z-10 text-center"
              />
            </div>
          </div>
          <BackgroundBeams />
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  AI Insights
                </h2>
                <p className="text-gray-600 mt-1">
                  Discover patterns, connections, and insights from your knowledge base
                </p>
              </div>

              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <Badge className="bg-blue-500 text-white">
                    {unreadCount} unread
                  </Badge>
                )}
                <ViewModeToggle 
                  viewMode={viewMode} 
                  onViewModeChange={setViewMode} 
                />
              </div>
            </div>

            <InsightTypeStats insights={mockAIInsights} />
          </div>

          {viewMode === 'list' && (
            <div className="space-y-6">
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                insights={mockAIInsights}
              />

              <InsightsList 
                insights={filteredInsights}
                contentItems={mockContentItems}
              />
            </div>
          )}

          {viewMode === 'discovery' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Pattern Discovery Visualization
                </h2>
                <p className="text-gray-600 text-sm">
                  Explore how your content connects and forms patterns
                </p>
              </div>

              <PatternDiscoveryPlaceholder />

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Pattern Insights
                </h3>
                <InsightsList 
                  insights={mockAIInsights.filter(i => i.type === 'pattern').slice(0, 3)}
                  contentItems={mockContentItems}
                />
              </div>
            </div>
          )}

          {viewMode === 'search' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Semantic Search
                </h2>
                <p className="text-gray-600 text-sm">
                  Search through your knowledge base with AI-powered understanding
                </p>
              </div>

              <SemanticSearch
                contentItems={mockContentItems}
                onResultSelect={handleContentSelect}
                placeholder="Search for patterns, concepts, or connections..."
                showFilters={true}
              />

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Search & Discovery Insights
                </h3>
                <InsightsList 
                  insights={mockAIInsights.filter(i =>
                    i.type === 'connection' || i.type === 'suggestion'
                  ).slice(0, 2)}
                  contentItems={mockContentItems}
                />
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }
