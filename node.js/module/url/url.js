'use strict'

var url = require('url');
var part = url.parse('http://user:pass@host.com:8080/path/to/file?query=string#hash')
console.log(part)