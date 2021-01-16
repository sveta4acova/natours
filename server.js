const dotenv = require('dotenv');
// добавляем в process.env данные из config.env
// делаем до того, как выполнится код app.js
dotenv.config({ path: './config.env' });
// console.log(process.env.NODE_ENV)

const app = require('./app');

// значение окружения из express
// console.log(app.get('env'))

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
