var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var indexName = "listingindex";

// Ping elastic search to see if its alive
elasticClient.ping({
  requestTimeout: 30000,

  // undocumented params are appended to the query string
  hello: "elasticsearch"
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

//Delete an existing index
function deleteIndex() {
  return elasticClient.indices.delete({
    index:indexName
  });
}
module.exports.deleteIndex = deleteIndex;

//Create the index
function initIndex() {
  return elasticClient.indices.create({
    index:indexName
  });
}
module.exports.initIndex = initIndex;

//check if the index exists
function indexExists() {
  return elasticClient.indices.exists({
    index:indexName
  });
}
module.exports.indexExists = indexExists;

// Mapping for the Listing Index
function initMapping() {  
  return elasticClient.indices.putMapping({
      index: indexName,
      type: "listing",
      body: {
          properties: {
              title: { type: "string" },
              content: { type: "string" },
              suggest: {
                  type: "completion",
                  analyzer: "simple",
                  search_analyzer: "simple",
                  payloads: true
              }
          }
      }
  });
}
module.exports.initMapping = initMapping;


function addListing(listing) {  
    return elasticClient.index({
        index: indexName,
        type: "listing",
        body: {
            title: listing.title,
            content: listing.content,
            suggest: {
                input: listing.title.split(" "), // what should be used for the auto-complete analysis
                output: listing.title,  // the data sent to back to the request
                payload: listing.metadata || {} // an extra object with payload data
            }
        }
    });
}
module.exports.addListing = addListing;

function getSuggestions(input) {
  return elasticClient.suggest({
    index: indexName,
    type: "listing",
    body: {
      docsuggest: {
        text: input,
        completion: {
          field: "suggest",
          fuzzy: true
        }
      }
    }
  });
}

module.exports.getSuggestions = getSuggestions;





