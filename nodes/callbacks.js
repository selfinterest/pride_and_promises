/**
 * Created by twatson on 8/29/14.
 */
var functionServer = require("./../functionServer.js");
var async = require("async");


function fib(n, callback) {
	if (n <= 1) {
		callback(null, 1);
	} else {
		async.parallel([
				function (callback) {
					fib(n - 1, callback);
				},
				function (callback) {
					fib(n - 2, callback);
				}
			],
			function (err, operands) {
				if (err) return callback(err);
				callback(null, operands[0] + operands[1]);
			});
	}
}



function requestHandler(req, res){
	var max = req.params.max;

	fib(req.params.max, function(err, n){
		res.send({n: n});
	});
}

functionServer(requestHandler, 5001, "Callback server running on port 5001");