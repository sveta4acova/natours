const http = require('http');
const fs = require('fs');
const url = require('url')

const productsJson = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const products = JSON.parse(productsJson);
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const cardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const fillTemplate = (template, product) => {
  return template
    .replace(/{%PRODUCT_NAME%}/g, product.productName)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%ID%}/g, product.id)
    .replace(/{%NOT_ORGANIC%}/g, product.organic ? '' : 'not-organic')
    .replace(/{%IMAGE%}/g, product.image);
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const cardsHtml = products.map(product => fillTemplate(cardTemplate, product)).join('');

    res.end(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, cardsHtml));
  } else if (pathname === '/product') {
    const product = products.find(product => product.id === +query.id)

    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(fillTemplate(productTemplate, product));
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(products);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });

    res.end('<h1>Page not found!</h1>')
  }
})
server.listen(8000, () => {
  console.log('Listening on port 8000')
})
