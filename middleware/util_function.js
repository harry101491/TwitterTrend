// the function that helps out to sort the middleware in the sns subscribe request

module.exports = function(req, res, next) {
    if (req.headers['x-amz-sns-message-type']) {
            req.headers['content-type'] = 'application/json;charset=UTF-8';
    }
    next();
};


// function mutate_middleware()
// {    
// }
// module.exports.mutate_middleware = mutate_middleware;