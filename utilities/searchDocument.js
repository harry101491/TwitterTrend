var Q = require('q');
var config = require('../config/dev');
// var elastic_client = config.elastic_client;
var elasticsearch_client_aws = config.elasticsearch_client_aws;

function search_document(obj_index, obj_type, match_string){
  console.log("inside the search_document");
  // initialize the Q object for making the promise
  var defered = Q.defer(); 
  // make the query object first
  var query_obj = {
    "query":{
      "match": match_string
    }
  };

  elasticsearch_client_aws.search({
      index: obj_index,
      type: obj_type,
      body: {
        from:0,
        size:200,
        query: {
            match: {
              message: match_string
            }
        }
      }
  }).then(function (resp) {
      // console.log("after getting the result");
      var hits = resp.hits.hits;
      defered.resolve(hits);
  }, function (err) {
      defered.reject(err.message);
      console.trace(err.message);
  });
  // returning the promise that value will be retured.
  return defered.promise;
}

module.exports.search_document = search_document;