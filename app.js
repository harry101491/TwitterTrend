// variable declaration for getting the express and route module
var express = require('express');
var route = require('./routes');
var utility_function = require('./middleware/util_function');
// the body parser for the parsing of the json objects
var body_parser = require('body-parser');

var app = express();

var port = process.env.PORT || 3000;

app.use(utility_function());

app.use(body_parser.urlencoded({
    extended: true
}));

app.use(body_parser.json());

// to specify our static content is in public
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// setting the view engine as ejs
app.set('view engine','ejs');

// setting home for the site to be home
app.get('/', route.home);


app.get("/search:match_text?", route.postHome);

app.post("/subscribe", route.subscribe);

// listening on the port 3000
app.listen(port, function(){
	console.log("app has started to listen on the port " + port);
});