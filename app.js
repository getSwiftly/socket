var http = require('http');
var fs = require('fs');

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var user1Socket = null;
var user2Socket = null;
var userNo = 1;

// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    if(userNo%2 == 1)
    {
        console.log("User 1 Connected!!!!");
        user1Socket = socket;
        userNo += 1;
        user1Socket.on('image', function (socket) {
            // console.log("image recieved 2");
            user2Socket.emit("feed", socket);
        });

        user1Socket.on('audio', function (socket) {
            console.log("audio recieved 1");
            user2Socket.emit("audiofeed", socket);
        });

        socket.emit('message', 'You are connected!')
        console.log('A client is connected!');
    }
    else if(userNo%2 == 0)
    {
        console.log("User 2 Connected!!!!");
        user2Socket = socket;
        userNo += 1;
        user2Socket.on('image', function (socket) {
            // console.log("image recieved 1");
            user1Socket.emit("feed", socket);
        });

        user2Socket.on('audio', function (socket) {
            console.log("audio recieved 2");
            user1Socket.emit("audiofeed", socket);
        });

        socket.emit('message', 'You are connected!')
        console.log('A client is connected!');
    }
    else{
        console.log("Slots FULL!!!!");
    }
});

server.listen(5600);