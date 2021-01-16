const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, val) => {
  if (val.id * 1 > tours.length) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Invalid ID',
      });
  }

  next();
}

exports.checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res
      .status(400)
      .json({
        status: 'failed',
        message: 'Не указаны все обязательные параметры',
      })
  }

  next();
}

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
};

exports.createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id}, req.body)
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res
      .status(201)
      .json({
        status: 'success',
        data: {
          tour: newTour,
        }
      })
  });
};

exports.getTour = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      data: {
        tour: tours.find(item => item.id === +req.params.id),
      }
    });
};
