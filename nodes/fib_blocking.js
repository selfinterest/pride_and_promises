/**
 * Created by twatson on 8/29/14.
 */
var functionServer = require("./../functionServer.js");


function fib(n)
{
	//console.log(n);
	if (n <= 1){
		return 1;
	}

	return fib(n - 1) + fib(n - 2);

}

function nodeified(n, callback){
	try {
		callback(null, fib(n));
	} catch(err){
		callback(err);
	}
}
function requestHandler(req, res){
	var max = req.params.max;

	nodeified(max, function(){
		res.send({ok: true});
	});
	// var n = fib(max);


	//res.send({n: n});

}


functionServer(requestHandler, 5002, "Blocking synchronous server running on port 5002");
