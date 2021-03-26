const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('../models/userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      minlength: [10, 'Минимальное кол-во символов - 10'],
      maxlength: [20, 'Максимальное кол-во символов - 20'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Максимальный рейтинг - 5'],
      min: [1, 'Минимальный рейтинг - 1'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price', // ({VALUE}) - фича монгуса
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //никогда не получать это поле
    },
    startDates: [Date],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({price: 1});
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// req.query не повлияет на виртуальные свойства
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  // отзыв ссылается на тур через поле tour
  foreignField: 'tour',
  // ид, полученный из поля tour объекта отзыва, должен совпадать с полем _id тура
  localField: '_id',
});

// document middleware, before event - .save() or .create() in db
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

// after .save() or .create()
tourSchema.post('save', function (doc, next) {
  // console.log('doc in post save', doc);
  next();
});

// query middleware / сработает перед всеми find - find, findOne и т.п.
tourSchema.pre(/^find/, function (next) {
  // this - группа документов
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

// четыре типа мидлвар в монгусе - document, query, aggregate, model
module.exports = Tour;
