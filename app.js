const express = require('express');
const morgan = require('morgan');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/usersRouter');
const app = express();

// MIDDLEWARES
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));
// own middleware
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
