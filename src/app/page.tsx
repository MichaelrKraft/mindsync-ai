"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Glow } from "@/components/ui/glow";
import { SmartContentCard } from "@/components/content/smart-content-card";
import { useAuth } from "@/components/auth/auth-provider";
import { SupabaseBookmarkService } from "@/lib/supabase/bookmark-service";
import { ContentItem } from "@/types";
import { IconPlus, IconBrain, IconTrendingUp, IconLoader2, IconBookmark } from "@tabler/icons-react";

export default function Home() {
  const { user } = useAuth();
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await SupabaseBookmarkService.getBookmarks({ limit: 6 });
        setRecentContent(result.items);
        setTotalBookmarks(result.totalCount);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleBookmarkSaved = () => {
    // Reload dashboard data when a new bookmark is saved
    if (user) {
      SupabaseBookmarkService.getBookmarks({ limit: 6 }).then(result => {
        setRecentContent(result.items);
        setTotalBookmarks(result.totalCount);
      });
    }
  };

  return (
    <MainLayout>
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Glow 
          variant="center" 
          className="opacity-30 blur-3xl scale-150" 
        />
      </div>
      
      {/* Header */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-mindsync-gray">Dashboard</h1>
            <p className="text-sm text-mindsync-gray-light mt-1">
              {user ? `Welcome back, ${user.user_metadata?.name || user.email}!` : 'Welcome to MindSync.ai'}
            </p>
          </div>
          {user && (
            <div className="flex gap-2">
              <BookmarkButton 
                onBookmarkSaved={handleBookmarkSaved}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 p-6">
        {user && (
          <>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchInput 
                placeholder="Search your knowledge base..."
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={100}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <Card className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <IconBrain className="h-4 w-4 text-mindsync-gray-light" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-mindsync-gray">
                  {user ? (loading ? '...' : totalBookmarks) : '0'}
                </div>
                <p className="text-xs text-mindsync-gray-light">
                  {user ? 'Total bookmarks' : 'Sign in to see your content'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={100}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <Card className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                <IconTrendingUp className="h-4 w-4 text-mindsync-gray-light" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-mindsync-gray">0</div>
                <p className="text-xs text-mindsync-gray-light">
                  AI insights (coming soon)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={100}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <Card className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connections</CardTitle>
                <IconTrendingUp className="h-4 w-4 text-mindsync-gray-light" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-mindsync-gray">12</div>
                <p className="text-xs text-mindsync-gray-light">
                  Pattern relationships found
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Content */}
        {user && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-mindsync-gray">Recent Content</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <IconLoader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : recentContent.length === 0 ? (
              <div className="text-center py-12">
                <IconBookmark className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
                <p className="text-gray-500">Start by saving your first bookmark!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentContent.map((item) => (
                  <SmartContentCard
                    key={item.id}
                    content={item}
                    onView={() => console.log('View:', item.id)}
                    onBookmark={() => console.log('Bookmark:', item.id)}
                    onShare={() => console.log('Share:', item.id)}
                    className="h-80"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Welcome Message for Non-Authenticated Users */}
        {!user && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <IconBrain className="h-16 w-16 mx-auto text-mindsync-blue mb-4" />
              <h2 className="text-3xl font-bold text-mindsync-gray mb-4">Welcome to MindSync.ai</h2>
              <p className="text-lg text-mindsync-gray-light mb-8">
                Your AI-powered knowledge management platform. Save, organize, and discover insights from your content.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-mindsync-blue/10 rounded-lg p-4 mb-4">
                  <IconBookmark className="h-8 w-8 mx-auto text-mindsync-blue" />
                </div>
                <h3 className="font-semibold mb-2">Smart Bookmarking</h3>
                <p className="text-sm text-gray-600">Automatically detect and categorize content from any URL</p>
              </div>
              <div className="text-center">
                <div className="bg-mindsync-green/10 rounded-lg p-4 mb-4">
                  <IconBrain className="h-8 w-8 mx-auto text-mindsync-green" />
                </div>
                <h3 className="font-semibold mb-2">AI Insights</h3>
                <p className="text-sm text-gray-600">Discover patterns and connections in your saved content</p>
              </div>
              <div className="text-center">
                <div className="bg-mindsync-blue/10 rounded-lg p-4 mb-4">
                  <IconTrendingUp className="h-8 w-8 mx-auto text-mindsync-blue" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Sync</h3>
                <p className="text-sm text-gray-600">Access your knowledge base from anywhere, anytime</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}