const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>MindSync - Working!</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
            <h1 style="color: #2383E2;">🎉 MindSync Server is Working!</h1>
            <p>This is a simple Node.js server running on port 5001.</p>
            <p>The server successfully started and you can see this page!</p>
            <hr>
            <h2>What we've built:</h2>
            <ul>
              <li>✅ Next.js 15 with TypeScript</li>
              <li>✅ Tailwind CSS + shadcn/ui components</li>
              <li>✅ Aceternity UI with 3D effects</li>
              <li>✅ Comprehensive mock data</li>
              <li>✅ Sidebar navigation</li>
              <li>✅ Content cards with hover effects</li>
              <li>✅ Virtualized grid for performance</li>
            </ul>
            <p><strong>Status:</strong> Phase 4 of 11 complete (36% done)</p>
          </div>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page not found</h1>');
  }
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(\`🚀 Simple server running at http://localhost:\${PORT}\`);
  console.log('✅ If you can see this message, the server is working!');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});