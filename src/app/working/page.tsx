import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";

export default function WorkingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">MindSync Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          AI Knowledge Management - Working Version!
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchInput 
            placeholder="Search your knowledge base..."
            className="w-full"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">11</div>
              <p className="text-xs text-gray-600">items saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <p className="text-xs text-gray-600">unread discoveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">7</div>
              <p className="text-xs text-gray-600">pattern relationships</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample Content Cards */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">Design Systems Guide</CardTitle>
                  <Badge variant="secondary">note</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Design systems provide a unified language and set of guidelines for building consistent user interfaces...
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">design-systems</Badge>
                  <Badge variant="outline" className="text-xs">ui-ux</Badge>
                  <Badge variant="outline" className="text-xs">frontend</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">React Custom Hook</CardTitle>
                  <Badge variant="secondary">code</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-2 rounded mb-3">
                  <code>function useLocalStorage...</code>
                </pre>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">react</Badge>
                  <Badge variant="outline" className="text-xs">hooks</Badge>
                  <Badge variant="outline" className="text-xs">typescript</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">AI Pattern Discovery</CardTitle>
                  <Badge variant="secondary">insight</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  You&apos;ve been consistently saving content about design systems and systematic approaches...
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge className="text-xs bg-green-100 text-green-800">ai-generated</Badge>
                  <Badge variant="outline" className="text-xs">pattern</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}