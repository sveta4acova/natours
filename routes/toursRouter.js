const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');

// выполнится только когда урл содержит id
router.param('id', toursController.checkId);

router
  .route('/')
  .get(toursController.getAllTours)
  .post(toursController.checkBody, toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTour);

module.exports = router;
