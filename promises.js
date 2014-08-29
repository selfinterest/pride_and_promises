/**
 * Created by twatson on 8/29/14.
 */
var functionServer = require("./functionServer.js");

var Promise = require("bluebird");

function fib(n){        //a promise that resolves to a value
	if (n <= 1){
		return Promise.resolve(1);
	} else {
		return Promise.all([
			fib(n - 1),
			fib(n - 2)
		])
		.spread(function(n1, n2){
			return Promise.resolve(n1 + n2);
		});
	}

}


function requestHandler(req, res){
	var max = req.params.max;

	fib(max).then(function(n){
		res.send({n: n});
	});

}

functionServer(requestHandler, 5000, "Non-blocking promise server running on port 5000");