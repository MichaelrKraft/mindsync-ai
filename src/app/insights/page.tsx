"use client";

  import { MainLayout } from "@/components/layout/main-layout";
  import { Card } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { BackgroundBeams } from "@/components/ui/background-beams";
  import { Input } from "@/components/ui/input";

  export default function InsightsPage() {
    return (
      <MainLayout>
        <div className="relative h-[40rem] w-full bg-gradient-to-br from-blue-50 via-white
   to-green-50 flex flex-col items-center justify-center overflow-hidden">
          <div className="max-w-4xl mx-auto p-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              AI-Powered Insights
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-lg">
              Discover hidden patterns, connections, and insights in your knowledge base.
              Our AI analyzes your content to reveal meaningful relationships and
  suggestions.
            </p>
            <div className="max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search insights or ask AI..."
                className="w-full relative z-10 text-center"
              />
            </div>
          </div>
          <BackgroundBeams />
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  AI Insights
                </h2>
                <p className="text-gray-600 mt-1">
                  Discover patterns, connections, and insights from your knowledge base
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Badge className="bg-blue-500 text-white">
                  Coming Soon
                </Badge>
              </div>
            </div>
          </div>

          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">AI Insights Coming Soon</h3>
              <p className="text-sm">
                Advanced pattern discovery and AI-powered insights will be available soon.
              </p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }
