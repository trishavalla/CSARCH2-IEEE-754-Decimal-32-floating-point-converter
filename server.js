const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port to listen on
const port = 3000;

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Normalize URL to prevent directory traversal attacks
    const sanitizedPath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    
    // Determine the file to serve
    let filePath = path.join(__dirname, sanitizedPath);
    if (filePath === __dirname + path.sep) {
        filePath = path.join(__dirname, 'html.html'); // Default to your main HTML file
    }

    // Determine the content type based on the file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    // Read the requested file and serve it
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
