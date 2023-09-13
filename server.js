const express = require('express');
const app = express();
const path = require('path');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9090 }); // WebSocket server will run on port 9090

wss.on('connection', (ws) => {
    console.log('A new WebSocket connection established.');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Handle incoming messages from clients here
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });

    ws.on('error', (err) => { 
    })
});

// Configure express.static to serve files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

// Define your routes below this middleware
// For example, you can define a route for the root ("/") like this:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});