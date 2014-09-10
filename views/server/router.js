
var express = require("express");
var web = express.Router();
var api = express.Router();


web.get("/", function(req, res){
	res.render("index");
});

api.get("/", function(req, res){
	res.send({});
});


module.exports = {
	web: web,
	api: api
};