/**
 * Created by twatson on 8/30/14.
 */
var sockjs = require('sockjs');
var multiplex_server = require('websocket-multiplex');
var EventEmitter = require('events').EventEmitter;
var util = require("util");

util.inherits(ExpressWebSocketEventEmitter, EventEmitter);

//var eventEmitter = new EventEmitter();

function ExpressWebSocketInterface(webSocket){
	if(this instanceof ExpressWebSocketInterface){

		this.emitter = new EventEmitter();

	} else {
		return new ExpressWebSocketInterface(webSocket);
	}
}

function ExpressWebSocketEventEmitter(socket){
	EventEmitter.call(this);

	this.connection = null;
	this.queue = [];

	this.queuedMessages = [];

	socket.on('connection', function(conn){
		this.connection = conn;

		this.queue.forEach(function(queuedEvent){
			this.on(queuedEvent.eventName, queuedEvent.handler);
		}.bind(this));

		this.queuedMessages.forEach(function(message){
			this.emit(message);
		}.bind(this));

		this.connection.on("data", function(){

		});
	}.bind(this));

	this.on = function(eventName, handler){
		if(!this.connection){       //no connection yet. Queue up the event.
			if(eventName !== "connection") {
				this.queue.push({eventName: eventName, handler: handler});
			} else {
				socket.on('connection', handler);
			}
		} else {
			//this.connection.on("data", );
			//EventEmitter.on.call(this, eventName, handler);
		}
	};

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
	options.channel = options.channel || null;


	if(!webSocket._socket) webSocket._socket = sockjs.createServer();
	if(!webSocket._multiplexer) webSocket._multiplexer = new multiplex_server.MultiplexServer(webSocket._socket);

	if(options.channel){
		var channel = webSocket._multiplexer.registerChannel(options.channel);
		options.app.socket = new ExpressWebSocketEventEmitter(channel);
	} else {
		options.app.socket = new ExpressWebSocketEventEmitter(webSocket._socket);
	}


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