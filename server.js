var express = require('express');
var middleware = require('./config/middleware');
var routes = require('./config/routes');
// var Promise = require("bluebird");
//
var elastic = require('./elasticSearch.js');

var app = express();
var port = 8080;

middleware(app);
routes(app);

//test
elastic.indexExists()
.then(function(exists){
  if(exists){
    return elastic.deleteIndex();
  }
}).then(function() {
  return elastic.initIndex()
  .then(elastic.initMapping)
  .then(function(){
    console.log("index has been initialized.")
  });
});

app.listen(port, function(){
  console.log('Search Service listening on port ', port);
});





