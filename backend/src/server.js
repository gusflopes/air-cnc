const express =  require('express');
const mongoose =  require('mongoose');
const cors =  require('cors');
const path =  require('path');

const routes = require('./routes');

const config = require('./config/local.env')

const app =  express();

mongoose.connect(config.mongodb.URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})

//app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

app.listen(3333);
