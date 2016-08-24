var elastic = require('../elasticSearch');

module.exports = function(app) {
  // search for a listing
  app.get('/listings', function(req, res, next){
    if (req.query.keywords === '' && req.query.category === 'all-categories' && req.query.coordinates === '0,0') {
      elastic.matchAll()
      .then(result => {
        res.json(result);
      });
    } else {
      elastic.getSearch(req.query)
      .then(function(result){
        console.log(result);
        res.json(result);
      }).catch(err=>{
        res.send(400);
      });
    }
  });
  // create listing

  app.delete('/listings/:input', function(req, res, next){
    elastic.deleteDocument(req.params.input)
    .then(function(result){
      res.json(result);
    });
  });

  app.get('/listings/titleSearch', function(req, res) {
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