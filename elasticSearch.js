var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
  host: 'search-discollect-elasticsearch-vnmwwax32cnkpgx22yru5h3ixu.us-west-1.es.amazonaws.com:80',
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
        title: {"type":     "string",
                // "analyzer": "autocomplete", 
                // "search_analyzer": "standard"
              },
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
    index:indexName,
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



function getCount () {
	return elasticClient.count({
		index: indexName,
	});
}

module.exports.getCount = getCount;

 
function getSearch(input){
	console.log(input)
	var params = {
    index: indexName,
    type: "listing",
    size: 9,
    from: input.startFrom,
    body: {
    	query: {
	      bool: {
	        must: [],
	      }
      }
    },
  };

  if (input.keywords !== "") {
  	params.body.query.bool.must.push({ "match_phrase_prefix" : {
      title : {
          "query": input.keywords,
          "slop" : 5,
          "fuzziness" : 2,
      }
    }})
  }
  if (input.category !== "all-categories") {
    params.body.query.bool.must.push({"match" : { "category":{ 'query' : input.category, }} })	
  }
  if (input.coordinates !== '0,0') {
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

function titleSearch(input) {
  return elasticClient.search({
	  index: indexName,
	  type: "listing",
	  body: {
	    query: {
        "match_phrase_prefix" : {
          title : {
            "query": input.title,
            "slop" : 5,
            "max_expansions": 50,
            "fuzziness" : 1,
          }
   		  }
      }
    }
	});
};

module.exports.titleSearch = titleSearch;

function deleteDocument(input){
  return elasticClient.delete({
    index: indexName,
    type: "listing",
    id:input
  });
}

module.exports.deleteDocument = deleteDocument;

function matchAll(input) {
	return elasticClient.search({
		index: indexName,
		type: 'listing',
		size: 9,
    from: input.startFrom,
		body : {
			query: { 
				match_all : {} 
			}
		}
	});
}

module.exports.matchAll = matchAll;