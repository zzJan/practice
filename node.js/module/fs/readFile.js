'use strict'

var fs = require('fs');
fs.readFile('o.txt', 'utf-8', function(err, data) {
	if(err) {
		console.error(err)
		return
	}
	console.log(data)
})

// try {
// 	var data = fs.readFileSync('o.txt', 'utf-8')
// 	console.log(data)
// } catch(e) {
// 	console.error(e)
// }