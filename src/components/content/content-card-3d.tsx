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
  IconCode, 
  IconLink, 
  IconNote,
  IconPhoto,
  IconQuote,
  IconCalendar
} from "@tabler/icons-react";
import Image from "next/image";

interface ContentCard3DProps {
  content: ContentItem;
  className?: string;
  onView?: (content: ContentItem) => void;
  onBookmark?: (content: ContentItem) => void;
  onShare?: (content: ContentItem) => void;
}

const ContentTypeIcon = ({ type }: { type: string }) => {
  const iconClass = "h-4 w-4 text-mindsync-gray-light";
  
  switch (type) {
    case 'code':
      return <IconCode className={iconClass} />;
    case 'link':
      return <IconLink className={iconClass} />;
    case 'image':
      return <IconPhoto className={iconClass} />;
    case 'quote':
      return <IconQuote className={iconClass} />;
    default:
      return <IconNote className={iconClass} />;
  }
};

export function ContentCard3D({ 
  content, 
  className, 
  onView, 
  onBookmark, 
  onShare 
}: ContentCard3DProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getContentPreview = (content: ContentItem) => {
    if (content.type === 'code') {
      return (
        <pre className="text-xs font-mono bg-mindsync-gray-pale p-2 rounded text-mindsync-gray overflow-hidden">
          <code>{content.content.slice(0, 150)}...</code>
        </pre>
      );
    }
    
    return (
      <p className="text-sm text-mindsync-gray-light line-clamp-3">
        {content.content}
      </p>
    );
  };

  return (
    <CardContainer className={cn("inter-var w-full", className)}>
      <CardBody className="relative group/card hover:shadow-2xl hover:shadow-mindsync-blue/[0.1] bg-gray-50 border-black/[0.1] w-full h-auto rounded-xl p-0 border">
        <Card className="w-full h-full border-0 shadow-none bg-transparent">
          <CardHeader className="pb-3">
            <CardItem translateZ="50" className="w-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <ContentTypeIcon type={content.type} />
                  <Badge variant="secondary" className="text-xs">
                    {content.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-mindsync-gray-light">
                    <IconCalendar className="h-3 w-3" />
                    {formatDate(content.createdAt)}
                  </div>
                </div>
                
                {/* Quick Actions - Hidden by default, shown on hover */}
                <CardItem
                  translateZ="60"
                  className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                >
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onView?.(content)}
                    >
                      <IconEye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onBookmark?.(content)}
                    >
                      <IconBookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onShare?.(content)}
                    >
                      <IconShare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardItem>
              </div>
              
              <CardTitle className="text-base font-semibold text-mindsync-gray line-clamp-2">
                {content.title}
              </CardTitle>
            </CardItem>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Image Content */}
            {content.type === 'image' && content.imageUrl && (
              <CardItem translateZ="100" className="w-full mb-4">
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-mindsync-gray-pale">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-mindsync-blue border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <Image
                    src={content.imageUrl}
                    alt={content.metadata?.imageAlt || content.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                </div>
              </CardItem>
            )}

            {/* Content Preview */}
            <CardItem translateZ="60" className="w-full mb-4">
              {getContentPreview(content)}
            </CardItem>

            {/* URL for links */}
            {content.type === 'link' && content.url && (
              <CardItem translateZ="50" className="w-full mb-4">
                <div className="flex items-center gap-2 p-2 bg-mindsync-blue-light rounded-lg">
                  <IconLink className="h-4 w-4 text-mindsync-blue" />
                  <span className="text-sm text-mindsync-blue truncate">
                    {content.metadata?.domain || new URL(content.url).hostname}
                  </span>
                </div>
              </CardItem>
            )}

            {/* Tags */}
            <CardItem translateZ="50" className="w-full">
              <div className="flex flex-wrap gap-1 mb-2">
                {content.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {content.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{content.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              {/* AI Tags */}
              {content.aiTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {content.aiTags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="ai" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {content.aiTags.length > 2 && (
                    <Badge variant="ai" className="text-xs">
                      +{content.aiTags.length - 2} AI
                    </Badge>
                  )}
                </div>
              )}
            </CardItem>
          </CardContent>
        </Card>
      </CardBody>
    </CardContainer>
  );
}