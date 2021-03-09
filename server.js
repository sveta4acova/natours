const dotenv = require('dotenv');
const mongoose = require('mongoose');
// добавляем в process.env данные из config.env
// делаем до того, как выполнится код app.js
dotenv.config({ path: './config.env' });
// console.log(process.env.NODE_ENV)

process.on('uncaughtException', err => {
  console.log(err)
  console.log('💥💥💥uncaughtException💥💥💥');
  process.exit(1);
});

const app = require('./app');

// значение окружения из express
// console.log(app.get('env'))

const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);

mongoose
  // .connect(process.env.DB_LOCAL_URL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

process.on('unhandledRejection', err => {
  // мы не можем завершить процесс сразу, вызвав process.exit();
  // нужно подождать пока сервер завершит активные процессы (pending)
  // поэтому передаем колбэк в sever.close и внутри process.exit();
  console.log('💥💥💥unhandledRejection💥💥💥');
  server.close(() => {
    process.exit(1);
  });
});
