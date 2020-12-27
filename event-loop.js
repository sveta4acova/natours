const fs = require('fs');
const crypto = require('crypto');
const start = Date.now();

// process.env.UV_THREADPOOL_SIZE = 1;

setTimeout(() => console.log('Timer 1 executed'), 0);
setImmediate(() => console.log('Immediate 1 executed'));

fs.readFile('test-file.txt', () => {
  console.log('Read file');

  setTimeout(() => console.log('Timer 2 executed'), 0);
  setTimeout(() => console.log('Timer 3 executed'), 3000);
  setImmediate(() => console.log('Immediate 2 executed'));
  process.nextTick(() => console.log('Next tick'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Crypto 1 completed');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Crypto 2 completed');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Crypto 3 completed');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Crypto 4 completed');
  });
});

console.log('Hello there');
