const express = require('express');
// мы с tourRouter сделали сюда переадресацию, поэтому нам нужен доступ к параметрам того запроса
const router = express.Router({ mergeParams: true });
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

router
  .route('/:id')
  .get(authController.protect, reviewsController.getReview)
  .delete(authController.protect, reviewsController.deleteReview);

module.exports = router;
