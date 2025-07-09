"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SupabaseBookmarkService as BookmarkService, BookmarkSaveRequest } from "@/lib/supabase/bookmark-service";
import { URLAnalyzer } from "@/lib/url-analyzer";
import { ContentItem } from "@/types";
import { 
  IconBookmarkPlus, 
  IconLoader2, 
  IconCheck, 
  IconX,
  IconTag,
  IconNote
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  className?: string;
  onBookmarkSaved?: (bookmark: ContentItem) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

interface BookmarkFormData {
  url: string;
  title: string;
  tags: string[];
  notes: string;
}

export function BookmarkButton({ 
  className, 
  onBookmarkSaved, 
  variant = "default",
  size = "default"
}: BookmarkButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BookmarkFormData>({
    url: '',
    title: '',
    tags: [],
    notes: ''
  });

  const [tagInput, setTagInput] = useState('');

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    setError(null);
    
    if (url.trim()) {
      try {
        // Analyze URL to show preview
        const analysis = await URLAnalyzer.analyzeURL(url);
        setPreviewType(URLAnalyzer.getContentTypeDisplayName(analysis.contentType));
        
        // Auto-generate title if empty
        if (!formData.title) {
          setFormData(prev => ({ 
            ...prev, 
            title: `Bookmark from ${new URL(url).hostname}`
          }));
        }
      } catch (err) {
        // Invalid URL, clear preview
        setPreviewType(null);
      }
    } else {
      setPreviewType(null);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: BookmarkSaveRequest = {
        url: formData.url.trim(),
        title: formData.title.trim() || undefined,
        tags: formData.tags,
        notes: formData.notes.trim() || undefined
      };

      const result = await BookmarkService.saveBookmark(request);

      if (result.success && result.content) {
        setIsSaved(true);
        onBookmarkSaved?.(result.content);
        
        // Show success state briefly, then close
        setTimeout(() => {
          setIsOpen(false);
          setIsSaved(false);
          resetForm();
        }, 1500);
      } else {
        setError(result.error || 'Failed to save bookmark');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      url: '',
      title: '',
      tags: [],
      notes: ''
    });
    setTagInput('');
    setPreviewType(null);
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={cn("gap-2", className)}
        >
          <IconBookmarkPlus className="h-4 w-4" />
          {size !== "icon" && "Save Bookmark"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Bookmark</DialogTitle>
          <DialogDescription>
            Enter a URL and MindSync will automatically detect what type of content it is
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com/..."
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={isLoading}
            />
            {previewType && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Detected: {previewType}
                </Badge>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Custom title for this bookmark"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              disabled={isLoading}
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <IconTag className="h-3 w-3 mr-1" />
                    {tag}
                    <IconX className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Any additional notes about this bookmark"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={isLoading || !formData.url.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <IconCheck className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <IconBookmarkPlus className="h-4 w-4 mr-2" />
                  Save Bookmark
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Quick bookmark button for immediate saving without dialog
 */
export function QuickBookmarkButton({ 
  url, 
  title, 
  className, 
  onBookmarkSaved 
}: {
  url: string;
  title?: string;
  className?: string;
  onBookmarkSaved?: (bookmark: ContentItem) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleQuickSave = async () => {
    setIsLoading(true);
    
    try {
      const result = await BookmarkService.quickSave(url, title);
      
      if (result.success && result.content) {
        setIsSaved(true);
        onBookmarkSaved?.(result.content);
        
        // Reset after showing success
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error('Quick save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleQuickSave}
      disabled={isLoading}
      className={cn("h-8 w-8", className)}
    >
      {isLoading ? (
        <IconLoader2 className="h-4 w-4 animate-spin" />
      ) : isSaved ? (
        <IconCheck className="h-4 w-4 text-green-600" />
      ) : (
        <IconBookmarkPlus className="h-4 w-4" />
      )}
    </Button>
  );
}