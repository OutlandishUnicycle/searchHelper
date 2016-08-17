var elastic = require('./elasticSearch');

module.exports = function(app) {
  // create listing
  app.post('/', function(req, res, next){
    elastic.addListing(req.body)
    .then(function(result){
      res.json(result);
    });
  });
  // suggest listings
  app.get('/suggest/:input', function(req, res, next){
    elastic.getSuggestions(req.params.input).
    then(function(result) {
      res.json(result) 
    });
  });
};