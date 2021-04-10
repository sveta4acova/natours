const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// все ниже перечисленные роуты будут требовать авторизации
// чтоб не дублировать во всех этих запросах authController.protect, применяем эту функцию как мидлвару
router.use(authController.protect);

router.patch('/update-my-password', authController.updatePassword);

router.patch('/update-me', usersController.updateMe);

router.delete('/delete-me', usersController.deleteMe);

router.get('/me', usersController.getMe, usersController.getUser);


router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
