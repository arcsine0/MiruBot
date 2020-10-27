const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

const indexRouter = require('./routes/index');

var app = express();

// config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/', indexRouter);

// create server
var port = process.env.port || 3000;
var server = http.createServer(app);

server.listen(port);