
/**
 * Created by twatson on 9/7/14.
 */

var fork = require("child_process").fork;
var path = require("path"), SocketError = require("./SocketError.js");

exports.node = function(io){
	var nodes = [
		"callbacks",
		"promises",
		"blocking"
	];

	var nodeProcesses = {};

	function isValidNode(which){
		return nodes.indexOf(which) > -1;
	}

	function notAlreadyRunning(which){
		return typeof nodeProcesses[which] == "undefined";
	}

	io
		.of("/run_node")
		.on('connection', function(socket){
			socket.on('run', function(data){

				//data is JSON. Key which determines which node to activate. Key arguments determines arguments to send to the process, if any.

				try {
					data = JSON.parse(data);
					var which = data.which;
					var args = data.arguments || [];
					if(!Array.isArray(args)) args = [args];
					if(isValidNode(which) && notAlreadyRunning(which)){
						var nodePath = path.resolve("../../", which + ".js");
						nodeProcesses[which] = fork(nodePath, args);
					} else {
						if(!isValidNode(which)){
							throw new SocketError("Invalid node. Try one of " + nodes.join(", "));
						} else if (!notAlreadyRunning(which)){
							throw new SocketError("Node "+which+" is already running.");
						}

					}
				} catch (e){
					if(e instanceof SocketError){
						e.handleError(socket);
					} else {
						socket.emit("error", e.message);
					}

				}
			});
		});
};