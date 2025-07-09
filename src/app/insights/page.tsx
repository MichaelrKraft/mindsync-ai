"use client";

  import { MainLayout } from "@/components/layout/main-layout";
  import { Card } from "@/components/ui/card";

  export default function InsightsPage() {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-8">AI Insights</h1>

          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">AI Insights Coming Soon</h2>
            <p className="text-gray-600">
              Advanced pattern discovery and AI insights will be available soon.
            </p>
          </Card>
        </div>
      </MainLayout>
    );
  }
