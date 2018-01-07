// this is the worker file which do three jobs gets the data from the sqs, analyze from the natural_language_understanding and publish on to the sns
var config = require('../config/dev');
var queue_url = config.queue_url;
var util = require('util');
var aws_sqs = config.sqs;
var aws_sns = config.sns;
var topic_arn = config.topic_arn;
var natural_language_understanding = config.natural_language_understanding;
var workerpool = require('workerpool');
var Q = require('q');

function send_to_sns(message)
{
	if(topic_arn !== null && topic_arn !== undefined)
	{
		// console.log('inside the send_to_sns function');
		var defered = Q.defer();
		var sns_params = {
				Message: JSON.stringify(message),
				TopicArn: topic_arn
		};
		aws_sns.publish(sns_params, function(err, data){
			if(err !== null)
			{
				defered.reject(err);
			}
			else
			{
				defered.resolve(data);
			}
		});
		return defered.promise;
	}
}

function analyze_from_IBM(messageBody)
{
	// console.log('inside the analyze_from_IBM function');
	var defered = Q.defer();
	var analysis_param = {
		'text': messageBody.message,
		'features': {
			'concepts':{
				limit:3
			},
			'sentiment':{}			
		}
	};
	natural_language_understanding.analyze(analysis_param, function(err, data){
		if(err !== null)
		{
			defered.reject(err);
		}
		else
		{
			messageBody["label"] = data.sentiment.document.label;
			messageBody["score"] = data.sentiment.document.score;
			Q(send_to_sns(messageBody)).then(function(res){
				// console.log('the data collected from the analyze_from_IBM is:'+util.inspect(data));
				defered.resolve(res);
			});
		}
	});
	return defered.promise;
}

function consume_from_queue()
{
	if(queue_url !== null && queue_url !== undefined)
	{
		// console.log('inside the consume_from_queue function with queue_url :'+queue_url);
		var defered = Q.defer();
		var params = {
				MaxNumberOfMessages: 1,
				QueueUrl: queue_url,
				VisibilityTimeout: 120,
				WaitTimeSeconds: 0
		};
		aws_sqs.receiveMessage(params, function(err, data){
			if(err !== null)
			{
				defered.reject(err);
			}
			else
			{
				var msgBody = JSON.parse(data.Messages[0].Body);
				Q(analyze_from_IBM(msgBody)).then(function(res){
				   	var deleteParams = {
		  				QueueUrl: queue_url,
		  				ReceiptHandle: data.Messages[0].ReceiptHandle
					};
				    aws_sqs.deleteMessage(deleteParams, function(err, result) {
				     	if(err !== null)
				     	{
				     		defered.reject(err);
				     	}
				     	else
				     	{
				     		defered.resolve(res);
				     	}
				    });
			    });	
			}
		});
		return defered.promise;
	}
	
}

function execute_worker()
{
	console.log('inside the execute_worker function');
	return new Promise(function(resolve, reject){
		Q(consume_from_queue()).then(function(res){
			resolve(res);
		});
	});
}

workerpool.worker({
	execute_worker: execute_worker
});