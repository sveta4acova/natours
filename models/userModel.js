const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // work on create or save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false, // при получении объекта юзера не отдавать это поле
  },
});

userSchema.pre('save', async function (next) {
  // если пароль не был изменен, то не нужно его повторно зашифровывать
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // это поле никогда не хранится в бд
  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function (next) {
  // не нужно обновлять объект юзера, если новый пароль такой же как и старый
  if (!this.isModified('password') || this.isNew) return next();

  // тут автор отнимал 1 секунду (1000 миллисекунд), но вроде и так работает
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // отдаем только активных юзеров
  // т.к. с самого начала у юзеров active не завели, то почти у всех сейчас оно равно undefined
  // поэтому вместо active: true, используем active: { $ne: false }
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // JWTTimestamp - дата, когда токен был выпущен
    // она должна быть больше, чем дата установки пароля, после сброса
    // если она меньше, это значит, что токен выпустили до установки пароля
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // для сброса пароля не нужен очень надежный токен
  // т.к. мы предполагаем, что к почте юзера имеет доступ только он
  // поэтому тут используется встроенный пакет crypto
  const resetToken = crypto.randomBytes(16).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
