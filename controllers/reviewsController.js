const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res) => {
  const filter = {};

  if (req.params.tourId) {
    filter.tour = req.params.tourId;
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);
