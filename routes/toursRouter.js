const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');

// выполнится только когда урл содержит id (пример мидлвары)
//router.param('id', toursController.checkId);

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
