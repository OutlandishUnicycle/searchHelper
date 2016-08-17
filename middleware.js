var morgan = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app) {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
};