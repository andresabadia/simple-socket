const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

console.log("starting server on port 8080");
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
