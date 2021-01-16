const fs = require('fs');
const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    }
  })
}
exports.getUser = (req, res) => {
  const user = users.find(user => user._id === req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
      data: null,
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    }
  });
}
exports.createUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: 'Тут будет инфа о новом юзере',
    }
  })
}
