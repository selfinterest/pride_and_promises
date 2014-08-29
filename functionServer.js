/**
 * Created by twatson on 8/29/14.
 */
var express = require("express");
var app = express();
var router = express.Router();

app.use(router);

module.exports = function(handler, port, message){
	router.get("/:max", function(req, res){
		handler(req, res);
	});
	app.listen(port, function(){
		console.log(message);
	});
}