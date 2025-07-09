"use client";

import React, { useState } from "react";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/card-3d";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/types";
import { cn } from "@/lib/utils";
import { 
  IconEye, 
  IconBookmark, 
  IconShare, 
  IconBook,
  IconShoppingCart,
  IconArticle,
  IconHome,
  IconDeviceTv,
  IconWorld,
  IconBrandTwitter,
  IconStar,
  IconMapPin,
  IconClock,
  IconUser,
  IconCalendar,
  IconCurrencyDollar,
  IconQuote
} from "@tabler/icons-react";
import Image from "next/image";

interface SpecializedCardProps {
  content: ContentItem;
  className?: string;
  onView?: (content: ContentItem) => void;
  onBookmark?: (content: ContentItem) => void;
  onShare?: (content: ContentItem) => void;
}

// Book Card Component - Visual book cover focus
export function BookCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-mindsync-blue/[0.1] bg-white border-none w-full h-80 rounded-xl p-0 overflow-hidden">
        {/* Book Cover - Full Size */}
        <div className="relative w-full h-full">
          {content.imageUrl || content.metadata?.bookCover ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-amber-50">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={content.imageUrl || content.metadata?.bookCover || ''}
                alt={content.title}
                fill
                className="object-cover"
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
              <IconBook className="h-20 w-20 text-amber-600" />
            </div>
          )}
          
          {/* Overlay with book info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
          
          {/* Book details overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-lg line-clamp-2 mb-1">{content.title}</h3>
            {content.metadata?.author && (
              <p className="text-sm opacity-90 mb-2">by {content.metadata.author}</p>
            )}
            {content.metadata?.rating && (
              <div className="flex items-center gap-1">
                <IconStar className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{content.metadata.rating}/5</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white" onClick={() => onView?.(content)}>
                <IconEye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white" onClick={() => onBookmark?.(content)}>
                <IconBookmark className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white" onClick={() => onShare?.(content)}>
                <IconShare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}

// Product Card Component - Large image with price overlay
export function ProductCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-mindsync-blue/[0.1] bg-white border-none w-full h-80 rounded-xl p-0 overflow-hidden">
        {/* Product Image - Full Size */}
        <div className="relative w-full h-full">
          {content.imageUrl ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={content.imageUrl}
                alt={content.title}
                fill
                className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
              <IconShoppingCart className="h-20 w-20 text-green-600" />
            </div>
          )}
          
          {/* Price Badge - Top Left */}
          {content.metadata?.price && (
            <div className="absolute top-3 left-3">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                <span className="text-lg font-bold text-green-600">{content.metadata.price}</span>
              </div>
            </div>
          )}

          {/* Brand Badge - Top Right */}
          {content.metadata?.brand && (
            <div className="absolute top-3 right-3">
              <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                {content.metadata.brand}
              </div>
            </div>
          )}

          {/* Product details overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <h3 className="font-bold text-white text-lg line-clamp-2 mb-2">{content.title}</h3>
            
            {content.metadata?.availability && (
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  content.metadata.availability.toLowerCase() === 'in stock' 
                    ? "bg-green-500/20 text-green-300" 
                    : "bg-yellow-500/20 text-yellow-300"
                )}>
                  {content.metadata.availability}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white" onClick={() => onView?.(content)}>
                <IconEye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white" onClick={() => onBookmark?.(content)}>
                <IconBookmark className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white" onClick={() => onShare?.(content)}>
                <IconShare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}

// Article Card Component
export function ArticleCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-mindsync-blue/[0.1] bg-white border-black/[0.1] w-full h-80 rounded-xl p-0 border">
        <Card className="w-full h-full border-0 shadow-none bg-transparent">
          <CardHeader className="pb-3">
            <CardItem translateZ="50" className="w-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconArticle className="h-5 w-5 text-blue-600" />
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Article
                  </Badge>
                </div>
                
                <CardItem
                  translateZ="60"
                  className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                >
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onView?.(content)}>
                      <IconEye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onBookmark?.(content)}>
                      <IconBookmark className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onShare?.(content)}>
                      <IconShare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardItem>
              </div>
              
              <CardTitle className="text-base font-semibold text-mindsync-gray line-clamp-2 mb-3">
                {content.title}
              </CardTitle>
              
              {content.metadata?.excerpt && (
                <CardItem translateZ="60" className="w-full mb-3">
                  <p className="text-sm text-mindsync-gray-light line-clamp-3">
                    {content.metadata.excerpt}
                  </p>
                </CardItem>
              )}
              
              <div className="flex items-center gap-4 text-xs text-mindsync-gray-light">
                {content.metadata?.publication && (
                  <div className="flex items-center gap-1">
                    <IconWorld className="h-3 w-3" />
                    <span>{content.metadata.publication}</span>
                  </div>
                )}
                
                {content.metadata?.readingTime && (
                  <div className="flex items-center gap-1">
                    <IconClock className="h-3 w-3" />
                    <span>{content.metadata.readingTime} min read</span>
                  </div>
                )}
                
                {content.metadata?.publishedDate && (
                  <div className="flex items-center gap-1">
                    <IconCalendar className="h-3 w-3" />
                    <span>{new Date(content.metadata.publishedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardItem>
          </CardHeader>
        </Card>
      </CardBody>
    </CardContainer>
  );
}

// Property Card Component
export function PropertyCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-mindsync-blue/[0.1] bg-white border-black/[0.1] w-full h-80 rounded-xl p-0 border">
        <Card className="w-full h-full border-0 shadow-none bg-transparent">
          <CardHeader className="pb-3">
            <CardItem translateZ="50" className="w-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconHome className="h-5 w-5 text-purple-600" />
                  <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    Property
                  </Badge>
                </div>
                
                <CardItem
                  translateZ="60"
                  className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                >
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onView?.(content)}>
                      <IconEye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onBookmark?.(content)}>
                      <IconBookmark className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onShare?.(content)}>
                      <IconShare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardItem>
              </div>
              
              {/* Property Image */}
              {content.imageUrl && (
                <CardItem translateZ="80" className="w-full mb-3">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <Image
                      src={content.imageUrl}
                      alt={content.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                    />
                  </div>
                </CardItem>
              )}
              
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-base font-semibold text-mindsync-gray line-clamp-1 flex-1">
                  {content.title}
                </CardTitle>
                
                {content.metadata?.propertyPrice && (
                  <div className="flex items-center gap-1 ml-2">
                    <IconCurrencyDollar className="h-4 w-4 text-purple-600" />
                    <span className="text-lg font-bold text-purple-600">{content.metadata.propertyPrice}</span>
                  </div>
                )}
              </div>
              
              {content.metadata?.location && (
                <div className="flex items-center gap-1 mb-2">
                  <IconMapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-mindsync-gray-light">{content.metadata.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-mindsync-gray-light">
                {content.metadata?.bedrooms && (
                  <span>{content.metadata.bedrooms} bed</span>
                )}
                {content.metadata?.bathrooms && (
                  <span>{content.metadata.bathrooms} bath</span>
                )}
                {content.metadata?.squareFootage && (
                  <span>{content.metadata.squareFootage}</span>
                )}
              </div>
            </CardItem>
          </CardHeader>
        </Card>
      </CardBody>
    </CardContainer>
  );
}

// TV Show Card Component  
export function TVShowCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-mindsync-blue/[0.1] bg-white border-black/[0.1] w-full h-80 rounded-xl p-0 border">
        <Card className="w-full h-full border-0 shadow-none bg-transparent">
          <CardHeader className="pb-3">
            <CardItem translateZ="50" className="w-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconDeviceTv className="h-5 w-5 text-red-600" />
                  <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">
                    TV Show
                  </Badge>
                </div>
                
                <CardItem
                  translateZ="60"
                  className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                >
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onView?.(content)}>
                      <IconEye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onBookmark?.(content)}>
                      <IconBookmark className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onShare?.(content)}>
                      <IconShare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardItem>
              </div>
              
              <div className="flex gap-4">
                {/* Show Poster */}
                <CardItem translateZ="80" className="flex-shrink-0">
                  <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                    {(content.imageUrl || content.metadata?.poster) ? (
                      <>
                        {isImageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        <Image
                          src={content.imageUrl || content.metadata?.poster || ''}
                          alt={content.title}
                          fill
                          className="object-cover"
                          onLoad={() => setIsImageLoading(false)}
                          onError={() => setIsImageLoading(false)}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-red-50">
                        <IconDeviceTv className="h-8 w-8 text-red-400" />
                      </div>
                    )}
                  </div>
                </CardItem>

                {/* Show Info */}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold text-mindsync-gray line-clamp-2 mb-2">
                    {content.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-3 mb-2">
                    {content.metadata?.imdbRating && (
                      <div className="flex items-center gap-1">
                        <IconStar className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{content.metadata.imdbRating}/10</span>
                      </div>
                    )}
                    
                    {content.metadata?.releaseYear && (
                      <span className="text-sm text-mindsync-gray-light">{content.metadata.releaseYear}</span>
                    )}
                  </div>
                  
                  {content.metadata?.summary && (
                    <p className="text-xs text-mindsync-gray-light line-clamp-3">
                      {content.metadata.summary}
                    </p>
                  )}
                </div>
              </div>
            </CardItem>
          </CardHeader>
        </Card>
      </CardBody>
    </CardContainer>
  );
}

