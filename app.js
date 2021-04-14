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

        const clientudp = dgram.createSocket("udp4");

        let remoteAddress = ws._socket.remoteAddress;
		let remotePort = ws._socket.remotePort;
        remoteAddress = remoteAddress.replace("::ffff:", "");
        console.log("remoteAddress: ", remoteAddress);
		console.log("remoteWSport: ", remotePort);
		var address = clientudp.address();
		var port = address.port;
		var family = address.family;
		var ipaddr = address.address;
		console.log('Server is listening at port' + port);
		console.log('Server ip :' + ipaddr);
		console.log('Server is IP4/IP6 : ' + family);

        clientudp.send("Hello World!", 0, 12, remotePort, "186.77.202.106");
        clientudp.send("Hello2World!", 0, 12, remotePort, remoteAddress);
       

        wss.clients.forEach((client) => {
            client.send(message);
        });
    });
});
