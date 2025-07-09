"use client";

import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { IconBrain, IconCode, IconFileText, IconLink, IconQuote, IconBulb, IconNetwork, IconTrendingUp } from "@tabler/icons-react";

// Transform content items into timeline format based on creation dates and AI insights
const knowledgeTimelineData = [
  {
    id: 1,
    title: "Design Systems",
    date: "Jan 2024",
    content: "Saved comprehensive notes on design systems and component libraries. Started exploring systematic approaches to UI consistency.",
    category: "Knowledge",
    icon: IconFileText,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "React Hooks",
    date: "Jan 2024", 
    content: "Discovered and saved React custom hook for local storage. Enhanced understanding of React patterns.",
    category: "Code",
    icon: IconCode,
    relatedIds: [1, 4],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Design Philosophy",
    date: "Feb 2024",
    content: "Steve Jobs quote on design philosophy: 'Design is not just what it looks like and feels like. Design is how it works.'",
    category: "Inspiration",
    icon: IconQuote,
    relatedIds: [1, 5],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "TypeScript Patterns",
    date: "Feb 2024",
    content: "Collected advanced TypeScript patterns and type utilities. Building stronger foundation in type-safe development.",
    category: "Development",
    icon: IconCode,
    relatedIds: [2, 6],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 5,
    title: "AI Pattern Discovery",
    date: "Mar 2024",
    content: "AI identified pattern: You're building expertise in systematic, principled approaches to both design and development.",
    category: "AI Insight",
    icon: IconBrain,
    relatedIds: [1, 3, 7],
    status: "in-progress" as const,
    energy: 95,
  },
  {
    id: 6,
    title: "Vector Embeddings",
    date: "Mar 2024",
    content: "Deep dive into semantic search and vector embeddings. Understanding how machines comprehend meaning.",
    category: "AI/ML",
    icon: IconTrendingUp,
    relatedIds: [4, 8],
    status: "in-progress" as const,
    energy: 80,
  },
  {
    id: 7,
    title: "Knowledge Connections",
    date: "Current",
    content: "AI discovered 12 pattern relationships across your saved content, revealing interconnected learning themes.",
    category: "AI Insight",
    icon: IconNetwork,
    relatedIds: [5, 8],
    status: "pending" as const,
    energy: 70,
  },
  {
    id: 8,
    title: "Future Learning",
    date: "Upcoming",
    content: "Predicted learning trajectory: Advanced AI integration, systematic knowledge management, and design systems mastery.",
    category: "Prediction",
    icon: IconBulb,
    relatedIds: [6, 7],
    status: "pending" as const,
    energy: 60,
  },
];

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-4">
          <h1 className="text-white text-lg font-semibold mb-2">Knowledge Timeline</h1>
          <p className="text-white/70 text-sm mb-3">
            Explore your learning journey and AI-discovered patterns
          </p>
          <div className="space-y-1 text-xs text-white/60">
            <div>• Click nodes to explore connections</div>
            <div>• Related items will pulse when selected</div>
            <div>• Timeline auto-rotates to show progression</div>
          </div>
        </div>
      </div>
      
      <RadialOrbitalTimeline timelineData={knowledgeTimelineData} />
    </div>
  );
}