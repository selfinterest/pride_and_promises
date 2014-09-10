/**
 * Created by twatson on 8/29/14.
 */
var functionServer = require("./../functionServer.js");
var async = require("async");


var fibonacci = function (n, callback) {
	if (n <= 1) {
		callback(null, 1);
	} else {
		var lhs, rhs;
		fibonacci(n - 1, function (err, l) {
			if (err) return callback(err);
			lhs = l;
			if (rhs) callback(null, lhs + rhs);
		});
		fibonacci(n - 2, function (err, r) {
			if (err) return callback(err);
			rhs = r;
			if (lhs) callback(null, lhs + rhs);
		});
	}
};

/*function fib(n, callback) {
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
}*/



function requestHandler(req, res){
	var max = req.params.max;
	fibonacci(max, function(){
		res.send({ok: true});
	});
	/*fib(req.params.max, function(err, n){
		res.send({n: n});
	});*/
}

functionServer(requestHandler, 5001, "Callback server running on port 5001");