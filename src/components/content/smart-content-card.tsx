"use client";

import React from "react";
import { ContentItem } from "@/types";
import { ContentCard3D } from "./content-card-3d";
import { 
  BookCard, 
  ProductCard, 
  ArticleCard, 
  PropertyCard, 
  TVShowCard, 
  TweetCard, 
  WebsiteCard,
  QuoteCard 
} from "./specialized-cards";

interface SmartContentCardProps {
  content: ContentItem;
  className?: string;
  onView?: (content: ContentItem) => void;
  onBookmark?: (content: ContentItem) => void;
  onShare?: (content: ContentItem) => void;
}

/**
 * SmartContentCard automatically renders the appropriate specialized card
 * based on the content type, similar to MyMind's smart bookmarking system
 */
export function SmartContentCard({ 
  content, 
  className, 
  onView, 
  onBookmark, 
  onShare 
}: SmartContentCardProps) {
  const commonProps = {
    content,
    className,
    onView,
    onBookmark,
    onShare
  };

  // Choose the appropriate card component based on content type
  switch (content.type) {
    case 'book':
      return <BookCard {...commonProps} />;
    
    case 'product':
      return <ProductCard {...commonProps} />;
    
    case 'article':
      return <ArticleCard {...commonProps} />;
    
    case 'property':
      return <PropertyCard {...commonProps} />;
    
    case 'tv_show':
      return <TVShowCard {...commonProps} />;
    
    case 'tweet':
      return <TweetCard {...commonProps} />;
    
    case 'website':
      return <WebsiteCard {...commonProps} />;
    
    case 'quote':
      return <QuoteCard {...commonProps} />;
    
    // Fall back to the generic 3D card for traditional content types
    case 'note':
    case 'link':
    case 'image':
    case 'code':
    default:
      return <ContentCard3D {...commonProps} />;
  }
}