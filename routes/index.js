var path = require('path');
var search_doc = require('../utilities/searchDocument');
var process_data = require('../utilities/process_data');
var put_in_elasticsearch = require('../utilities/put_elasticsearch');
var Q = require('q');
var config = require('../config/dev');
var aws_sns = config.sns;

function homePage(req, res){
	// process the data and send it to the sns
	process_data.process_data();
	res.render('home');
}

function handlingPost(req,res){
	var text = req.param('match_text');
	
	console.log("text that i got from the get request  "+text);
	
	Q(search_doc.search_document("twitter","tweet",text)).then(function(data){
		console.log("the data is:"+ JSON.stringify(data));
		res.send(data);
	});
}

function pageNotFound(req, res){
	res.send('<h2> this page is not available on this site</h2>')
}

function handling_sub_notification(req, res){
    msgType = req.headers['x-amz-sns-message-type'];
    if(msgType == 'SubscriptionConfirmation')
    {
		var params = {
	            Token: req.body.Token,
	            TopicArn: req.body.TopicArn,
	            AuthenticateOnUnsubscribe:"true"
	    }
	    aws_sns.confirmSubscription(params, function(err, data){
            if(err !== null)
            {
                console.log(util.inspect(err));
            }
            else
            {
                console.log('the data is :'+ JSON.stringify(data));
            }
	    });
    }
    else if(msgType == 'Notification')
    {
        console.log('Notification has been sent to the endpoint by the sns');
        Q(put_in_elasticsearch.put_data(req.body)).then(function(res){
        	console.log('the data sent from the elasticsearch is:'+util.inspect(res));
        });
    }
    else
    {
    	console.log('the type of the is not suitable');
    }
}

module.exports.home = homePage;
module.exports.notFound = pageNotFound;
module.exports.postHome = handlingPost;
module.exports.subscribe = handling_sub_notification;