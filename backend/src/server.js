const express =  require('express');
const mongoose =  require('mongoose');
const cors =  require('cors');
const path =  require('path');
const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const config = require('./config/local.env')

const app =  express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(config.mongodb.URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})

// Para produção utilizar um BD (Redis) pq perde isso sempre que servidor reinicia.
const connectedUsers = {};

io.on('connection', socket => {
   const { user_id } = socket.handshake.query;

   connectedUsers[user_id] = socket.id;
});

//Middleware: adicionar funcionalidade em toda a rota
app.use((req, res, next) => {
   req.io = io;
   req.connectedUsers = connectedUsers;

   console.log(req.connectedUsers);

   return next();
})

//app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);
