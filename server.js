var express = require('express');
var middleware = require('./config/middleware');
var routes = require('./config/routes');

var app = express();
var port = 8080;

middleware(app);
routes(app);

// test

app.listen(port, function(){
  console.log('Search Service listening on port ', port);
});





