'use strict'

var fs = require('fs');
var rs = fs.createReadStream('o.txt', 'utf-8');
rs.on('data', function(chunk) {
	console.log(`data: ${chunk}`)
})
rs.on('end', function() {
	console.log('finish')
})
rs.on('error', function(err) {
	console.error(err)
})