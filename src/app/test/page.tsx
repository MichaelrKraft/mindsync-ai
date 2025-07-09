export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-gray-900">MindSync Test Page</h1>
      <p className="text-gray-600 mt-4">If you can see this, the server is working!</p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold text-blue-900">Quick Test</h2>
        <p className="text-blue-700 mt-2">Server: ✅ Running</p>
        <p className="text-blue-700">React: ✅ Working</p>
        <p className="text-blue-700">Tailwind: ✅ Styling Applied</p>
      </div>
    </div>
  )
}