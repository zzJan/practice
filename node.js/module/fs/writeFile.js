'use strict'

var fs = require('fs');
var data = 'goodbye'
fs.writeFile('o.txt', data, function(err) {
	if(err) {
		console.error(err)
		return
	}
	console.log('ok')
})

try {
	fs.writeFileSync('o.txt', data);
	console.log('ok')
} catch(e) {
	console.error(e)
}