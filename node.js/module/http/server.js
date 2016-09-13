'use strict'

var http = require('http')
var server = http.createServer(function(req, res) {
	console.log(`${req.method}, ${req.url}`)
	res.writeHead(200, {'contentType': 'text/html'})
	res.end('<p>hello world</p>')
})
server.listen(8080);
console.log('running in 8080')