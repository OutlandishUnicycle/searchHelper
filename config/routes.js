var elastic = require('../elasticSearch');

module.exports = function(app) {
  // create listing
  app.post('/listings', function(req, res, next){
    elastic.addListing(req.body)
    .then(function(result){
      res.json(result);
    });
  });
  // suggest listings based on keyword
  app.get('/listings/suggest/:input', function(req, res, next){
    elastic.getSuggestions(req.params.input)
    .then(function(result) {
      res.json(result) 
    });
  });
};