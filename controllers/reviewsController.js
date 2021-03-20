const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

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
  const review = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