// Tweet Card Component - Looks like actual Twitter post
export function TweetCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-sky-500/[0.1] bg-white border border-gray-200 w-full h-80 rounded-2xl p-4 transition-all duration-200">
        {/* Twitter Bird Icon - Top Right */}
        <div className="absolute top-3 right-3">
          <IconBrandTwitter className="h-5 w-5 text-sky-500" />
        </div>

        {/* Tweet Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Profile Picture */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0">
            <IconUser className="h-6 w-6 text-white" />
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900 text-sm">
                {content.metadata?.tweetAuthor || 'User'}
              </span>
              {content.metadata?.tweetHandle && (
                <span className="text-gray-500 text-sm">
                  @{content.metadata.tweetHandle}
                </span>
              )}
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm">
                {content.metadata?.tweetDate ? 
                  new Date(content.metadata.tweetDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 
                  'Feb 11'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Tweet Content */}
        <div className="mb-4">
          <p className="text-gray-900 text-base leading-relaxed">
            {content.content}
          </p>
        </div>

        {/* Tweet Engagement Stats */}
        <div className="flex items-center gap-6 text-gray-500 text-sm border-t border-gray-100 pt-3">
          {content.metadata?.retweets && (
            <div className="flex items-center gap-1">
              <span className="text-green-600">🔄</span>
              <span>{content.metadata.retweets}</span>
            </div>
          )}
          
          {content.metadata?.likes && (
            <div className="flex items-center gap-1">
              <span className="text-red-500">❤️</span>
              <span>{content.metadata.likes}</span>
            </div>
          )}
        </div>

        {/* Quick Actions - Hidden by default */}
        <div className="absolute top-2 right-8 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-sky-100" onClick={() => onView?.(content)}>
              <IconEye className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-sky-100" onClick={() => onBookmark?.(content)}>
              <IconBookmark className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-sky-100" onClick={() => onShare?.(content)}>
              <IconShare className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}

// Quote Card Component - Yellow sticky note style
export function QuoteCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-yellow-500/[0.1] bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-200 border-none w-full h-80 rounded-xl p-0 overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-300">
        {/* Sticky note texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-yellow-300/30" />
        
        {/* Quote content */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Quote text */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <IconQuote className="h-8 w-8 text-yellow-700/40 mx-auto mb-4" />
              <p className="text-lg font-medium text-yellow-900 leading-relaxed font-serif italic">
                "{content.content}"
              </p>
            </div>
          </div>
          
          {/* Author */}
          <div className="text-right">
            {content.metadata?.author && (
              <p className="text-sm font-medium text-yellow-800">
                — {content.metadata.author}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-yellow-300/50 text-yellow-800" onClick={() => onView?.(content)}>
                <IconEye className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-yellow-300/50 text-yellow-800" onClick={() => onBookmark?.(content)}>
                <IconBookmark className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-yellow-300/50 text-yellow-800" onClick={() => onShare?.(content)}>
                <IconShare className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}

// Website Card Component
export function WebsiteCard({ content, className, onView, onBookmark, onShare }: SpecializedCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-mindsync-blue/[0.1] bg-white border-black/[0.1] w-full h-80 rounded-xl p-0 border">
        <Card className="w-full h-full border-0 shadow-none bg-transparent">
          <CardHeader className="pb-3">
            <CardItem translateZ="50" className="w-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconWorld className="h-5 w-5 text-indigo-600" />
                  <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                    Website
                  </Badge>
                </div>
                
                <CardItem
                  translateZ="60"
                  className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                >
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onView?.(content)}>
                      <IconEye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onBookmark?.(content)}>
                      <IconBookmark className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onShare?.(content)}>
                      <IconShare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardItem>
              </div>
              
              {/* Website Preview */}
              {content.imageUrl && (
                <CardItem translateZ="80" className="w-full mb-3">
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100 border">
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <Image
                      src={content.imageUrl}
                      alt={content.title}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover/card:scale-105"
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                    />
                  </div>
                </CardItem>
              )}
              
              <CardTitle className="text-base font-semibold text-mindsync-gray line-clamp-2 mb-2">
                {content.title}
              </CardTitle>
              
              {content.metadata?.description && (
                <CardItem translateZ="60" className="w-full mb-3">
                  <p className="text-sm text-mindsync-gray-light line-clamp-2">
                    {content.metadata.description}
                  </p>
                </CardItem>
              )}
              
              <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
                {content.metadata?.favicon && (
                  <Image
                    src={content.metadata.favicon}
                    alt="Favicon"
                    width={16}
                    height={16}
                    className="rounded"
                  />
                )}
                <span className="text-sm text-indigo-700 font-medium">
                  {content.metadata?.siteName || content.metadata?.domain || (content.url ? new URL(content.url).hostname : '')}
                </span>
              </div>
            </CardItem>
          </CardHeader>
        </Card>
      </CardBody>
    </CardContainer>
  );
}