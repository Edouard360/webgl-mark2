var tmp = console.log
console.log = function () {}

try {
  require('simple-server')
  console.log = tmp
  console.log('To see the benchmark, please open your browser at http://localhost:3000/index.html')
} catch (err) {
  console.log = tmp
  console.log('We couldn\'t start the server, probably the address http://localhost:3000 is already in use?')
  console.log(err.message)
}

