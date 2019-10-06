const express =  require('express');
const mongoose =  require('mongoose');
const cors =  require('cors');
const path =  require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const config = require('./config/local.env')

// Enabled to listen http and websockets requisitions
const app =  express();
const server = http.Server(app);
const io = socketio(server);

// Em produção, utilizar um banco rapido para guardar os  usuarios.. Redis é o melhor
const connectedUsers = {};

mongoose.connect(config.mongodb.URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})

io.on('connection', socket => {
   const { user_id } = socket.handshake.query;

   connectedUsers[user_id] = socket.id;

   /* TESTE
   console.log(socket.handshake.query);
   console.log('Usuário conectado: ', socket.id);

   setTimeout(() => {
      socket.emit('hello', 'World');
   }, 4000);

   socket.on('omni', data => {
      console.log(data);
   })
   */
});

// Middleware - o next manda continuar
app.use((req, res, next) => {
   req.io = io;
   req.connectedUsers = connectedUsers;

   // Como todas as rotas tem req, eu consigo passar essas informações adicionado ao req

   return next()
})

//app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);
