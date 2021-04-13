const WebSocket = require("ws");
const dgram = require("dgram");

const wss = new WebSocket.Server({ port: 3005 });

console.log("starting server on port 3005");
wss.on("connection", (ws, req) => {
    // console.log("connection stablished", wss.clients);
    let clientLength = 0;
    wss.clients.forEach(() => {
        clientLength++;
    });
    ws.send("clients: " + clientLength);

    ws.on("message", (message) => {
        console.log("received: %s", message);

        const client = dgram.createSocket("udp4");

        let remoteAddress = ws._socket.remoteAddress;
        remoteAddress = remoteAddress.replace("::ffff:", "");
        console.log("remoteAddress: ", remoteAddress);

        client.send("Hello World!", 0, 12, 12000, "186.77.202.106");
        client.send("Hello2World!", 0, 12, 12000, remoteAddress);
        client.send(
            "Hello3World!",
            0,
            12,
            12000,
            remoteAddress,
            function (err, bytes) {
                client.close();
            }
        );

        wss.clients.forEach((client) => {
            client.send(message);
        });
    });
});
