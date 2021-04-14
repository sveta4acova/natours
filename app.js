const express = require('express');
const morgan = require('morgan');
const path = require('path');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/usersRouter');
const reviewsRouter = require('./routes/reviewsRouter');
const bookingRouter = require('./routes/bookingRouter');
const viewRouter = require('./routes/viewRouter');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(
  helmet({
    // если true, то скрипты с внешних сайтов не грузятся
    contentSecurityPolicy: false,
  })
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, // максимум 100 запросов в час с одного IP адреса
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
// теперь при логировании такое не пройдет
// {
//   "email": {"$gte": "sv"},
//   "password": "password123"
// }
app.use(mongoSanitize());

// Data sanitization against XXS
app.use(xss());

// Prevent parameter pollution
// если параметры, например, так прийдут sort=price&sort=name, то применится последний
// если параметр в whitelist, то будут применяться 2 значения - "duration":["5","9"]
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// ROUTES
app.use('/', viewRouter);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', async (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// будет отлавливать ошибки, которые переданы в next
app.use(globalErrorHandler);

module.exports = app;
