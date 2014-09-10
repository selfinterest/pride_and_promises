/**
 * Created by twatson on 9/10/14.
 */
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var Buffer = require('buffer').Buffer;
var _ = require('lodash');

var functionServer = require("../functionServer.js");

var largest = function (dir, options, internal) {

	// Parse arguments.
	options = options || largest.options;

	// Get all file stats in parallel.
	return fs.readdirAsync(dir)
		.then (function (files) {
		var paths = _.map(files, function (file) { return path.join(dir, file); });
		return Promise.all(_.map(paths, function (path) { return fs.statAsync(path); }))
			.then(function (stats) { return [paths, stats]; });
	})

		// Build up a list of possible candidates, recursing into subfolders if requested.
		.spread(function (paths, stats) {
			return Promise.all(
				_.map(stats, function (stat, i) {
					if (stat.isFile()) return Promise.resolve({ path: paths[i], size: stat.size, searched: 1 });
					return options.recurse ? largest(paths[i], options, true) : Promise.resolve(null);
				})
			);
		})

		// Choose the best candidate.
		.then(function (candidates) {
			return _(candidates)
				.compact()
				.reduce(function (best, cand) {
					if (cand.size > best.size) var temp = cand, cand = best, best = temp;
					best.searched += cand.searched;
					return best;
				});
		})

		// Add a preview if requested (but skip if this is an internal step in a recursive search).
		.then(function (result) {
			if (result && options.preview && !internal) {
				var fd_;
				return fs.openAsync(result.path, 'r')
					.then(function (fd) {
						fd_ = fd;
						var buffer = new Buffer(40);
						return fs.readAsync(fd, buffer, 0, 40, 0);
					})
					.spread(function (bytesRead, buffer) {
						result.preview = buffer.toString('utf-8', 0, bytesRead);
						return fs.closeAsync(fd_);
					})
					.then(function () {
						return result;
					});
			} else {
				return result; // Return without adding preview.
			}
		});
};
largest.options = {};

function requestHandler(req, res){
	var dir = __dirname + "/../";
	largest(dir).then(function(result){
		res.send({ok: result});
	});

}

functionServer(requestHandler, 5005, "Non-blocking promise server running on port 5005");