'use strict'

var fs = require('fs')
var rs = fs.createReadStream('o.txt', 'utf-8');
var ws = fs.createWriteStream('oo.txt', 'utf-8')
rs.pipe(ws)