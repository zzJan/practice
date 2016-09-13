'use strict'

var path = require('path');
var dirname = path.resolve('.')
var target = path.join(dirname, '/foo', 'index.html')

console.log(`dirname: ${dirname},\n target: ${target}`)