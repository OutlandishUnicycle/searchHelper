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
    var promises = [
      'Thing Explainer',
      'The Internet Is a Playground',
      'The Pragmatic Programmer',
      'The Hitchhikers Guide to the Galaxy',
      'Trial of the Clone'
    ].map(function(listingTitle){
      return elastic.addListing({
        title: listingTitle,
        content: listingTitle + " content",
        metaData: {
          titleLength: listingTitle.length
        }
      });
    });
    return Promise.all(promises);
  })
});

app.listen(port, function(){
  console.log('Search Service listening on port ', port);
});





