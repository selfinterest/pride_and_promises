
var util = require("util");

function SocketError(message, eventToEmit){
	Error.call(this, message);
	this.message = message;
	this.eventToEmit = eventToEmit || "error";

}

SocketError.prototype.handleError = function(socket){
	socket.emit(this.eventToEmit, this.message);
};

util.inherits(SocketError, Error);

module.exports = SocketError;

/**
 * Created by twatson on 9/7/14.
 */
