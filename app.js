/**
 * Created by twatson on 8/29/14.
 */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = require("./server/router.js");

app.use("/api", router.api);
app.use("/templates/:templateName", function(req, res){
	var templateName = req.params.templateName;
	res.render(templateName, function(err, html){
		if(err) {
			throw new Error(err);
		} else {
			res.send(html);
		}
	});
});
app.use("/", router.web);





app.listen(3000, function(){
	console.log("Application listening on port "+3000);
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

 /// error handlers

 // development error handler
 // will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

