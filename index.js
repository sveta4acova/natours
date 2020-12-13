const http = require('http')
const server = http.createServer((req, res) => {
  const pathName = req.url

  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the overview');
  } else if (pathName === '/product') {
    res.end('This is a product');
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-header': 'my-header',
    });

    res.end('<h1>Page not found!</h1>')
  }
})
server.listen(8000, () => {
  console.log('Listening on port 8000')
})
