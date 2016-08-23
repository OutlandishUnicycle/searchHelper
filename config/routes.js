var elastic = require('../elasticSearch');

module.exports = function(app) {
  // search for a listing
  app.get('/listings', function(req, res, next){
    console.log(req.query);
    if (req.query.keywords === '' && req.query.category === 'all-categories' && req.query.coordinates === '0,0') {
      elastic.matchAll()
      .then(result => {
        res.json(result);
      })
    } else {
      elastic.getSearch(req.query)
      .then(function(result){
        res.json(result);
      }).catch(err=>{
        res.send(400);
      });
    }
  });
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
      res.json(result);
    });
  });
  app.delete('/listings/:input', function(req, res, next){
    elastic.deleteDocument(req.params.input)
    .then(function(result){
      res.json(result);
    });
  });

  app.get('/listings/geoSearch', function(req, res) {
    elastic.titleSearch(req.query)
    .then(result=>{
      console.log(result)
      res.json(result.hits.hits);
    })
  });

  app.get('/listings/count', function(req, res) {
    elastic.getCount()
      .then(resp => {
        res.send(resp);
      });
  });

};