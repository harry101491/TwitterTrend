var config = require('../config/dev');
var emoji_strip = require('emoji-strip');
var twitter = config.twitter;
var queue_url = config.queue_url;
var util = require('util');
var aws_sqs = config.sqs;
var Q = require('q');
var workerpool = require('workerpool');
var pool = workerpool.pool(__dirname + '/worker.js', [{
	'minWorkers': 2,		
    'maxWorkers': 3
}]);


// function for the removal of the url from the tweet data
function removeUrl(tweetString)
{
	return tweetString.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
}

// function for the removal of the emoji from the tweet data
function removeEmoji(tweetString)
{
	return emoji_strip(tweetString);
}

// function that returns the promise for the sending into the queue
function push_on_queue(obj)
{
	if(queue_url !== null && queue_url !== undefined)
	{
		console.log("Inside the push_on_queue function ");
		var defered = Q.defer(); 
		var sqs_params = {
			MessageBody: JSON.stringify(obj),
			QueueUrl: queue_url
		};
		aws_sqs.sendMessage(sqs_params, function(err, data){
			if(err !== null)
			{
				 defered.reject(err);
			}
			else
			{
				pool.exec('execute_worker', null).then(function(res){
					console.log("inside the app.js exec");
					defered.resolve(res);
					console.log(pool.stats());
				});
			}
		});
		return defered.promise;
	}
}


// function to stream the tweets from the tweeter streaming api
function stream_twitter(){
	console.log('the stream of twitter has started');
	twitter.stream('statuses/sample',function(stream){
		stream.on('data',function(data){
			// new json data object to be formed whenever the tweet comes
			var obj;
			// applying some conditioning on the tweet data
			if(data.place !== null && data.place !== undefined && data.lang == 'en')
			{
				var lon = data.place.bounding_box.coordinates[0][0][0];
				var lat = data.place.bounding_box.coordinates[0][0][1];
				if((lat >= -90 && lat <= 90) && (lon >= -180 && lon<= 180))
				{
					// get id for the the twitter data
					var id = data.id;
					var removedUrl = removeUrl(data.text);
					var removedEmoji = removeEmoji(removedUrl);
					// object to push into the queue
					obj = {"id":id, "message" : removedEmoji, "location" : {"lat":lat ,"lon":lon}};
					// console.log('The data before pusing into the queue is: '+ util.inspect(obj));
					// the promise for the data to be sent
					Q(push_on_queue(obj)).then(function(res){
						 console.log("inside the then");
						 console.log(util.inspect(res));
					});					
				}
			}
		});

		stream.on('error',function(error){
			throw error;
		});
	});
}

module.exports.process_data = stream_twitter;