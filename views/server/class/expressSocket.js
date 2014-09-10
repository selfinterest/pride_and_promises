/**
 * Created by twatson on 9/7/14.
 */

var fs = require("fs"), path = require("path"), fork = require("child_process").fork, spawn = require("child_process").spawn;
var ss = require("socket.io-stream");

exports = module.exports = function expressSocket(io){
	//Set up sockets for nodes
	var nodePath = path.resolve(__dirname + "/../../nodes");
	var nodes = fs.readdirSync(nodePath);

	//Set up namespaces
	var nodeSockets = {};

	//Really, really hackish. Oh well.
	var nodePorts = {
		"fib_blocking.js": 5002,
		"fib_callbacks.js": 5001,
		"fib_promises.js": 5000,
		"largest_blocking.js": 5003,
		"largest_callbacks.js": 5004,
		"largest_promises.js": 5005
	};

	nodes.forEach(function(nodeName){
		if(!nodeSockets[nodeName]){
			console.log("Setting up namespace "+nodeName);
			var namespace = io.of("/" + nodeName);
			namespace.on("connection", function(socket){
				console.log("Connecting to namespace");

				if(!nodeSockets[nodeName]) nodeSockets[nodeName] = {};
				nodeSockets[nodeName].socket = socket;
				socket.on("start", function(){
					console.log("STARTING");


					if(!nodeSockets[nodeName].process){
						nodeSockets[nodeName].process = spawn("node", [path.join(nodePath, nodeName)]);
						nodeSockets[nodeName].process.stdout.setEncoding("utf8");
						nodeSockets[nodeName].process.stderr.setEncoding("utf8");
						nodeSockets[nodeName].process.stdout.on("data", function(data){
							socket.emit("data", data);
							console.log(data);

						});
						nodeSockets[nodeName].process.stderr.on("data", function(err){
							console.log(err);
							socket.emit("error", err);
						});

						nodeSockets[nodeName].process.on("exit", function(){
							nodeSockets[nodeName].process = null;
							socket.emit("exit");
						});
					} else {
						console.log("Process already exists??");
						socket.emit("data", "nothing in particular");
					}
				});
				socket.on("exit", function(){
					if(nodeSockets[nodeName]){
						if(nodeSockets[nodeName].process){
							nodeSockets[nodeName].process.kill();
						}
						if(nodeSockets[nodeName].wrk){
							nodeSockets[nodeName].wrk.kill();
						}
					}

				});

				socket.on("test", function(testParameters){
					var port = nodePorts[nodeName];
					var connections = "-c " + (testParameters.connections || 100);
					var number = testParameters.number || 8;
					var concurrency = "-t " + (testParameters.concurrency || 5);
					nodeSockets[nodeName].wrk = spawn("wrk", [connections, concurrency, "http://127.0.0.1:"+port+"/"+number]);
					var wrk = nodeSockets[nodeName].wrk;
					wrk.stdout.setEncoding("utf8");
					wrk.stderr.setEncoding("utf8");

					wrk.stdout.on("data", function(data){
						socket.emit("test_data", {node: nodeName, data: data});
					});

					wrk.stderr.on("data", function(error){
						console.log(error);
						socket.emit("error", error);
					});

					wrk.on("exit", function(){
						socket.emit("test_exit", {node: nodeName})
					});

				});
			});
		}

		/*nodeSocket.on("start", function(){
			if(!nodeSocket.process){
				nodeSocket.process = fork(path.join(nodePath, node));

			}

		});*/
		//nodeSockets[nodeName] = nodeSocket;
	});

	var mainNodeSocket = io.of("/nodes");

	mainNodeSocket.on("connection", function(socket){
		socket.emit("nodes", nodes);
		nodes.forEach(function(nodeName){
			if(nodeSockets[nodeName]){
				if(nodeSockets[nodeName].socket && nodeSockets[nodeName].process){
					nodeSockets[nodeName].socket.emit("data", "something");
				}

			}

		});
	});

	/*var nodeProcesses = {};
	socket.on("start_node", function(node){
		if(nodes.indexOf(node) < 0){
			socket.emit("error", "Invalid node");
		} else {
			socket.join(node);      //join the node channel, where all output from its process will be sent
			nodeProcesses[node] = fork(path.join(nodePath, node));
			var nodeProcess = nodeProcesses[node];
			nodeProcess.stdout.on("data", function(data){
				io.to(node).emit('data');
			});
		}
	});

	socket.emit("nodes", JSON.stringify(nodes));

	/*nodes.forEach(function(node){

		/*socket.of("/"+node)
			.on("start", function(){

			});*/
	//});
	/*socket
		.of("/node")

	on("execute_command", function(data){
		//Data is JSON: {command: string, arguments: []
	});*/
};