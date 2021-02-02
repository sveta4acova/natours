const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  const user = users.find((user) => user._id === req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
exports.createUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: 'Тут будет инфа о новом юзере',
    },
  });
};
