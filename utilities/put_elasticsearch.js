// code to put the data into the elasticsearch by the help of the promises
var config = require('../config/dev');
var elasticsearch_client_aws = config.elasticsearch_client_aws;
var Q = require('q');


function put_data(object)
{
	console.log('the code to put the data into the elasticsearch has started');
	var defered = Q.defer();
	obj_index = 'twitter';
	obj_type = 'tweet';
	var params = {
		index: obj_index,
		type: obj_type,
		body: object
	};
	elasticsearch_client_aws.index(params, function (error, response) {
	if(error)
	{
		defered.reject(error);
	}
  	else
  	{
  		defered.resolve(response);
  	}
  });
	return defered.promise;
}

module.exports.put_data = put_data;