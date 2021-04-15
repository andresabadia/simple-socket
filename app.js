const WebSocket = require("ws");
const dgram = require("dgram");

const wss = new WebSocket.Server({ port: 3005 });

const clientudp = dgram.createSocket("udp4");
clientudp.bind(33333, "172.31.31.174");

clientudp.on('listening', function () {
  console.log('UDP Server listening on ' + clientudp.address().address + ":" + clientudp.address().port);
});
clientudp.on('message',function(msg,info){
  console.log('Data received from client : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);

//sending msg
var interval = 500; // 10 seconds;

for (var i = 0; i <=100; i++) {
    setTimeout( function (i) {
      clientudp.send("server sent this "+i,info.port,info.address,function(error){
        if(error){
          client.close();
        }else{
          console.log('Data sent !!!');
        }
      
      });
    }, interval * i, i);
}


});

wss.on("connection", (ws, req) => {
    // console.log("connection stablished", wss.clients);
    let clientLength = 0;
    wss.clients.forEach(() => {
        clientLength++;
    });
    ws.send("clients: " + clientLength);

    ws.on("message", (message) => {
        console.log("received: %s", message);

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
		clientudp.send("Hello World!", 0, 12, port, "186.77.202.106");
        clientudp.send("Hello2World!", 0, 12, port, remoteAddress);
       

        wss.clients.forEach((client) => {
            client.send(message);
        });
    });
});
