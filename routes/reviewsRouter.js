const express = require('express');
// мы с tourRouter сделали сюда переадресацию, поэтому нам нужен доступ к параметрам того запроса
const router = express.Router({ mergeParams: true });
const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewsController.setTourUserIds,
    reviewsController.createReview
  );

router
  .route('/:id')
  .get(reviewsController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewsController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewsController.updateReview
  );

module.exports = router;
