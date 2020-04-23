const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io')(http);
let clientes={
  profe:{},
  alumnos:[]
};
let contenido;
app.use(express.static(__dirname + '/views'));
app.get('/profe', function(req, res) {
  res.sendFile(path.join(__dirname, './views/profe/editor.html'));
});
app.get('/estudiante', function(req, res) {
  res.sendFile(path.join(__dirname, './views/estudiante/editor.html'));
});
io.use(function(socket, next) {
  var handshakeData = socket.request;
  let tipo=handshakeData._query['tipo'];
  console.log("middleware:", handshakeData._query['tipo']);
  console.log(socket.id);
  if(tipo==='profe')
  {
    clientes.profe.id=socket.id
  }
  else
  {
   clientes.alumnos.push(socket.id);
  }
  next();
});
io.on('connection', function(socket) {
  socket.join('profe');
  console.log('a user connected'+socket.id);
  console.log(socket.id+' '+clientes.profe.id)
  if(socket.id!=clientes.profe.id)
  {
    console.log(contenido);
    socket.to('profe').emit('actualizacliente', contenido);
  }
  socket.on('actualiza',function(data)
  {
    contenido=data;
    socket.to('profe').emit('actualizacliente', data);
  });
  // 'disconnect' is an event sockets produce automatically.
  socket.on('disconnect', function(socket){
    console.log('user disconnected'+socket.id);
  });

});

console.log("localhost:" + port);
http.listen(port);
