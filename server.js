var express = require('express');
var middleware = require('./middleware');
var routes = require('./routes');

var app = express();
var port = 8080;

middleware(app);
routes(app);

app.listen(port, function(){
  console.log('Search Service listening on port ', port);
});





