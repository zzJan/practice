'use strict'

var fs = require('fs')
var ws = fs.createWriteStream('o.txt', 'utf-8');
ws.write('hello');
ws.write('end');
ws.end()