var tmp = console.log
console.log = function() {}
require('simple-server')
console.log = tmp
console.log('To see the benchmark, please open your browser at http://localhost:3000/index.html')