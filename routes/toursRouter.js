const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewsRouter');

// выполнится только когда урл содержит id (пример мидлвары)
//router.param('id', toursController.checkId);

// Можно сделать так
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
// а можно ничего дополнительно не описывать и просто сделать переадресацию на соответ. роут
// роут для отзывов в приложении имеет такой путь '/api/v1/reviews'
// поэтому все, что дальше tourId должно соответствовать роутингу отзывов
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours, toursController.getAllTours);

router.route('/tours-stats').get(toursController.getToursStats);

router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, toursController.getAllTours)
  .post(toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTour
  );

module.exports = router;
