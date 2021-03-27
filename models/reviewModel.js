const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// чтобы один юзер писал на тур только один отзыв
reviewSchema.index({ tour: 1, user: 1 }, { unique: true, dropDups: true });

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this - это модель, только у модели есть метод aggregate
  // статичные методы имеют доступ к модели
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingAverage: stats[0] ? stats[0].avgRating : 4.5,
    ratingQuantity: stats[0] ? stats[0].nRating : 0,
  });
};

reviewSchema.post('save', function () {
  // this points to current review
  // this constructor points to model
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name,',
  // }).populate({
  //   path: 'user',
  //   select: 'name',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // тут у нас есть доступ к модели отзыва
  // сохраняем в нее отзыв, чтобы в мидлваре post иметь доступ к ид тура
  // тут мы получим текущий отзыв из базы данных, т.е. над ним еще не совершены действия, начинающиеся с findOneAnd
  // нам важен ид тура
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
