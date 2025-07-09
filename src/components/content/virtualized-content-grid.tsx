"use client";

import React, { useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { SmartContentCard } from "./smart-content-card";
import { ContentItem } from "@/types";
import { cn } from "@/lib/utils";

interface VirtualizedContentGridProps {
  items: ContentItem[];
  className?: string;
  onItemView?: (item: ContentItem) => void;
  onItemBookmark?: (item: ContentItem) => void;
  onItemShare?: (item: ContentItem) => void;
}

interface GridCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    items: ContentItem[];
    columnsPerRow: number;
    onItemView?: (item: ContentItem) => void;
    onItemBookmark?: (item: ContentItem) => void;
    onItemShare?: (item: ContentItem) => void;
  };
}

const GridCell: React.FC<GridCellProps> = ({ 
  columnIndex, 
  rowIndex, 
  style, 
  data 
}) => {
  const { items, columnsPerRow, onItemView, onItemBookmark, onItemShare } = data;
  const itemIndex = rowIndex * columnsPerRow + columnIndex;
  const item = items[itemIndex];

  if (!item) {
    return <div style={style} />;
  }

  return (
    <div style={style} className="p-4">
      <SmartContentCard
        content={item}
        onView={onItemView}
        onBookmark={onItemBookmark}
        onShare={onItemShare}
        className="w-full"
      />
    </div>
  );
};

export function VirtualizedContentGrid({ 
  items, 
  className, 
  onItemView, 
  onItemBookmark, 
  onItemShare 
}: VirtualizedContentGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });

  // Calculate grid dimensions
  const { columnsPerRow, rowCount, columnWidth, rowHeight } = useMemo(() => {
    const minColumnWidth = 320; // Minimum card width
    const maxColumnWidth = 400; // Maximum card width
    const gap = 16; // Gap between cards
    
    const availableWidth = containerSize.width - gap;
    const idealColumns = Math.floor(availableWidth / (minColumnWidth + gap));
    const actualColumns = Math.max(1, idealColumns);
    
    const calculatedColumnWidth = Math.min(
      maxColumnWidth,
      Math.floor((availableWidth - (actualColumns - 1) * gap) / actualColumns)
    );
    
    const calculatedRowCount = Math.ceil(items.length / actualColumns);
    const calculatedRowHeight = 400; // Much taller height to prevent card cutoff
    
    return {
      columnsPerRow: actualColumns,
      rowCount: calculatedRowCount,
      columnWidth: calculatedColumnWidth + gap,
      rowHeight: calculatedRowHeight,
    };
  }, [containerSize.width, items.length]);

  // Resize observer to track container dimensions
  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });

    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, []);

  // Initial size calculation
  React.useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, []);

  const gridData = {
    items,
    columnsPerRow,
    onItemView,
    onItemBookmark,
    onItemShare,
  };

  if (containerSize.width === 0 || containerSize.height === 0) {
    return (
      <div 
        ref={containerRef} 
        className={cn("w-full h-full flex items-center justify-center", className)}
      >
        <div className="flex items-center gap-2 text-mindsync-gray-light">
          <div className="w-6 h-6 border-2 border-mindsync-blue border-t-transparent rounded-full animate-spin" />
          Loading content...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div 
        ref={containerRef} 
        className={cn("w-full h-full flex items-center justify-center", className)}
      >
        <div className="text-center text-mindsync-gray-light">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No content yet</h3>
          <p className="text-sm">Start adding notes, links, and other content to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("w-full h-full", className)}>
      <Grid
        columnCount={columnsPerRow}
        columnWidth={columnWidth}
        height={containerSize.height}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={containerSize.width}
        itemData={gridData}
        className="custom-scrollbar"
      >
        {GridCell}
      </Grid>
    </div>
  );
}