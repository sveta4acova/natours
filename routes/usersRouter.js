const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router.route('/:id').get(usersController.getUser);

module.exports = router;
