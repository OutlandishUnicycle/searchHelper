var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var indexName = "listings";

// Ping elastic search to see if its alive
elasticClient.ping({
  requestTimeout: 30000,

  // undocumented params are appended to the query string
  hello: "elasticsearch"
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.error('All is well.');
  }
});

// Put Mapping
// Mapping for the Listing Index
function initMapping() {  
  return elasticClient.indices.putMapping({
    index: indexName,
    type: "listing",
    body: {
      properties: {
        id: { type: "integer"},
        title: { type: "string" },
        zipcode: { type: "integer" },
        picReference: { type: "string" },
        category: { type: "string" },
        coordinates: {type: "geo_point"},
        createdAt: {type: "date"},
      },

    }
  });
}
module.exports.initMapping = initMapping;


//Get the mappings for field properties
function getMap() {
	return elasticClient.indices.getFieldMapping({
	  index: indexName,
	  type: "listing"
	})
}
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



function addListing(listing) {  
    return elasticClient.index({
        index: indexName,
        type: "listing",
        body: {
            id: listing.id,
            title: listing.title,
            zipcode: listing.coords,
            status: listing.status,
            picreference: listing.picreference,
            category: listing.category,
            description: listing.description,
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
    // method: "GET",
    index: indexName,
    type: "listing",
    body: {
      listingsuggest: {
        text: input,
        term: {
          field: 'title',
        }
      }
    }
  });
}

module.exports.getSuggestions = getSuggestions;
 
function getSearch(input){
	var params = {
    index: indexName,
    type: "listing",
    body: {
    	query: {
	      bool: {
	        must: [{ "match" : { "status" : "0" } }],
	      }
      }
    },
  };

  if (input.keywords !== "") {
  	params.body.query.bool.must.push({ "match": {  "title" : {"query": input.keywords, "fuzziness": "2"}}  })
  }
  if (input.category !== "all-categories") {
    params.body.query.bool.must.push({"match" : { "category": input.category } })	
  }
  if (input.coordinates) {
  	params.body.query.bool.filter = {
      geo_distance: {
        distance: input.distance,
        coordinates : input.coordinates,
		    }
      };
  }
  return elasticClient.search(params);
}


module.exports.getSearch = getSearch;

function geoSearch(input) {
  return elasticClient.search({
	  index: indexName,
	  type: "listing",
	  body: {
	    query: {
	      match: {
	        title: input.title,
	      },
      filter: {
        geo_distance: {
	        distance: input.distance,
	        location : input.coords,
			    }
        }
      }
    }
	});
}

module.exports.geoSearch = geoSearch;

function deleteDocument(input){
  return elasticClient.delete({
    index: indexName,
    type: "listing",
    id:'input'
  });
}

module.exports.deleteDocument = deleteDocument;
