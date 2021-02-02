const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router.route('/:id').get(usersController.getUser);

module.exports = router;
