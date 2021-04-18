
const express = require("express");
const app = express();
let server = require('http').createServer(app);
const PORT = 8080;
let io = require('socket.io')(server);

let segments = [];
let clients = 0;


app.use(express.static(__dirname));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});



io.on('connection', function(socket){
  
  console.log('A user has connected!');
  clients ++;
  
  socket.emit('drawBatch', segments);
  
  socket.on('newBatch', function(data){
    segments = segments.concat(data);
    socket.broadcast.emit('drawBatch', data);
  });
  
  socket.on('serverClear', function(){
    segments = [];
    io.sockets.emit('clientClear');
  })
  
  
  socket.on('broadcastAll', function(data){
    io.sockets.emit(data.emitName, data.content);
  })
  
  socket.on('disconnect', function(){
    console.log('A user has disconnected');
    clients --;
  })
  
});






server.listen(PORT, function(){
  console.log('Listening on port ' + PORT);
})
