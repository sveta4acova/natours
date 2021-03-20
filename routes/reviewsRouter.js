const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(authController.protect, reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.createReview
  );

router.route('/:id').get(authController.protect, reviewsController.getReview);

module.exports = router;
