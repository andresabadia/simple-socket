const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3005 });

console.log("starting server on port 3005");
wss.on("connection", (ws) => {
    console.log("connection stablished");
    ws.send("connection stablished");

    ws.on("message", (message) => {
        console.log("received: %s", message);
        wss.clients.forEach((client) => {
            client.send(message);
        });
    });
});
