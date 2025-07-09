"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { ContentConnection, ContentItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PatternDiscoveryProps {
  connections: ContentConnection[];
  contentItems: ContentItem[];
  className?: string;
  maxNodes?: number;
}

interface Node {
  id: string;
  content: ContentItem;
  x: number;
  y: number;
  connections: ContentConnection[];
}

interface Connection {
  source: Node;
  target: Node;
  connection: ContentConnection;
}

const ConnectionTypeColors = {
  similar_topic: "#3B82F6", // blue
  builds_on: "#10B981", // green
  contradicts: "#EF4444", // red
  references: "#8B5CF6", // purple
  related_context: "#F59E0B", // yellow
};

const ConnectionTypeLabels = {
  similar_topic: "Similar Topic",
  builds_on: "Builds On",
  contradicts: "Contradicts", 
  references: "References",
  related_context: "Related Context",
};

const NodeComponent = memo(({ 
  node, 
  isHovered, 
  onHover, 
  onLeave 
}: { 
  node: Node;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const getNodeColor = (type: ContentItem['type']) => {
    const colors = {
      note: "bg-blue-100 border-blue-300",
      link: "bg-green-100 border-green-300", 
      image: "bg-purple-100 border-purple-300",
      quote: "bg-yellow-100 border-yellow-300",
      code: "bg-gray-100 border-gray-300",
    };
    return colors[type] || "bg-gray-100 border-gray-300";
  };

  return (
    <motion.div
      className={cn(
        "absolute w-20 h-20 rounded-lg border-2 cursor-pointer transition-all duration-200",
        "flex items-center justify-center p-2 text-center",
        getNodeColor(node.content.type),
        isHovered && "scale-110 shadow-lg z-10"
      )}
      style={{ 
        left: node.x - 40, 
        top: node.y - 40,
        transform: isHovered ? "scale(1.1)" : "scale(1)"
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="text-xs font-medium text-gray-700 line-clamp-3">
        {node.content.title}
      </div>
      
      {/* Node type indicator */}
      <div className="absolute -top-2 -right-2">
        <Badge className="text-xs px-1 py-0 h-5">
          {node.content.type}
        </Badge>
      </div>
      
      {/* Connection count indicator */}
      <div className="absolute -bottom-2 -left-2">
        <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {node.connections.length}
        </div>
      </div>
    </motion.div>
  );
});

NodeComponent.displayName = "NodeComponent";

const ConnectionLine = memo(({ 
  connection, 
  isHighlighted 
}: { 
  connection: Connection;
  isHighlighted: boolean;
}) => {
  const { source, target, connection: conn } = connection;
  
  // Calculate line position and angle
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  const strokeColor = ConnectionTypeColors[conn.relationship];
  const strokeWidth = isHighlighted ? 3 : Math.max(1, conn.strength * 3);
  
  return (
    <motion.line
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeOpacity={isHighlighted ? 1 : 0.6}
      strokeDasharray={conn.relationship === 'contradicts' ? "5,5" : "none"}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: 1, 
        opacity: isHighlighted ? 1 : 0.6 
      }}
      transition={{ 
        duration: 0.8, 
        ease: "easeInOut",
        delay: Math.random() * 0.5 
      }}
    />
  );
});

ConnectionLine.displayName = "ConnectionLine";

const Tooltip = ({ 
  connection, 
  position, 
  visible 
}: { 
  connection: ContentConnection | null;
  position: { x: number; y: number };
  visible: boolean;
}) => {
  if (!connection || !visible) return null;
  
  return (
    <motion.div
      className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs"
      style={{ left: position.x + 10, top: position.y - 10 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: ConnectionTypeColors[connection.relationship] }}
          />
          <span className="font-medium text-sm">
            {ConnectionTypeLabels[connection.relationship]}
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {connection.reason}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Strength: {Math.round(connection.strength * 100)}%
          </span>
          <span className="text-gray-500">
            {new Date(connection.discoveredAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const PatternDiscovery = memo(({ 
  connections, 
  contentItems, 
  className,
  maxNodes = 10 
}: PatternDiscoveryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connectionLines, setConnectionLines] = useState<Connection[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<ContentConnection | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Initialize nodes and connections
  useEffect(() => {
    if (!containerRef.current || connections.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });

    // Get unique content IDs from connections
    const contentIds = new Set<string>();
    connections.forEach(conn => {
      contentIds.add(conn.sourceId);
      contentIds.add(conn.targetId);
    });

    // Create nodes with positions
    const nodesList: Node[] = [];
    const contentMap = new Map(contentItems.map(item => [item.id, item]));
    
    Array.from(contentIds).slice(0, maxNodes).forEach((id, index) => {
      const content = contentMap.get(id);
      if (!content) return;

      // Position nodes in a circle for better visualization
      const angle = (index / Math.min(contentIds.size, maxNodes)) * 2 * Math.PI;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.3;
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const nodeConnections = connections.filter(
        conn => conn.sourceId === id || conn.targetId === id
      );

      nodesList.push({
        id,
        content,
        x,
        y,
        connections: nodeConnections
      });
    });

    setNodes(nodesList);

    // Create connection lines
    const lines: Connection[] = [];
    connections.forEach(conn => {
      const source = nodesList.find(n => n.id === conn.sourceId);
      const target = nodesList.find(n => n.id === conn.targetId);
      
      if (source && target) {
        lines.push({ source, target, connection: conn });
      }
    });

    setConnectionLines(lines);
  }, [connections, contentItems, maxNodes, dimensions.width, dimensions.height]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeHover = (nodeId: string) => {
    setHoveredNode(nodeId);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  const handleConnectionHover = (
    connection: ContentConnection, 
    event: React.MouseEvent
  ) => {
    setHoveredConnection(connection);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const getHighlightedConnections = (nodeId: string | null) => {
    if (!nodeId) return new Set();
    return new Set(
      connectionLines
        .filter(conn => 
          conn.source.id === nodeId || conn.target.id === nodeId
        )
        .map(conn => conn.connection.id)
    );
  };

  const highlightedConnections = getHighlightedConnections(hoveredNode);

  if (connections.length === 0) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No Patterns Discovered Yet</h3>
          <p className="text-sm">
            Add more content to see AI-discovered connections and patterns.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pattern Discovery
        </h3>
        <p className="text-sm text-gray-600">
          Visualizing {connectionLines.length} connections between {nodes.length} content items
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden"
        style={{ minHeight: "400px" }}
      >
        {/* SVG for connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          width={dimensions.width}
          height={dimensions.height}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
            </marker>
          </defs>
          {connectionLines.map((conn) => (
            <ConnectionLine
              key={conn.connection.id}
              connection={conn}
              isHighlighted={highlightedConnections.has(conn.connection.id)}
            />
          ))}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            isHovered={hoveredNode === node.id}
            onHover={() => handleNodeHover(node.id)}
            onLeave={handleNodeLeave}
          />
        ))}

        {/* Tooltip */}
        <AnimatePresence>
          <Tooltip
            connection={hoveredConnection}
            position={tooltipPosition}
            visible={!!hoveredConnection}
          />
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Connection Types</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(ConnectionTypeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600">
                {ConnectionTypeLabels[type as keyof typeof ConnectionTypeLabels]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
});

PatternDiscovery.displayName = "PatternDiscovery";