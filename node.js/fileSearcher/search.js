'use strict'

var 
	http = require('http'),
	fs = require('fs'),
	url = require('url'),
	path = require('path');

var server = http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	var root = path.resolve('.');
	var filePath = path.join(root, pathname);
	fs.stat(filePath, function(err, files) {
		if(err) {
			console.error(err);
			return
		}
		if(files.isFile()) {
			console.log(`200, ${req.url}`);
			res.writeHead(200, {'contentType': 'text/html'})
		} else {
			filePath = path.join(filePath, 'index.html')
			fs.exists(filePath, function(exists) {
				if(exists) {
					console.log(`filPath: ${filePath}`)
					res.writeHead(200, {'contentType': 'text/html'})
				} else {
					console.error('file not found');
					res.writeHead(404)
				}
			})
		}
		fs.createReadStream(filePath).pipe(res)
	})
})

server.listen(8080);
console.log('running at 8080')