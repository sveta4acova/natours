const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Нужно отправить клиенту файл
  // Решение 1 (плохое)
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) {
  //     res.end('Error');
  //   }
  //
  //   res.end(data);
  // });

  // Решение 2 (лучше)
  // тут может возникнуть ситуация, что сервер не может отправлять данные так же быстро,
  // как и читает их с файла (backpressure), это плохо
  // const readable = fs.createReadStream('test-file.txt');
  //
  // readable.on('data', chunk => {
  //   // не res.end!!!
  //   res.write(chunk);
  // });
  // readable.on('error', err => {
  //   res.statusCode = 500;
  //   res.end('Some error');
  // });
  // readable.on('end', () => {
  //   res.end();
  // });


  // Решение 3 (лучшее)
  const readable = fs.createReadStream('test-file.txt');
  // readable - данные отсюда попадают в res
  // res - это по сути writable поток
  readable.pipe(res);

});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...')
})
