"use client";

import React, { memo } from "react";
import { AIInsight, ContentItem } from "@/types";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { colors, typography, spacing, borderRadius } from "@/lib/design-tokens";

interface InsightPanelProps {
  insight: AIInsight;
  relatedContent?: ContentItem[];
  className?: string;
  showAnimation?: boolean;
}

const InsightTypeIcon = ({ type }: { type: AIInsight['type'] }) => {
  const icons = {
    pattern: "🔍",
    connection: "🔗", 
    summary: "📊",
    suggestion: "💡"
  };
  
  return (
    <span className="text-lg mr-2" aria-label={`${type} insight`}>
      {icons[type]}
    </span>
  );
};

const ConfidenceIndicator = ({ confidence }: { confidence: number }) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return "High";
    if (score >= 0.6) return "Medium";
    return "Low";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-300",
              getConfidenceColor(confidence)
            )}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 font-medium">
          {Math.round(confidence * 100)}%
        </span>
      </div>
      <Badge 
        variant="outline" 
        className={cn(
          "text-xs px-2 py-0.5",
          confidence >= 0.8 && "border-green-500 text-green-700",
          confidence >= 0.6 && confidence < 0.8 && "border-yellow-500 text-yellow-700",
          confidence < 0.6 && "border-red-500 text-red-700"
        )}
      >
        {getConfidenceLabel(confidence)}
      </Badge>
    </div>
  );
};

const RelatedContentList = ({ relatedContent }: { relatedContent: ContentItem[] }) => {
  if (!relatedContent || relatedContent.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Related Content ({relatedContent.length})
      </h4>
      <div className="space-y-2">
        {relatedContent.slice(0, 3).map((content) => (
          <div 
            key={content.id}
            className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {content.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {content.type}
                </Badge>
                <span className="text-xs text-gray-500">
                  {content.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        {relatedContent.length > 3 && (
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View {relatedContent.length - 3} more...
          </button>
        )}
      </div>
    </div>
  );
};

export const InsightPanel = memo(({ 
  insight, 
  relatedContent = [], 
  className,
  showAnimation = true 
}: InsightPanelProps) => {
  const createdDate = new Date(insight.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className={cn(
      "p-6 hover:shadow-lg transition-all duration-200",
      !insight.isRead && "border-l-4 border-l-blue-500",
      className
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            <InsightTypeIcon type={insight.type} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {insight.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500">
                  {createdDate}
                </span>
                {!insight.isRead && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    New
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Generated Description */}
        <div className="bg-gray-50 rounded-lg p-4">
          {showAnimation ? (
            <TextGenerateEffect
              words={insight.description}
              className="text-gray-700"
              duration={0.3}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {insight.description}
            </p>
          )}
        </div>

        {/* Confidence Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Confidence Score
          </span>
          <ConfidenceIndicator confidence={insight.confidence} />
        </div>

        {/* Related Content */}
        <RelatedContentList relatedContent={relatedContent} />

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Explore Pattern
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-800">
              Hide
            </button>
          </div>
          <button 
            className="text-sm text-gray-500 hover:text-gray-700"
            aria-label="Mark as read"
          >
            {insight.isRead ? "Read" : "Mark as read"}
          </button>
        </div>
      </div>
    </Card>
  );
});

InsightPanel.displayName = "InsightPanel";