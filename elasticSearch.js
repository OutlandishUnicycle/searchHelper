var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var indexName = "listingIndex";

// Ping elastic search to see if its alive
client.ping({
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
  return elastinClient.indices.delte({
    index:indexName
  })
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
exports.initMapping = initMapping;


function addListing(document) {  
    return elasticClient.index({
        index: indexName,
        type: "listing",
        body: {
            id: listing.id,
            title: listing.title,
            coords: listing.coords,
            picReference: listing.picReference,
            createdAt: listing.createdAt,
            suggest: {
                input: listing.title.split(" "), // what should be used for the auto-complete analysis
                output: listing.title,  // the data sent to back to the request
                payload: listing.metadata || {} // an extra object with payload data
            }
        }
    });
}
exports.addListing = addListing;

function getSuggestions(input) {
  return ({
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





