// var config = require('./config');
// var twitter = config.twitter;
// // var elasticsearch_client = config.elastic_client;
// var elasticsearch_client_aws = config.elasticsearch_client_aws;
// //added to analyze the sentiments
// var natural_language_understanding = config.natural_language_understanding;
// var AWS = config.AWS;
// //AWS SQS 
// var sqs = new AWS.SQS({region:'us-west-2'}); 
// //sqs consumer code
// var Consumer = require('sqs-consumer');	

	
// function stream_twitter(obj_index, obj_type){
// 	console.log('the stream of twitter has started');
// 	twitter.stream('statuses/sample',function(stream){
// 		var bulkObj = [];
// 		var count = 1;
// 	stream.on('data',function(data){
// 		if(data.place !== null && data.place !== undefined && data.lang == 'en')
// 		{
// 			var obj;
// 			if(count % 100 == 0)
// 			{
// 				console.log('50 tweets has sent to elasticsearch');
// 				console.log('the value of bulk is:'+JSON.stringify(bulkObj));
// 				elasticsearch_client_aws.bulk({
// 					body: bulkObj
// 				},function(error, response){
// 					if(error)
// 					{
// 						console.log("Some error has occured while creating");
// 					}
// 					else
// 					{
// 						console.log("all is well");
// 					}
// 				});
// 				stream.destroy();
// 			}
// 			else
// 			{
// 				console.log("the value of the count is:"+ count);
// 				var lon = data.place.bounding_box.coordinates[0][0][0];
// 				var lat = data.place.bounding_box.coordinates[0][0][1];
// 				if((lat >= -90 && lat <= 90) && (lon >= -180 && lon<= 180)){
					
// 					var id = data.id;
// 					var prefix = {index: {_index: obj_index, _type: obj_type,_id:id}};
// 					obj = {"message" : data.text, "location" : {"lat":lat,"lon":lon}};
// 					bulkObj.push(prefix);
// 					bulkObj.push(obj);
// 					//console.log(JSON.stringify(obj));
					
// 					//sqs upload in a queuecode
// 					var msg = {payload: obj};
					
// 					var sqsParams = {
// 						MessageBody: JSON.stringify(msg),
// 						QueueUrl: 'https://sqs.us-east-1.amazonaws.com/417351960154/twitterTrend_queue'
// 						};
// 					sqs.sendMessage(sqsParams, function(err, data) {
// 						if (err) {
// 						console.log('ERR', err);
// 						}
// 					});
// 					//sqs consumer code
// 					var app = Consumer.create({
// 						queueUrl: 'https://sqs.us-east-1.amazonaws.com/417351960154/twitterTrend_queue',
// 						region: 'eu-west-2',
// 						batchSize: 10,
// 						handleMessage: function (message, done) {
// 						var msgBody = JSON.parse(message.Body);
// 						console.log(msgBody);
// 						return done();
// 						}
// 					});
					
// 					app.on('error', function (err) {
// 						console.log(err);
// 					});

// 					app.start();
					
// 					// to analyze the sentiments
// 					var parameters = {
// 						'text': data.text,
// 						'features': {
// 						'entities': {
// 						'emotion': true,
// 						'sentiment': true,
// 						'limit': 2
// 						},
// 						'keywords': {
// 						'emotion': true,
// 						'sentiment': true,
// 						'limit': 2
// 						}				
// 						}
// 					}

// 					natural_language_understanding.analyze(parameters, function(err, response) {
// 					if (err)
// 						console.log('error:', err);
// 					//else
// 					//	console.log(JSON.stringify(response, null, 2));
// 					});
					
// 				}
// 				count++;
// 			}
// 		}
// 	});
// 	stream.on('error',function(error){
// 		throw error;
// 	});
// });
// 	console.log('the stream of twitter has stoped');
// }

// module.exports.twitter_stream = stream_twitter;