const express = require('express');
const morgan = require('morgan');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/usersRouter');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const app = express();

// MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

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

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

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
