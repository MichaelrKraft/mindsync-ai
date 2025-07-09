"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { SupabaseContentGrid } from "@/components/content/supabase-content-grid";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { useAuth } from "@/components/auth/auth-provider";
import { IconPlus } from "@tabler/icons-react";

export default function ContentPage() {
  const { user } = useAuth();

  const handleBookmarkSaved = () => {
    // The grid will automatically update via real-time subscription
    console.log('Bookmark saved, grid will update automatically');
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-mindsync-gray">All Content</h1>
            <p className="text-sm text-mindsync-gray-light mt-1">
              {user ? 'Your personal knowledge base' : 'Sign in to view your content'}
            </p>
          </div>
          {user && (
            <BookmarkButton 
              className="gap-2"
              onBookmarkSaved={handleBookmarkSaved}
            />
          )}
        </div>
      </div>

      {/* Content Display */}
      <div className="flex-1 p-6 min-h-0">
        <SupabaseContentGrid className="h-full" />
      </div>
    </MainLayout>
  );
}