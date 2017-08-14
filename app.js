
/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	, bodyParser = require('body-parser')
	, logger = require('morgan')
	, methodOverride = require('method-override')
	, errorHandler = require('errorhandler');

var app = express();
var url = require('url');
var fs = require('fs');
var login = require('./loginDB');

function read_json_f()	{
	var file = './loginDB.json';
	return fs.readFileSync(file);
}

function list()	{
	return JSON.parse(read_json_f());
};

function query(id){
	var json_r = JSON.parse(read_json_f());
	var result = json_r.result;
	
	for ( var i = 0; i < result.length; i++)	{
		var login = result[i];
		if(login.identifier == id)	{
			return login;
		}
	}
	return -1;
};

function getPW(id)	{
	var json_r = JSON.parse(read_json_f());
	var result = json_r.result;
	
	for ( var i = 0; i < result.length; i++)	{
		var login = result[i];
		if(login.identifier == id)	{
			return login.password;
		}
	}
	return -1;
}


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/login', function(request, response){
	var get_params = url.parse(request.url, true).query;
	if (Object.keys(get_params).length == 0)	{
		console.log("Error Log in data.");
		// Error case.
		response.setHeader('content-type', 'application/json');
		response.end("NO DATA");
	}
	// get_params.id, pw, login, signup
	else if (get_params.sign_up == "false"){
		console.log("Log in wanted..");
		// Log in.
		response.setHeader('content-type', 'application/json');
		if(getPW(get_params.id) == get_params.pw)	{
			// Log in success.
			console.log("Successed log in!");
			response.end(JSON.stringify({
				response:"success"
			}));
		}
		else {
			// Log in fail.
			console.log("Failed to log in!");
			response.end(JSON.stringify({
				response:"fails"
			}));
		}
	}
	else {
		console.log("Sign up ..");
		// Signed up.
		response.setHeader('content-type', 'application/json');
		if(query(get_params.id) == -1)	{
			// Sign up success.
			response.end(JSON.stringify({
				response:"success"
			}));
		}
		else {
			// Sign up fails.
			response.end(JSON.stringify({
				response:"fails"
			}));
		}
	}
});

app.get('/login', function(request, response)	{
	var get_params = url.parse(request.url, true).query;
	if (Object.keys(get_params).length == 0)	{
		console.log("Error Log in data.");
		// Error case.
		response.setHeader('content-type', 'application/json');
		response.end("NO DATA");
	}
	// get_params.id, pw, login, signup
	else if (get_params.sign_up == "false"){
		console.log("Log in wanted..");
		// Log in.
		response.setHeader('content-type', 'application/json');
		if(getPW(get_params.id) == get_params.pw)	{
			// Log in success.
			console.log("Successed log in!");
			response.end(JSON.stringify({
				response:"success"
			}));
		}
		else {
			// Log in fail.
			console.log("Failed to log in!");
			response.end(JSON.stringify({
				response:"fails"
			}));
		}
	}
	else {
		console.log("Sign up ..");
		// Signed up.
		response.setHeader('content-type', 'application/json');
		if(query(get_params.id) == -1)	{
			// Sign up success.
			response.end(JSON.stringify({
				response:"success"
			}));
		}
		else {
			// Sign up fails.
			response.end(JSON.stringify({
				response:"fails"
			}));
		}
	}
});

app.get('/login/:identifier', function(request, response){
	console.log('id');
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(query(request.params.identifier)));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
