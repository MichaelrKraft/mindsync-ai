"use client";

import React from "react";
import { SmartContentCard } from "./smart-content-card";
import { ContentItem } from "@/types";
import { cn } from "@/lib/utils";

interface SimpleContentGridProps {
  items: ContentItem[];
  className?: string;
  onItemView?: (item: ContentItem) => void;
  onItemBookmark?: (item: ContentItem) => void;
  onItemShare?: (item: ContentItem) => void;
}

export function SimpleContentGrid({ 
  items, 
  className, 
  onItemView, 
  onItemBookmark, 
  onItemShare 
}: SimpleContentGridProps) {

  if (items.length === 0) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <div className="text-center text-mindsync-gray-light">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No content yet</h3>
          <p className="text-sm">Start adding notes, links, and other content to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full overflow-auto custom-scrollbar", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {items.map((item) => (
          <div key={item.id} className="w-full">
            <SmartContentCard
              content={item}
              onView={onItemView}
              onBookmark={onItemBookmark}
              onShare={onItemShare}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}