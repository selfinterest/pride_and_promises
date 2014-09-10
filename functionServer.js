/**
 * Created by twatson on 8/29/14.
 */
var express = require("express");
var app = express();
var router = express.Router();

app.disable('etag');
app.use(router);

function nocache(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
}

module.exports = function(handler, port, message){

	router.get("/:max", nocache, function(req, res){
		handler(req, res);
	});


	app.listen(port, function(){
		console.log(message);
	});
}