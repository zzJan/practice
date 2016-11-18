const http = require('http');

http.createServer((req, res) => {
	res.writeHeader(200, {
		'content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
	})
    res.end('you got this')
}).listen(8080)
