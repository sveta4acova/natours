const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword
);

router.patch('/update-me', authController.protect, usersController.updateMe);

router.delete('/delete-me', authController.protect, usersController.deleteMe);

router.get(
  '/me',
  authController.protect,
  usersController.getMe,
  usersController.getUser
);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router.route('/:id').get(usersController.getUser);

module.exports = router;
