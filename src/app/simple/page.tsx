import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">MindSync - Simple View</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Design Systems</CardTitle>
                <Badge variant="secondary">note</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Design systems provide a unified language and set of guidelines for building consistent user interfaces...
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">design-systems</Badge>
                <Badge variant="outline" className="text-xs">ui-ux</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">React Hook</CardTitle>
                <Badge variant="secondary">code</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-2 rounded mb-4">
                <code>function useLocalStorage...</code>
              </pre>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">react</Badge>
                <Badge variant="outline" className="text-xs">hooks</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">AI Insights</CardTitle>
                <Badge variant="secondary">insight</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                You&apos;ve been consistently saving content about design systems...
              </p>
              <Button size="sm" className="w-full">View Insight</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}