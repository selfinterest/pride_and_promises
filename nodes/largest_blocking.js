/**
 * Created by twatson on 9/10/14.
 */
var functionServer = require("../functionServer.js");

var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var Buffer = require('buffer').Buffer;
var _ = require('lodash');


var largest = function (dir, options, internal) {

	// Parse arguments.
	options = options || largest.options;

	// Enumerate all files and subfolders in 'dir' to get their stats.
	var files = fs.readdirSync(dir);
	var paths = _.map(files, function (file) { return path.join(dir, file); });
	var stats = _.map(paths, function (path) { return fs.statSync(path); });

	// Build up a list of possible candidates, recursing into subfolders if requested.
	var candidates = _.map(stats, function (stat, i) {
		if (stat.isFile()) return { path: paths[i], size: stat.size, searched: 1 };
		return options.recurse ? largest(paths[i], options, true) : null;
	});

	// Choose the best candidate.
	var result = _(candidates)
		.compact()
		.reduce(function (best, cand) {
			if (cand.size > best.size) var temp = cand, cand = best, best = temp;
			best.searched += cand.searched;
			return best;
		});

	// Add a preview if requested (but skip if this is an internal step in a recursive search).
	if (result && options.preview && !internal) {
		var fd = fs.openSync(result.path, 'r');
		var buffer = new Buffer(40);
		var bytesRead = fs.readSync(fd, buffer, 0, 40, 0);
		result.preview = buffer.toString('utf-8', 0, bytesRead);
		fs.closeSync(fd);
	}
	return result;
};
function nodeified(dir, options, callback) {
	if (arguments.length == 2) callback = options, options = null;
	try {
		callback(null, largest(dir, options));
	}
	catch (err) {
		callback(err);
	}
}

function requestHandler(req, res){
	var dir = __dirname + "/../";
	nodeified(dir, {}, function(){
		res.send({ok: true});
	});

}

functionServer(requestHandler, 5003, "Non-blocking promise server running on port 5003");