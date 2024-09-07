const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Data structure to store device statuses
const deviceStatuses = new Map();

wss.on('connection', (ws) => {
    console.log('New client connected');

    // On receiving a message from a device
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const { userID, status, battery } = data;

        // Update the device status
        deviceStatuses.set(userID, { status, battery, lastUpdated: new Date() });

        console.log(`Updated status for ${userID}:`, deviceStatuses.get(userID));

        // Optionally, broadcast to all admin clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN && client.isAdmin) {
                client.send(JSON.stringify({ type: 'update', userID, status, battery }));
            }
        });
    });

    // On client disconnection, update the status
    ws.on('close', () => {
        console.log('Client disconnected');
        // Handle disconnection if necessary
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
