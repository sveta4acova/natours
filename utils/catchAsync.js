module.exports = (fn) => {
  return (res, req, next) => {
    // fn(res, req, next).catch(err => next(err));
    fn(res, req, next).catch((err) => {
      next(err);
    });
  };
};
