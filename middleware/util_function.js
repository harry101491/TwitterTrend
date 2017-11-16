// the function that helps out to sort the middleware in the sns subscribe request

function mutate_middleware()
{
    return function(req, res, next) {
        if (req.headers['x-amz-sns-message-type']) {
                req.headers['content-type'] = 'application/json;charset=UTF-8';
        }
        next();
  };
}
module.exports.mutate_middleware = mutate_middleware;