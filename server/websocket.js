/**
 * Created by twatson on 8/30/14.
 */
var sockjs = require('sockjs');
var multiplex_server = require('websocket-multiplex');
var EventEmitter = require('events').EventEmitter;
var util = require("util");
var twUtils = require("./tw-utils.js");
var TreeNode = require("./class/TreeNode.js");
util.inherits(ExpressWebSocketEventEmitter, EventEmitter);

//var eventEmitter = new EventEmitter();

function ExpressWebSocketEventEmitter(socket, multiplexer){
	EventEmitter.call(this);

	this.channels = {};
	this.connection = null;

	this.socket = socket;
	this.multiplexer = multiplexer;


	/*this.channels = {
		name: "root",
		children: {},
		parent: null
	};*/

	this.channels.root = new TreeNode(null, "root");
	this.channels.root.channel = this.multiplexer.registerChannel(".");

	//Anything directed at root channel is assumed to be registration of sub channels
	this.channels.root.channel.on("connection", function(conn){
		conn.on("data", function(data){
			//data can be broadcast: or register: or status: ..?
			var commandParts = data.match(/^(.+): (.+)/), command, specifics;
			if(commandParts){
				command = commandParts[1];
				specifics = commandParts[2];
				if(command == "register"){

				}
			}
		});
	});

	//Register the root channel
	//this.channels.channel = this.multiplexer.registerChannel("/");

	//this.channels.channel.on('connection', function(conn){

	//});

	this.socket.on('connection', function(conn){
		this.connection = conn;
		conn.on('data', function(message){
			var t = message.split(",");
			var type = t.shift(), topic = t.shift(), payload = t.join(",");
			if(type == "registerChannel"){
				var channelPath = topic.split(".");

				channelPath.forEach(function(channelName, i){
					var root = this.channels.root;
					root.children = {
						children: {},
						parent: root
					};

					var fnStr =  "" +
						"" +
						""
					//var fnStr = new Function(channelPath, channelName, i)
					/*if(i == 0){
						if(typeof this.channels.root.children[channelName] == "undefined") {
							this.channels.root.children[channelName] = {
								children: {},
								parent: this.channels.root
							}
						}
					} else {
						for(var x = 0; x < i; x++){
							this.channels.root.children[channelName]
						}
					}*/

				}.bind(this));

				/*channelPath.forEach(function(channelName, i){
					var channelDepth = this.channels;
					while(typeof channelDepth.channels !== "undefined"){
						channelDepth = channelDepth.channels || {};
					}
					channelDepth.channels = {};
					channelDepth.channel = this.multiplexer.registerChannel()
					if(!(channelName in this.multiplexer.registered_channels)){
						//If channel is not already registered...
						var channel = this.multiplexer.registerChannel(channelName);

					}
				}.bind(this));*/
			}
		}.bind(this));
	}.bind(this));

	/*this.on = function(route, handler){

	};*/



	//this.queue = [];
	//this.queuedMessages = [];

	//this.channel.GET = multiplexer.registerChannel("GET");
	//this.channel.PUT = multiplexer.registerChannel("PUT");





	/*socket.on('connection', function(conn){
		this.connection = conn;


		this.queue.forEach(function(queuedEvent){
			this.on(queuedEvent.eventName, queuedEvent.handler);
		}.bind(this));

		this.queuedMessages.forEach(function(message){
			this.emit(message);
		}.bind(this));

		/*this.connection.on("data", function(message){
			this.emit(message);
		}.bind(this));*/

	//}.bind(this));

	this.on = function(route, handler){

		/*if(!this.connection){       //no connection yet. Queue up the event.
			if(eventName !== "connection") {
				this.queue.push({eventName: eventName, handler: handler});
			} else {
				socket.on('connection', handler);
			}
		} else {

			//this.addEvent(eventName, handler);
			//this.connection.on("data", handler);
			//EventEmitter.on.call(this, eventName, handler);
		}*/
	};

	this.get = function(route, handler){

		this.connection.on("data", function(message){
			handler(message, this.connection);
		}.bind(this));
	};

	this.post = function(){

	}

	this.put = function(){

	}

	this.delete = function(){

	}

	/*this.addEvent = function(eventName, handler){

	};*/

	this.emit = function(message){
		if(!this.connection){
			this.queuedMessages.push(message);
		} else {
			this.connection.write(message);
		}

	}
}



function webSocket(options){
	options = options || {};
	if(!options.httpServer) throw new Error("HttpServer is required");
	if(!options.app) throw new Error("Express app is required");
	options.prefix = options.prefix || "/socket";


	if(!webSocket._socket) webSocket._socket = sockjs.createServer();
	if(!webSocket._multiplexer) webSocket._multiplexer = new multiplex_server.MultiplexServer(webSocket._socket);

	options.app.socket = new ExpressWebSocketEventEmitter(webSocket._socket, webSocket._multiplexer);



	webSocket._socket.installHandlers(options.httpServer, {prefix: options.prefix});


}
/*function WebSocket(httpServer, app, prefix){
	if(this instanceof WebSocket){
		prefix = prefix || "/socket";
		if(!WebSocket._socket) {
			WebSocket._socket = sockjs.createServer();
		}

		this.socket = WebSocket._socket;        //only one socket

		this.events = new ExpressWebSocketEventEmitter(this.socket, app);       //link the socket to the app

		//app.socket = ExpressWebSocketInterface(this);


		this.socket.installHandlers(httpServer, {prefix: prefix});

	} else {
		return new WebSocket(httpServer, expressApp, prefix);
	}
}*/

webSocket._socket = null;
webSocket._multiplexer = null;

module.exports = webSocket;